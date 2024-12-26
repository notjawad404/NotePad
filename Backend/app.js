const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const noteRoutes = require('./routes/noteRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('Connected to backend server');
});
app.use('/notes', noteRoutes);

module.exports = app;