const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

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

module.exports = router;
