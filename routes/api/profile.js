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
    const {errors, isValid} = validateProfileInput(req.body);

    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // Get fields
    const profileFeilds = {};
    profileFeilds.user = req.user.id;
    if (req.body.first_name) profileFeilds.first_name = req.body.first_name;
    if (req.body.last_name) profileFeilds.last_name = req.body.last_name;
    if (req.body.avatar) profileFeilds.avatar = req.body.avatar;
    if (req.body.date_of_birth) profileFeilds.date_of_birth = req.body.date_of_birth;
    if (req.body.address) profileFeilds.address = req.body.address;
    if (req.body.country) profileFeilds.country = req.body.country;
    if (req.body.profession ) profileFeilds.profession = req.body.profession;

    Profile.findOne({user: req.user.id})
        .then(profile => {
            if (profile) {
                // Update
                Profile.findOneAndUpdate(
                    {user: req.user.id},
                    {$set: profileFeilds},
                    {new: true}
                ).then(profile => res.json(profile));
            } else {
                // Create

                // Save Profile
                new Profile(profileFeilds).save().then(profile => res.json(profile));
            }
        })
});

module.exports = router;
