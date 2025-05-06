// Importing express to create our router
const express = require('express');
// Creating a router object to handle our routes
const router = express.Router();
const authenticateToken = require('../middleware/auth');

// In-memory storage for tasks
// We're using an array to store our tasks since we don't have a database
let tasks = [];
// Counter to generate unique IDs for each task
let taskId = 1;

// Middleware to validate task data
// This function checks if the required fields are present in the request
const validateTask = (req, res, next) => {
  // Getting title and description from request body
  const { title, description } = req.body;
  
  // Checking if both fields are present
  if (!title || !description) {
    // If any field is missing, send error response
    return res.status(400).json({
      success: false,
      message: 'Title and description are required'
    });
  }
  
  // If validation passes, move to next middleware/route handler
  next();
};

// Helper function to filter tasks
const filterTasks = (tasks, filters) => {
  return tasks.filter(task => {
    // Filter by completion status
    if (filters.completed !== undefined && task.completed !== filters.completed) {
      return false;
    }
    // Filter by title (case-insensitive)
    if (filters.title && !task.title.toLowerCase().includes(filters.title.toLowerCase())) {
      return false;
    }
    // Filter by description (case-insensitive)
    if (filters.description && !task.description.toLowerCase().includes(filters.description.toLowerCase())) {
      return false;
    }
    return true;
  });
};

// Helper function to sort tasks
const sortTasks = (tasks, sortBy, order) => {
  return [...tasks].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (order === 'desc') {
      return bValue > aValue ? 1 : -1;
    }
    return aValue > bValue ? 1 : -1;
  });
};

// Route to get all tasks
// GET /tasks
router.get('/', authenticateToken, (req, res) => {
  try {
    // Get query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order || 'desc';
    const filters = {
      completed: req.query.completed === 'true' ? true : 
                 req.query.completed === 'false' ? false : undefined,
      title: req.query.title,
      description: req.query.description
    };

    // Apply filters
    let filteredTasks = filterTasks(tasks, filters);

    // Apply sorting
    filteredTasks = sortTasks(filteredTasks, sortBy, order);

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalTasks = filteredTasks.length;
    const totalPages = Math.ceil(totalTasks / limit);

    // Get tasks for current page
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    // Send response
    res.status(200).json({
      success: true,
      data: paginatedTasks,
      pagination: {
        currentPage: page,
        totalPages,
        totalTasks,
        tasksPerPage: limit
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving tasks',
      error: error.message
    });
  }
});

// Route to get a single task by ID
// GET /tasks/:id
router.get('/:id', authenticateToken, (req, res) => {
  // Find task with matching ID
  // parseInt converts string ID to number
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  
  // If task not found, send 404 error
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }
  
  // Send found task as response
  res.status(200).json({
    success: true,
    data: task
  });
});

// Route to create a new task
// POST /tasks
router.post('/', authenticateToken, validateTask, (req, res) => {
  // Get task data from request body
  const { title, description } = req.body;
  
  // Create new task object
  const newTask = {
    id: taskId++, // Increment ID for next task
    title,
    description,
    completed: false, // New tasks are not completed by default
    createdAt: new Date().toISOString(), // Store creation timestamp
    userId: req.user.id // Add user ID to task
  };
  
  // Add new task to our array
  tasks.push(newTask);
  
  // Send success response with created task
  res.status(201).json({
    success: true,
    data: newTask
  });
});

// Route to update an existing task
// PUT /tasks/:id
router.put('/:id', authenticateToken, validateTask, (req, res) => {
  // Find index of task to update
  const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
  
  // If task not found, send 404 error
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }
  
  // Check if user owns the task
  if (tasks[taskIndex].userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this task'
    });
  }
  
  // Get updated data from request body
  const { title, description } = req.body;
  
  // Update task while preserving other properties
  tasks[taskIndex] = {
    ...tasks[taskIndex], // Keep existing properties
    title,
    description,
    updatedAt: new Date().toISOString() // Add update timestamp
  };
  
  // Send success response with updated task
  res.status(200).json({
    success: true,
    data: tasks[taskIndex]
  });
});

// Route to delete a task
// DELETE /tasks/:id
router.delete('/:id', authenticateToken, (req, res) => {
  // Find index of task to delete
  const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
  
  // If task not found, send 404 error
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }
  
  // Check if user owns the task
  if (tasks[taskIndex].userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this task'
    });
  }
  
  // Store task before deleting for response
  const deletedTask = tasks[taskIndex];
  // Remove task from array
  tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
  
  // Send success response with deleted task
  res.status(200).json({
    success: true,
    data: deletedTask
  });
});

// Export router to use in main server file
module.exports = router; 