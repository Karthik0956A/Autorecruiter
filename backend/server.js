require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');
const errorHandler = require('./src/middleware/error');

// Initialize app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/jd', require('./src/routes/jd'));
app.use('/api/candidates', require('./src/routes/candidates'));
app.use('/api', require('./src/routes/matching'));
app.use('/api/analytics', require('./src/routes/analytics'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    uptime_seconds: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'TalentSense AI API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      jobDescriptions: '/api/jd',
      candidates: '/api/candidates',
      matching: '/api/match',
      feedback: '/api/feedback',
      analytics: '/api/analytics'
    }
  });
});

// Error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║   TalentSense AI Backend Server       ║
  ║   Running on port ${PORT}                ║
  ║   Environment: ${process.env.NODE_ENV}          ║
  ╚═══════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});

module.exports = app;
