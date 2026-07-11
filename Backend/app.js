const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const flashCardRoutes = require('./routes/flashCardRoutes');
const groupRoutes = require('./routes/groupRoutes');

if (!process.env.JWT_SECRET) {
    console.log('Error starting server: Missing JWT_SECRET environment variable.');
    process.exit(1);
}

const app = express();

// Middleware
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
}));
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('Connected to backend server (watch test 2)');
});


app.use('/auth', authRoutes);
app.use('/notes', noteRoutes);
app.use('/flashcards', flashCardRoutes);
app.use('/groups', groupRoutes);

// 404 handler for unmatched routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Centralized error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

module.exports = app;
