// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login } = require('../services/loginService');
const { signUp} = require('../services/signupService');

router.post('/signup', signUp);
router.post('/login', login);

module.exports = router;
