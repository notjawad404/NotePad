const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

const registerValidation = [
    body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
    body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter')
        .matches(/\d/).withMessage('Password must contain at least one number'),
];

const loginValidation = [
    body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
];

const updateProfileValidation = [
    body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
    body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
];

const changePasswordValidation = [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
        .matches(/[a-zA-Z]/).withMessage('New password must contain at least one letter')
        .matches(/\d/).withMessage('New password must contain at least one number'),
];

router.post('/register', registerLimiter, registerValidation, validate, register);
router.post('/login', loginLimiter, loginValidation, validate, login);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfileValidation, validate, updateProfile);
router.put('/password', protect, changePasswordValidation, validate, changePassword);

module.exports = router;
