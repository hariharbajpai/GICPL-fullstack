// utils/dynamo.js
const { DynamoDBClient, ListTablesCommand, DescribeTableCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

// ---- Env ----
const REGION = process.env.AWS_REGION;
const KEY = process.env.AWS_ACCESS_KEY_ID;
const SECRET = process.env.AWS_SECRET_ACCESS_KEY;
const MAX_ATTEMPTS = Number(process.env.AWS_MAX_ATTEMPTS || 3);
const NODE_ENV = process.env.NODE_ENV || "development";
const DDB_ENDPOINT = process.env.AWS_DYNAMODB_ENDPOINT || undefined;
const DDB_PLAYERS = process.env.DDB_PLAYERS || ""; // optional, for table check

if (!REGION) throw new Error("[dynamo] Missing AWS_REGION");

// Prefer default chain if creds absent
const clientConfig = {
  region: REGION,
  maxAttempts: Number.isFinite(MAX_ATTEMPTS) ? MAX_ATTEMPTS : 3,
  ...(DDB_ENDPOINT ? { endpoint: DDB_ENDPOINT } : {}),
  ...(KEY && SECRET
    ? { credentials: { accessKeyId: KEY, secretAccessKey: SECRET } }
    : {}),
};

const base = new DynamoDBClient(clientConfig);

const ddb = DynamoDBDocumentClient.from(base, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: true,
  },
  // unmarshallOptions: { wrapNumbers: false }, // keep numbers as JS numbers
});

// ---- Dev-only error visibility ----
ddb.middlewareStack.addRelativeTo(
  (next) => async (args) => {
    try {
      return await next(args);
    } catch (err) {
      if (NODE_ENV !== "production") {
        console.error("[dynamo] request failed", {
          name: err?.name,
          message: err?.message,
          $metadata: err?.$metadata,
        });
      }
      throw err;
    }
  },
  { relation: "after", toMiddleware: "retryMiddleware" }
);

// ---- Timeout + normalized errors ----
function withTimeout(promise, ms, controller) {
  if (!ms) return promise;
  const t = setTimeout(() => controller.abort(), ms);
  return promise.finally(() => clearTimeout(t));
}

/**
 * send(command, { timeoutMs })
 * Normalizes AWS errors -> { httpStatus, awsCode, message, ... }
 */
async function send(command, opts = {}) {
  const controller = new AbortController();
  const { timeoutMs = Number(process.env.AWS_DDB_TIMEOUT_MS || 5000) } = opts;

  try {
    const p = ddb.send(command, { abortSignal: controller.signal });
    return await withTimeout(p, timeoutMs, controller);
  } catch (e) {
    const meta = e?.$metadata || {};
    const normalized = {
      ok: false,
      httpStatus: meta.httpStatusCode || 500,
      awsCode: e?.name || "UnknownDynamoError",
      message: e?.message || "DynamoDB request failed",
      requestId: meta.requestId,
      cfId: meta.cfId,
      attempts: meta.attempts,
      totalRetryDelay: meta.totalRetryDelay,
      _raw: NODE_ENV !== "production" ? e : undefined,
    };
    if (normalized.awsCode === "ConditionalCheckFailedException") normalized.httpStatus = 409;
    if (normalized.awsCode === "ResourceNotFoundException") normalized.httpStatus = 404;
    throw normalized;
  }
}

/**
 * Startup connection check:
 * - If DDB_PLAYERS is set -> DescribeTable that table
 * - Else -> ListTables(1)
 * Logs success/failure; does not throw (so server can still boot).
 */
async function testDynamoConnection() {
  try {
    if (DDB_PLAYERS) {
      await base.send(new DescribeTableCommand({ TableName: DDB_PLAYERS }));
      console.log(`✅ DynamoDB connected • Table "${DDB_PLAYERS}" is available`);
    } else {
      await base.send(new ListTablesCommand({ Limit: 1 }));
      console.log("✅ DynamoDB connected successfully");
    }
  } catch (err) {
    console.error(
      "❌ DynamoDB connection failed:",
      err?.name || "Error",
      "-",
      err?.message || err
    );
  }
}

module.exports = {
  base,
  ddb,
  send,
  testDynamoConnection, // <- call this from index.js at startup
};
