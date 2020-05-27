const express = require('express');
const router = express.Router();
const passport = require('passport');

// Project model
const Project = require('../../models/Project');
// Profile model
const Profile = require('../../models/Profile');

// Validation
const validateProjectInput = require('../../validation/project');

// @route  GET api/projects
// @desc   Get all the projects for the user
// @access Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    Project.find({user: req.user.id})
        .sort({_id: -1}) // Show latest projects first
        .then(projects => res.json(projects))
        .catch(() => res.status(404).json({posts_not_found: 'No post was found for the given user'}));
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
                .catch(() => res.status(404).json({post_not_found: 'No post was found with the given id'}));
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
                .catch(() => res.status(404).json({post_not_found: 'No post was found with the given id'}));
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
                    project.remove().then(() => res.json({success: true, message: 'The post was successfully deleted.'}));
                })
                .catch(() => res.status(404).json({post_not_found: 'No post was found with the given id'}));
        })
        .catch(err => res.status(500).json(err));
});

module.exports = router;
