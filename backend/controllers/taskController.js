import asyncHandler from 'express-async-handler';
import Task from '../models/taskModel.js';
import Project from '../models/projectModel.js';

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, project: projectId } = req.body;

  // Verify project exists and belongs to user
  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (project.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to add tasks to this project');
  }

  const task = await Task.create({
    title,
    description,
    status,
    project: projectId,
    user: req.user._id,
    completedAt: status === 'Completed' ? new Date() : null,
  });

  if (task) {
    res.status(201).json(task);
  } else {
    res.status(400);
    throw new Error('Invalid task data');
  }
});

// @desc    Get all tasks for a user or for a specific project
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.query;
  
  const filter = { user: req.user._id };
  if (projectId) {
    // Verify project exists and belongs to user
    const project = await Project.findById(projectId);
    if (!project || project.user.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error('Project not found');
    }
    filter.project = projectId;
  }
  
  const tasks = await Task.find(filter);
  res.status(200).json(tasks);
});

// @desc    Get a task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task && task.user.toString() === req.user._id.toString()) {
    res.status(200).json(task);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;

  const task = await Task.findById(req.params.id);

  if (task && task.user.toString() === req.user._id.toString()) {
    // Update completedAt if status is being changed to Completed
    const wasCompleted = task.status === 'Completed';
    const isNowCompleted = status === 'Completed';
    
    task.title = title || task.title;
    task.description = description || task.description;
    
    if (status) {
      task.status = status;
      if (!wasCompleted && isNowCompleted) {
        task.completedAt = new Date();
      } else if (wasCompleted && !isNowCompleted) {
        task.completedAt = null;
      }
    }

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task && task.user.toString() === req.user._id.toString()) {
    await Task.deleteOne({ _id: task._id });
    res.status(200).json({ message: 'Task removed' });
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

export {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};