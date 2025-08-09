// index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const compression = require('compression');
const dotenv = require('dotenv');
const { cleanEnv, str, num } = require('envalid');

dotenv.config();

/* -------------------- Env -------------------- */
const env = cleanEnv(process.env, {
  PORT: num({ default: 5000 }),
  CLIENT_URL: str({ default: 'http://localhost:5173' }),
  MONGODB_URI: str(),
  JWT_SECRET: str(),
  EMAIL_USER: str({ default: 'placeholder' }),
  EMAIL_PASS: str({ default: 'placeholder' }),
  // Dynamo optional envs used by the ping below:
  AWS_REGION: str({ default: 'ap-south-1' }),
  DDB_PLAYERS: str({ default: '' }),
});
const NODE_ENV = process.env.NODE_ENV || 'development';

/* -------------------- App -------------------- */
const app = express();
const PORT = process.env.PORT || env.PORT;

/* -------------------- Mongo DB -------------------- */
let connectDB;
try { connectDB = require('./utils/db'); } catch { try { connectDB = require('./db'); } catch { connectDB = null; } }
if (connectDB) connectDB();

/* -------------------- Middleware -------------------- */
app.set('trust proxy', 1);

const allowedOrigins = [
  env.CLIENT_URL.replace(/\/$/, ''),
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://gicpl-fullstack-frontend.onrender.com',
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // allow curl/mobile apps
      return allowedOrigins.includes(origin) ? cb(null, true) : cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// Rate limit (only API routes)
app.use(
  ['/api', '/auth'],
  rateLimit({
    windowMs: 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

if (NODE_ENV !== 'production') app.use(morgan('dev'));

/* -------------------- Route helpers -------------------- */
const safeRequire = (p) => { try { return require(p); } catch { return null; } };
const mount = (path, router) => {
  if (router) {
    app.use(path, router);
    console.log(`✓ Mounted ${path}`);
  }
};

/* -------------------- Routes -------------------- */
mount('/api/admin', safeRequire('./routes/adminRoutes'));
mount('/api/matches', safeRequire('./routes/matchRoutes'));
mount('/api/gallery', safeRequire('./routes/galleryRoutes'));
mount('/api/schedule', safeRequire('./routes/scheduleRoutes'));
mount('/api/teams', safeRequire('./routes/teamRoutes'));
mount('/api/admin/teams', safeRequire('./routes/adminTeamRoutes'));
mount('/api/global-links', safeRequire('./routes/globalLinksRoutes'));

// ✅ DynamoDB Players routes
mount('/api/players', safeRequire('./routes/playerDdbRoutes'));

/* -------------------- Health & Static -------------------- */
app.get('/health', (req, res) => res.json({ ok: true, env: NODE_ENV, time: new Date().toISOString() }));

const clientBuild = path.join(__dirname, 'public');
app.use(express.static(clientBuild));
app.get('/', (_req, res) => res.send('GICPL backend is up'));

/* -------------------- 404 & Error Handler -------------------- */
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((err, req, res, _next) => {
  const status = err.status || err.httpStatus || 500;
  const msg = err.message || 'Internal Server Error';
  if (NODE_ENV !== 'production') console.error('✗ Error:', { status, msg });
  res.status(status).json({ success: false, message: msg });
});

/* -------------------- Start -------------------- */
app.listen(PORT, () => {
  console.log(`🚀 Server running on :${PORT}`);
  if (connectDB) console.log('✅ MongoDB connected successfully');
  // Ping Dynamo so you see a startup log:
  pingDynamo();
});

/* -------------------- DynamoDB Ping (startup log) -------------------- */
async function pingDynamo() {
  // Try to reuse your utils/dynamo if present
  let baseClient, testFn;
  try {
    const dyn = require('./utils/dynamo'); // your file
    testFn = dyn.testDynamoConnection; // if you implemented this earlier
    baseClient = dyn.base || dyn.ddb || null;
  } catch {
    baseClient = null;
  }

  if (typeof testFn === 'function') {
    // if helper exists, just call it
    try {
      await testFn();
      // helper logs success/failure itself
      return;
    } catch {
      // fallthrough to raw ping
    }
  }

  // Raw SDK ping (works even if utils/dynamo has only ddb)
  const { DynamoDBClient, ListTablesCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');

  // Use same region as env; credentials resolved by default provider chain if not explicitly set
  const client = new DynamoDBClient({
    region: env.AWS_REGION,
    maxAttempts: 3,
    ...(process.env.AWS_DYNAMODB_ENDPOINT ? { endpoint: process.env.AWS_DYNAMODB_ENDPOINT } : {}),
    ...(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
      ? { credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY } }
      : {}),
  });

  try {
    // If a table name is provided, prefer checking that table exists
    if (env.DDB_PLAYERS) {
      await client.send(new DescribeTableCommand({ TableName: env.DDB_PLAYERS }));
      console.log(`✅ DynamoDB connected • Table "${env.DDB_PLAYERS}" is available`);
    } else {
      // Generic connectivity check
      await client.send(new ListTablesCommand({ Limit: 1 }));
      console.log('✅ DynamoDB connected successfully');
    }
  } catch (err) {
    console.error('❌ DynamoDB connection failed:', err?.name || 'Error', '-', err?.message || err);
  }
}
  