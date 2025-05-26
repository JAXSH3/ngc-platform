const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    passwordHash: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false, // Do not return password by default
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
    // emailVerificationToken: String, // Optional: for email verification
    // isEmailVerified: { type: Boolean, default: false }, // Optional
    // resetPasswordToken: String, // Optional: for password reset
    // resetPasswordExpire: Date, // Optional
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id, role: this.role, isPremium: this.isPremium }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);