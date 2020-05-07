const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

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
    User.findOne({email: req.body.email})
        .then(user => {
            if (user) {
                return res.status(400).json({email: 'Email already exists'});
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
                            .then(user => res.json(user))
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
    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({email})
        .then(user => {
            // Check for user
            if (!user) {
                return res.status(404).json({email: 'User not found'});
            }


            // Check Password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // User Matched
                        // Create JWT Payload
                        const payload = {
                            id: user.id,
                            username: user.username
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
                        return res.status(400).json({password: 'Password incorrect'});
                    }
                });
        });
});

module.exports = router;
