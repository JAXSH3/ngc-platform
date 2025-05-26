const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: [true, 'Please add comment text'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const PostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: [true, 'Please add post text'],
        maxlength: [2000, 'Post text cannot be more than 2000 characters'],
    },
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    }],
    comments: [CommentSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Method to add a like
PostSchema.methods.addLike = function(userId) {
    if (this.likes.indexOf(userId) === -1) {
        this.likes.push(userId);
    }
    return this.save();
};

// Method to remove a like
PostSchema.methods.removeLike = function(userId) {
    this.likes = this.likes.filter(like => like.toString() !== userId.toString());
    return this.save();
};

// Method to add a comment
PostSchema.methods.addComment = function(comment) {
    this.comments.push(comment);
    return this.save();
};

// Method to remove a comment (if needed, more complex due to nested IDs)
// PostSchema.methods.removeComment = function(commentId) {
//     this.comments = this.comments.filter(comment => comment._id.toString() !== commentId.toString());
//     return this.save();
// };


module.exports = mongoose.model('Post', PostSchema);
// We don't need a separate Comment model if comments are always embedded.
// If comments need to be queried independently or have more complex interactions,
// a separate Comment model linked to Post would be better.