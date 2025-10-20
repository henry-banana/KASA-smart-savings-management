const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/auth.controller.js')
const validateSignup = require('../middleware/signup/validateSignup.middleware.js');

router.post('/signup', validateSignup, signup);
router.post('/login', login);

module.exports = router;
