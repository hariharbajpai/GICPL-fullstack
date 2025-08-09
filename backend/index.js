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

// Routes
const adminRoutes = require('./routes/adminRoutes');
const matchRoutes = require('./routes/matchRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const teamRoutes = require('./routes/teamRoutes.js'); // ✅ teams

dotenv.config();

// 🔹 Validate Environment Variables
const env = cleanEnv(process.env, {
  PORT: num({ default: 5000 }),
  CLIENT_URL: str({ default: 'https://gicpl-fullstack-frontend.onrender.com' }),
  MONGODB_URI: str(),
  JWT_SECRET: str(),
  EMAIL_USER: str(),
  EMAIL_PASS: str(),
});

const app = express();
const PORT = env.PORT;

// Behind Render/NGINX/Cloudflare
app.set('trust proxy', 1);

// 🔹 Connect to MongoDB
connectDB();

// 🔹 Security Middlewares
const allowedOrigins = env.CLIENT_URL.split(',').map(s => s.trim());
// add common local dev origins if not present
['http://localhost:5173', 'http://localhost:3000'].forEach(o => {
  if (!allowedOrigins.includes(o)) allowedOrigins.push(o);
});

app.use(cors({
  origin: (origin, callback) => {
    // allow non-browser clients (no Origin) and exact matches
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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

// 🔹 Rate Limiting
const createRateLimiter = (maxRequests, windowMs, message) => rateLimit({
  windowMs,
  max: maxRequests,
  message: { success: false, message },
  headers: true,
});

app.use('/api/', createRateLimiter(200, 10 * 60 * 1000, 'Too many requests, try later.'));
app.use('/api/admin', createRateLimiter(50, 10 * 60 * 1000, 'Too many admin requests, slow down.'));
app.use('/api/auth', createRateLimiter(20, 10 * 60 * 1000, 'Too many authentication requests, slow down.'));

// 🔹 Static File Serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🔹 API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/teams', teamRoutes); // ✅ teams

// 🔹 Health Check Endpoint
app.get('/api/health', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.status(200).json({ success: true, message: 'Server and database are healthy' });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(500).json({ success: false, message: 'Server is unhealthy' });
  }
});

// 🔹 404 Middleware
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// 🔹 Global Error Handler
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

// 🔹 Start Server
const server = app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

// 🔹 Graceful Shutdown
const shutdown = (signal) => {
  console.log(`🛑 ${signal} received. Closing server...`);
  server.close(async () => {
    console.log('✅ Server shutdown complete.');
    await mongoose.connection.close();
    process.exit(0);
  });
  setTimeout(() => {
    console.error('❌ Forcing server shutdown...');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
  
