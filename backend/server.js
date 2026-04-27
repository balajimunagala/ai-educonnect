const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware — allows the server to read JSON and accept requests from React
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Test route — just to confirm the server works
app.get('/', (req, res) => {
  res.json({ message: '🚀 AI-EduConnect API is running!' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
});