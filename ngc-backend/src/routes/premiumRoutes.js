const express = require('express');
const {
    getPremiumResources,
    subscribe,
    cancelSubscription
} = require('../controllers/premiumController');
const { protect, isPremiumUser } = require('../middleware/authMiddleware');

const router = express.Router();

// This route is for fetching resources specifically marked as premium,
// and access is gated by the isPremiumUser middleware.
router.get('/resources', protect, isPremiumUser, getPremiumResources);

// Payment related routes (stubs for now)
router.post('/payment/subscribe', protect, subscribe);
router.post('/payment/cancel-subscription', protect, cancelSubscription); // Added cancel route

module.exports = router;