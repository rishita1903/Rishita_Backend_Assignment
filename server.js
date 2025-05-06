// Importing required modules
// express is a web framework for Node.js that makes it easy to create web applications
const express = require('express');
// cors helps us handle cross-origin requests (when frontend and backend are on different domains)
const cors = require('cors');
// Importing our task routes from a separate file to keep code organized
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Set default JWT secret if not in environment
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your_super_secret_key_123';
}

// Set default JWT expiration if not in environment
if (!process.env.JWT_EXPIRES_IN) {
  process.env.JWT_EXPIRES_IN = '24h';
}

// Creating an Express application
const app = express();
// Setting up the port number - if not specified in environment, use 3000
const PORT = process.env.PORT || 3000;

// Middleware setup
// cors() allows requests from different origins
app.use(cors());
// express.json() helps parse JSON data from request body
app.use(express.json());

// Setting up routes
// All routes starting with /tasks will be handled by taskRoutes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Error handling middleware
// This catches any errors that occur in our application
app.use((err, req, res, next) => {
  // Log the error to console for debugging
  console.error(err.stack);
  // Send error response to client
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    // Only show detailed error in development mode
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler - for routes that don't exist
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 