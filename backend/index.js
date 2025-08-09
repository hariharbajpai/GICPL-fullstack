// index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const compression = require('compression');
const { cleanEnv, str, num } = require('envalid');
const mongoose = require('mongoose');
const connectDB = require('./utils/db');

dotenv.config();

/* -------------------- Env -------------------- */
const env = cleanEnv(process.env, {
  PORT: num({ default: 5000 }),
  CLIENT_URL: str({ default: 'https://gicpl-fullstack-frontend.onrender.com' }),
  MONGODB_URI: str(),
  JWT_SECRET: str(),
  EMAIL_USER: str(),
  EMAIL_PASS: str(),
});

const app = express();
// Prefer Render’s assigned port, fallback to validated env
const PORT = process.env.PORT || env.PORT;

/* -------------------- Trust proxy -------------------- */
app.set('trust proxy', 1);

/* -------------------- DB -------------------- */
connectDB();

/* -------------------- Security / Core middleware -------------------- */
const allowedOrigins = env.CLIENT_URL.split(',').map(s => s.trim());
['http://localhost:5173', 'http://localhost:3000'].forEach(o => {
  if (!allowedOrigins.includes(o)) allowedOrigins.push(o);
});

app.use(cors({
  origin: (origin, callback) => {
    // allow same-origin/no-origin tools (curl, Postman) and exact matches
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  frameguard: { action: 'deny' },
  noSniff: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(compression());
app.use(morgan('[:date[iso]] ":method :url" :status - :response-time ms'));

/* -------------------- Rate limiting -------------------- */
// keep health endpoints snappy: do NOT rate-limit /api/health or /healthz
const createRateLimiter = (maxRequests, windowMs, message) => rateLimit({
  windowMs,
  max: maxRequests,
  message: { success: false, message },
  headers: true,
});

app.use('/api/', createRateLimiter(200, 10 * 60 * 1000, 'Too many requests, try later.'));
app.use('/api/admin', createRateLimiter(50, 10 * 60 * 1000, 'Too many admin requests, slow down.'));
app.use('/api/auth', createRateLimiter(20, 10 * 60 * 1000, 'Too many authentication requests, slow down.'));

/* -------------------- Static -------------------- */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* -------------------- Routes -------------------- */
const adminRoutes = require('./routes/adminRoutes');
const matchRoutes = require('./routes/matchRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const teamRoutes = require('./routes/teamRoutes.js');

// ✅ NEW: Global links (make sure the file exists)
let globalLinksRoutes = null;
try {
  globalLinksRoutes = require('./routes/globalLinksRoutes');
  app.use('/api/global-links', globalLinksRoutes);
  console.log('✓ Mounted /api/global-links');
} catch (e) {
  console.log('✗ routes/globalLinksRoutes not found; /api/global-links will 404');
}

app.use('/api/admin', adminRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/teams', teamRoutes);

/* -------------------- Health -------------------- */
// Fast healthz for Render (no DB call)
app.get('/healthz', (req, res) => res.sendStatus(200));

// Deeper health (DB ping)
app.get('/api/health', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.status(200).json({ success: true, message: 'Server and database are healthy' });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(500).json({ success: false, message: 'Server is unhealthy' });
  }
});

// Friendly root
app.get('/', (req, res) => {
  res.status(200).json({ ok: true, message: 'GICPL API running' });
});

/* -------------------- 404 -------------------- */
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

/* -------------------- Global Error -------------------- */
app.use((err, req, res, next) => {
  console.error(`❌ Error: ${err.message}`);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

/* -------------------- Start -------------------- */
const server = app.listen(PORT, () => console.log(`🚀 Server running on :${PORT}`));

/* -------------------- Graceful shutdown -------------------- */
const shutdown = (signal) => {
  console.log(`🛑 ${signal} received. Closing server...`);
  server.close(async () => {
    try {
      await mongoose.connection.close();
    } catch (e) {
      console.error('Error closing DB:', e);
    }
    console.log('✅ Server shutdown complete.');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('❌ Forcing server shutdown...');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Don’t hard-exit the process on unhandledRejection—log it.
// Render will still restart if the process crashes.
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
