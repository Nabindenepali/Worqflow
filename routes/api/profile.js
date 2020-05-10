const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load Input Validation
const validateProfileInput = require('../../validation/profile');

// Load Profile model
const Profile = require('../../models/Profile');

// @route  GET api/auth/test
// @desc   Tests profile route
// @access Public
router.get('/test', (req, res) => res.json({msg: 'Testing for Profile'}));

// @route  GET api/profile
// @desc   Get current user's profile
// @access Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const errors = {};

    Profile.findOne({user: req.user.id})
        .populate('user', ['username', 'email'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

// @route  POST api/profile
// @desc   Create or edit user profile
// @access Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validateProfileInput(req.body, req.files);

    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.first_name) profileFields.first_name = req.body.first_name;
    if (req.body.last_name) profileFields.last_name = req.body.last_name;
    if (req.body.date_of_birth) profileFields.date_of_birth = req.body.date_of_birth;
    if (req.body.address) profileFields.address = req.body.address;
    if (req.body.country) profileFields.country = req.body.country;
    if (req.body.profession ) profileFields.profession = req.body.profession;

    // Handle avatar upload
    if (req.files) {
        try {
            // Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            const avatar = req.files.avatar;

            // Encode the filename in Base64
            const fileName = avatar.name.split('.');
            const buffer = new Buffer(fileName[0]);
            const newFileName = buffer.toString('base64') + '.' + fileName[1];

            // Use the mv() method to place the file in upload directory (i.e. "uploads")
            avatar.mv('./uploads/avatars/' + newFileName);

            // Save the fileName as avatar field
            profileFields.avatar = newFileName;
        } catch (err) {
            res.status(500).send(err);
        }
    }

    Profile.findOne({user: req.user.id})
        .then(profile => {
            if (profile) {
                // Update
                Profile.findOneAndUpdate(
                    {user: req.user.id},
                    {$set: profileFields},
                    {new: true}
                ).then(profile => res.json(profile));
            } else {
                // Create

                // Save Profile
                new Profile(profileFields).save().then(profile => res.json(profile));
            }
        })
});

module.exports = router;
