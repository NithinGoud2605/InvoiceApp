require('dotenv').config();
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const sequelize = require('./config/sequelize');
const apiRoutes = require('./routes/index');
const validateEnvironment = require('./utils/envValidator');
const errorHandler = require('./middlewares/errorHandler');
const { requireAuth } = require('./middlewares/authMiddleware');

validateEnvironment();

const app = express();
const port = process.env.PORT;

// Security
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Too many requests, please try again later'
});

app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Example protected route:
app.get('/api/protected', requireAuth, (req, res) => {
  res.json({ message: `You are authenticated as ${req.user.email}` });
});

// Use your main routes
app.use('/api', apiLimiter, apiRoutes);

// Use error handler
app.use(errorHandler);

// Start server with force sync for this run
async function startServer() {
  try {
    await sequelize.authenticate();
    // Force sync: drops and recreates all tables (use only in development/testing)
    await sequelize.sync({ alter: true });
    
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
}

startServer();
