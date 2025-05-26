const Post = require('../models/Post');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all community posts
// @route   GET /api/v1/community/posts
// @access  Public (or Private if feed requires login)
exports.getPosts = asyncHandler(async (req, res, next) => {
    // Basic pagination (can be enhanced like in resourceController)
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = await Post.countDocuments();
    const posts = await Post.find()
        .populate('userId', 'name email') // Populate user who made the post
        .populate('comments.userId', 'name email') // Populate user for each comment
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit);

    const pagination = {};
    if (endIndex < total) {
        pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
        pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
        success: true,
        count: posts.length,
        total,
        pagination,
        data: posts,
    });
});

// @desc    Create a new community post
// @route   POST /api/v1/community/posts
// @access  Private
exports.createPost = asyncHandler(async (req, res, next) => {
    req.body.userId = req.user.id;

    const post = await Post.create(req.body);
    // Populate user details for the created post response
    const populatedPost = await Post.findById(post._id)
        .populate('userId', 'name email');

    res.status(201).json({
        success: true,
        data: populatedPost,
    });
});

// @desc    Like a community post
// @route   POST /api/v1/community/posts/:id/like
// @access  Private
exports.likePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
    }

    // Check if already liked by this user
    const alreadyLiked = post.likes.find(
        (like) => like.toString() === req.user.id.toString()
    );

    if (alreadyLiked) {
        // Unlike the post
        await post.removeLike(req.user.id);
        res.status(200).json({ success: true, message: 'Post unliked', data: post });

    } else {
        // Like the post
        await post.addLike(req.user.id);
        res.status(200).json({ success: true, message: 'Post liked', data: post });
    }
});


// @desc    Comment on a community post
// @route   POST /api/v1/community/posts/:id/comment
// @access  Private
exports.commentPost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
    }

    const comment = {
        userId: req.user.id,
        text: req.body.text,
        // createdAt will be default
    };

    await post.addComment(comment);
    
    // Repopulate to get user details in comments for the response
    const updatedPost = await Post.findById(req.params.id)
        .populate('userId', 'name email')
        .populate('comments.userId', 'name email');

    res.status(201).json({
        success: true,
        data: updatedPost,
    });
});

// @desc    Delete a community post
// @route   DELETE /api/v1/community/posts/:id
// @access  Private (Owner or Admin)
exports.deletePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
    }

    // Check if user is owner or admin
    if (post.userId.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this post`, 401));
    }

    await post.remove();

    res.status(200).json({ success: true, data: {} });
});

// @desc    Delete a comment from a post
// @route   DELETE /api/v1/community/posts/:postId/comments/:commentId
// @access  Private (Comment Owner or Post Owner or Admin)
exports.deleteComment = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.postId);

    if (!post) {
        return next(new ErrorResponse(`Post not found with id of ${req.params.postId}`, 404));
    }

    // Find the comment
    const comment = post.comments.find(c => c._id.toString() === req.params.commentId);

    if (!comment) {
        return next(new ErrorResponse(`Comment not found with id of ${req.params.commentId}`, 404));
    }

    // Check if user is comment owner, post owner, or admin
    if (
        comment.userId.toString() !== req.user.id &&
        post.userId.toString() !== req.user.id &&
        req.user.role !== 'admin'
    ) {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this comment`, 403));
    }

    // Remove comment
    post.comments = post.comments.filter(c => c._id.toString() !== req.params.commentId);
    await post.save();
    
    // Repopulate for response
    const updatedPost = await Post.findById(req.params.postId)
        .populate('userId', 'name email')
        .populate('comments.userId', 'name email');

    res.status(200).json({ success: true, data: updatedPost });
});