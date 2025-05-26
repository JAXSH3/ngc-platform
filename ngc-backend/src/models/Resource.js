const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
    },
    type: {
        type: String,
        required: [true, 'Please specify the type of resource'],
        enum: ['tool', 'prompt', 'project', 'paper', 'guide', 'other'], // Added guide and other from submit form
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    tags: {
        type: [String],
        default: [],
    },
    category: { // This seems to align with 'type' but keeping as per model spec. Could be more granular.
        type: String,
        required: [true, 'Please add a category'],
    },
    url: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS',
        ],
        required: [true, 'Please add a URL'],
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // Optional: for user-contributed content moderation
    // status: {
    // type: String,
    // enum: ['pending', 'approved', 'rejected'],
    // default: 'pending'
    // }
});

module.exports = mongoose.model('Resource', ResourceSchema);