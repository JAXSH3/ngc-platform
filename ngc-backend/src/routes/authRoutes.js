const express = require('express');
const {
    signup,
    login,
    getProfile,
    logout,
    updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.post('/logout', protect, logout); // Changed to POST as per common practice, can be GET
router.put('/update-profile', protect, updateProfile);

// Optional: Email verification routes
// router.get('/verifyemail/:token', verifyEmail);
// router.post('/resendverifyemail', protect, resendVerificationEmail);

// Optional: Password reset routes
// router.post('/forgotpassword', forgotPassword);
// router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;