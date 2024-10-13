const Router = require('express');
const router = new Router();
const authController = require('../controllers/authController');


router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.post('/forgot-password', authController.forgotPassword);
router.get('/verify-email/:link', authController.verifyEmail);

module.exports = router;