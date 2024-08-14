const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {createTask, getTasks, updateTask, deleteTask, filterTasks, searchTasks } = require('../controllers/task');


router.post('/tasks', authMiddleware, createTask);
router.get('/tasks', authMiddleware, getTasks);
router.put('/tasks/:id', authMiddleware, updateTask);
router.delete('/tasks/:id', authMiddleware, deleteTask);
router.get('/tasks/filter', authMiddleware, filterTasks);
router.get('/tasks/search', authMiddleware, searchTasks);

module.exports = router;
