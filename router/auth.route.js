const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { verifyAccessToken } = require('../helpers/jwt');

// REGISTER
router.post('/register', AuthController.register)

// LOGIN
router.post('/login', AuthController.login)

// FORGOT PASSWORD
router.post('/forgot-password', AuthController.forgotPassword)

// REFRESH TOKEN
router.post('/refresh-token', AuthController.refreshToken)

// LOG OUT
router.post('/logout', AuthController.logout)

// VERIFY EMAIL
router.get('/verifyEmail/:token', AuthController.verifyEmail)

// DIRECT TO RESET PASSWORD
router.get('/directToResetPasswordPage/:token', AuthController.directToResetPasswordPage)

// RESET PASSWORD
router.post('/resetPassword', verifyAccessToken, AuthController.resetPassword)

module.exports = router;