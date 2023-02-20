const express = require('express');
const router = express.Router();
const user = require('../controllers/user');

// Route for user signup
router.post('/signup', user.signup);

// Route for user login
router.post('/login', user.login);

module.exports = router;