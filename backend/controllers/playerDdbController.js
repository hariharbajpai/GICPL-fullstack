// controllers/playerDdbController.js
const { v4: uuid } = require("uuid");
const {
  PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand
} = require("@aws-sdk/lib-dynamodb");
const { ddb } = require("../utils/dynamo");

const T = process.env.DDB_PLAYERS;

// Admin: create player (unique by phone)
exports.createPlayer = async (req, res) => {
  try {
    const { name, phone, jerseyNumber, batting, bowling, fielding, photoUrl, dob, batStyle, bowlStyle } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: "name and phone are required" });
    }
    const now = Date.now();
    const item = {
      phone,                          // PK
      playerId: uuid(),
      name,
      jerseyNumber: jerseyNumber ?? null,
      batting: {
        matches: 0, runs: 0, balls: 0, highest: 0, fifties: 0, hundreds: 0, average: 0, strikeRate: 0,
        ...(batting || {})
      },
      bowling: {
        matches: 0, balls: 0, runsConceded: 0, wickets: 0, best: "0/0", average: 0, economy: 0, fiveFors: 0,
        ...(bowling || {})
      },
      fielding: {
        catches: 0, stumpings: 0, runouts: 0,
        ...(fielding || {})
      },
      photoUrl, dob, batStyle, bowlStyle,
      createdAt: now, updatedAt: now,
    };

    await ddb.send(new PutCommand({
      TableName: T,
      Item: item,
      ConditionExpression: "attribute_not_exists(phone)" // unique by phone
    }));

    res.status(201).json({ success: true, data: item });
  } catch (err) {
    if (err.name === "ConditionalCheckFailedException") {
      return res.status(409).json({ success: false, message: "Player with this phone already exists" });
    }
    console.error("createPlayer error:", err);
    res.status(500).json({ success: false, message: "Internal error" });
  }
};

// Public: get player by phone
exports.getPlayer = async (req, res) => {
  try {
    const phone = decodeURIComponent(req.params.phone);
    const out = await ddb.send(new GetCommand({ TableName: T, Key: { phone } }));
    if (!out.Item) return res.status(404).json({ success: false, message: "Player not found" });
    res.json({ success: true, data: out.Item });
  } catch (err) {
    console.error("getPlayer error:", err);
    res.status(500).json({ success: false, message: "Internal error" });
  }
};

// Admin: update (full/partial)
exports.updatePlayer = async (req, res) => {
  try {
    const phone = decodeURIComponent(req.params.phone);
    const data = req.body;

    const names = {};
    const values = {};
    const sets = [];

    const addSet = (k, v) => {
      const i = sets.length;
      names[`#k${i}`] = k;
      values[`:v${i}`] = v;
      sets.push(`#k${i} = :v${i}`);
    };

    Object.entries(data || {}).forEach(([k, v]) => {
      if (v !== undefined) addSet(k, v);
    });
    addSet("updatedAt", Date.now());

    if (!sets.length) return res.json({ success: true, message: "No changes" });

    const out = await ddb.send(new UpdateCommand({
      TableName: T,
      Key: { phone },
      UpdateExpression: "SET " + sets.join(", "),
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ConditionExpression: "attribute_exists(phone)",
      ReturnValues: "ALL_NEW",
    }));

    res.json({ success: true, data: out.Attributes });
  } catch (err) {
    if (err.name === "ConditionalCheckFailedException") {
      return res.status(404).json({ success: false, message: "Player not found" });
    }
    console.error("updatePlayer error:", err);
    res.status(500).json({ success: false, message: "Internal error" });
  }
};

// Admin: delete
exports.deletePlayer = async (req, res) => {
  try {
    const phone = decodeURIComponent(req.params.phone);
    await ddb.send(new DeleteCommand({
      TableName: T,
      Key: { phone },
      ConditionExpression: "attribute_exists(phone)"
    }));
    res.json({ success: true });
  } catch (err) {
    if (err.name === "ConditionalCheckFailedException") {
      return res.status(404).json({ success: false, message: "Player not found" });
    }
    console.error("deletePlayer error:", err);
    res.status(500).json({ success: false, message: "Internal error" });
  }
};

// Public: list
exports.listPlayers = async (_req, res) => {
  try {
    const out = await ddb.send(new ScanCommand({ TableName: T, Limit: 100 }));
    res.json({ success: true, data: out.Items || [] });
  } catch (err) {
    console.error("listPlayers error:", err);
    res.status(500).json({ success: false, message: "Internal error" });
  }
};
