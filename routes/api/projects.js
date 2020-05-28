const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load models
const Project = require('../../models/Project');
const Profile = require('../../models/Profile');
const Task = require('../../models/Task');

// Validation
const validateProjectInput = require('../../validation/project');
const validateTaskInput = require('../../validation/task');

// @route  GET api/projects
// @desc   Get all the projects for the user
// @access Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    Project.find({user: req.user.id})
        .sort({_id: -1}) // Show latest projects first
        .then(projects => res.json(projects))
        .catch(() => res.status(404).json({projects_not_found: 'No project was found for the given user'}));
});

// @route  POST api/projects
// @desc   Create project
// @access Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validateProjectInput(req.body);

    // Check Validation
    if (!isValid) {
        // If any errors, send 400 with errors object
        return res.status(400).json(errors);
    }

    const newProject = new Project({
        user: req.user.id,
        category: req.body.category,
        name: req.body.name
    });

    newProject.save()
        .then(project => res.json(project))
        .catch(err => res.status(500).json(err));
});

// @route  GET api/projects/:id
// @desc   Get a user project by id
// @access Private
router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id})
        .then(() => {
            Project.findById(req.params.id)
                .then(project => {
                    // Check for project owner
                    if (project.user.toString() !== req.user.id) {
                        return res.status(401).json({success: false, message: 'The user is not authorized'});
                    }

                    // Return the project
                    res.json(project);
                })
                .catch(() => res.status(404).json({project_not_found: 'No project was found with the given id'}));
        })
        .catch(err => res.status(500).json(err));
});

// @route  PUT api/projects/:id
// @desc   Update a user project by id
// @access Private
router.put('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validateProjectInput(req.body);

    // Check Validation
    if (!isValid) {
        // If any errors, send 400 with errors object
        return res.status(400).json(errors);
    }

    Profile.findOne({user: req.user.id})
        .then(() => {
            Project.findById(req.params.id)
                .then(project => {
                    // Check for project owner
                    if (project.user.toString() !== req.user.id) {
                        return res.status(401).json({success: false, message: 'The user is not authorized'});
                    }

                    // Set project fields from request
                    project.category = req.body.category;
                    project.name = req.body.name;

                    // Update the project
                    project.save()
                        .then(project => res.json(project))
                        .catch(err => res.status(500).json(err));
                })
                .catch(() => res.status(404).json({project_not_found: 'No project was found with the given id'}));
        })
        .catch(err => res.status(500).json(err));
});

// @route  DELETE api/projects/:id
// @desc   Delete a user project by id
// @access Private
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id})
        .then(() => {
            Project.findById(req.params.id)
                .then(project => {
                    // Check for project owner
                    if (project.user.toString() !== req.user.id) {
                        return res.status(401).json({success: false, message: 'The user is not authorized'});
                    }

                    // Delete the project
                    project.remove().then(() => res.json({success: true, message: 'The project was successfully deleted.'}));
                })
                .catch(() => res.status(404).json({project_not_found: 'No project was found with the given id'}));
        })
        .catch(err => res.status(500).json(err));
});

// @route  POST api/projects/:id/tasks
// @desc   Create task under a project
// @access Private
router.post('/:id/tasks', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validateTaskInput(req.body);

    // Check Validation
    if (!isValid) {
        // If any errors, send 400 with errors object
        return res.status(400).json(errors);
    }

    Project.findById(req.params.id)
        .then(project => {
            // Check for project owner
            if (project.user.toString() !== req.user.id) {
                return res.status(401).json({success: false, message: 'The user is not authorized'});
            }

            // Create a new task under the project
            const newTask = new Task({
                project: project.id,
                name: req.body.name
            });

            newTask.save()
                .then(task => res.json(task))
                .catch(err => res.status(500).json(err));
        })
        .catch(() => res.status(404).json({project_not_found: 'No project was found with the given id'}));
});

// @route  DELETE api/projects/:id/tasks/:task_id
// @desc   Delete specified task under a project
// @access Private
router.delete('/:id/tasks/:task_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Project.findById(req.params.id)
        .then(project => {
            // Check for project owner
            if (project.user.toString() !== req.user.id) {
                return res.status(401).json({success: false, message: 'The user is not authorized'});
            }

            Task.findById(req.params.task_id)
                .then(task => {
                    // Check for task association
                    if (task.project.toString() !== req.params.id) {
                        return res.status(401).json({success: false, message: 'The task is not associated with the project'});
                    }

                    // Delete the task
                    task.remove().then(() => res.json({success: true, message: 'The task was successfully deleted.'}));
                })
                .catch(() => res.status(404).json({task_not_found: 'No task was found with the given id'}));

            // newTask.save()
            //     .then(task => res.json(task))
            //     .catch(err => res.status(500).json(err));
        })
        .catch(() => res.status(404).json({project_not_found: 'No project was found with the given id'}));
});

module.exports = router;
