// app.js
const express = require('express');
const app = express();
const apiRoutes = require('./routes/api');
require('dotenv').config();

// Middleware for JSON parsing
app.use(express.json());

// Use API routes
app.use('/api', apiRoutes);

// Start the server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});