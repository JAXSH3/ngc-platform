const express = require('express');
const {
    getPosts,
    createPost,
    likePost,
    commentPost,
    deletePost,
    deleteComment,
} = require('../controllers/communityController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/posts')
    .get(getPosts) // Public or protect based on app requirements
    .post(protect, createPost);

router.route('/posts/:id')
    .delete(protect, deletePost); // Owner or admin (logic in controller)

router.route('/posts/:id/like')
    .post(protect, likePost);

router.route('/posts/:id/comment')
    .post(protect, commentPost);

router.route('/posts/:postId/comments/:commentId')
    .delete(protect, deleteComment); // Comment owner, post owner, or admin

module.exports = router;