const express = require('express');
const { smartQuery } = require('../controllers/searchController');
// const { protect } = require('../middleware/authMiddleware'); // Optional: protect if search is not public

const router = express.Router();

// router.post('/smart-query', protect, smartQuery); // If search requires login
router.post('/smart-query', smartQuery); // Public for now

module.exports = router;