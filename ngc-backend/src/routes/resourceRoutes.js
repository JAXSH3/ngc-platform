const express = require('express');
const {
    getResources,
    getResource,
    createResource,
    updateResource,
    deleteResource,
} = require('../controllers/resourceController');

const { protect, authorize, isPremiumUser } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route to get all resources (can be filtered)
router.route('/')
    .get(getResources)
    .post(protect, createResource); // Users can contribute, admins can also create

// Route for specific resource by ID
// The protect middleware here ensures user is logged in for potentially premium resources.
// The controller logic for getResource will further check if the resource.isPremium and if req.user.isPremium.
router.route('/:id')
    .get(protect, getResource) // Protect to check for user context for premium resources
    .put(protect, updateResource) // Owner or admin
    .delete(protect, authorize('admin'), deleteResource); // Admin only for direct delete, or owner via controller logic

module.exports = router;