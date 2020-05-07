const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User model
const User = require('../../models/User');

// @route  GET api/auth/test
// @desc   Tests auth route
// @access Public
router.get('/test', (req, res) => res.json({msg: 'Testing for Auth'}));

// @route  GET api/auth/register
// @desc   Register user
// @access Public
router.get('/register', (req, res) => {
    const {errors, isValid} = validateRegisterInput(req.body);

    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({email: req.body.email})
        .then(user => {
            if (user) {
                errors.email = 'Email already exists';
                return res.status(400).json(errors);
            } else {
                const newUser = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash ) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(() => res.json({
                                success: true,
                                message: 'Email successfully registered'
                            }))
                            .catch(err => console.log(err));
                    });
                })
            }
        })
});

// @route  GET api/auth/login
// @desc   Login user / Returns JWT Token
// @access Public
router.post('/login', (req, res) => {
    const {errors, isValid} = validateLoginInput(req.body);

    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({email})
        .then(user => {
            // Check for user
            if (!user) {
                errors.email = 'User not found';
                return res.status(404).json(errors);
            }


            // Check Password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // User Matched
                        // Create JWT Payload
                        const payload = {
                            id: user.id,
                            username: user.username,
                            email: user.email
                        };

                        // Sign Token
                        jwt.sign(
                            payload,
                            keys.secretOrKey,
                            {
                                expiresIn: 60*60 // Expires in an hour
                            },
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                });
                            }
                        );
                    } else {
                        errors.password = 'Password incorrect';
                        return res.status(400).json(errors);
                    }
                });
        });
});

// @route  GET api/auth/current
// @desc   Return current user
// @access Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({
        id: req.user.id,
        username: req.user.username,
        email: req.user.email
    });
});

module.exports = router;
