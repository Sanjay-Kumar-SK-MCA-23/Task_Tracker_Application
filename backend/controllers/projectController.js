import asyncHandler from 'express-async-handler';
import Project from '../models/projectModel.js';

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  // Check if user already has 4 projects
  const projectCount = await Project.countDocuments({ user: req.user._id });
  
  if (projectCount >= 4) {
    res.status(400);
    throw new Error('Maximum of 4 projects allowed per user');
  }

  const project = await Project.create({
    title,
    description,
    user: req.user._id,
  });

  if (project) {
    res.status(201).json(project);
  } else {
    res.status(400);
    throw new Error('Invalid project data');
  }
});

// @desc    Get all projects for a user
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ user: req.user._id });
  res.status(200).json(projects);
});

// @desc    Get a project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project && project.user.toString() === req.user._id.toString()) {
    res.status(200).json(project);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const project = await Project.findById(req.params.id);

  if (project && project.user.toString() === req.user._id.toString()) {
    project.title = title || project.title;
    project.description = description || project.description;

    const updatedProject = await project.save();
    res.status(200).json(updatedProject);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project && project.user.toString() === req.user._id.toString()) {
    await Project.deleteOne({ _id: project._id });
    res.status(200).json({ message: 'Project removed' });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

export {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};