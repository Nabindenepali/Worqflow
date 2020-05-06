const express = require('express');
const router = express.Router();

// @route  GET api/auth/test
// @desc   Tests worklogs route
// @access Public
router.get('/test', (req, res) => res.json({msg: 'Testing for Worklogs'}));

module.exports = router;
