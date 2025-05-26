const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler'); // To be created

// @desc    Register user
// @route   POST /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Create user
    const user = await User.create({
        name,
        email,
        passwordHash: password, // Password will be hashed by pre-save hook in User model
        role, // Optional: admin might set this, or default to 'user'
    });

    sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/profile
// @access  Private
exports.getProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.user.id}`, 404));
    }
    res.status(200).json({ success: true, data: user });
});

// @desc    Update user details
// @route   PUT /api/v1/auth/update-profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
        // Add other fields that can be updated by the user
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]);

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.user.id}`, 404));
    }

    res.status(200).json({ success: true, data: user });
});


// @desc    Log user out / clear cookie (if using cookies)
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
    // If using JWT in cookies, clear it:
    // res.cookie('token', 'none', {
    //     expires: new Date(Date.now() + 10 * 1000), // 10 seconds
    //     httpOnly: true
    // });

    // For header-based JWT, logout is typically handled client-side by deleting the token.
    // Server-side, you might want to implement a token blacklist if immediate invalidation is critical.
    res.status(200).json({ success: true, data: {}, message: 'Logged out successfully (client should clear token)' });
});


// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    // Cookie options (if using cookies)
    // const options = {
    //     expires: new Date(
    //         Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000 // days to ms
    //     ),
    //     httpOnly: true,
    // };
    // if (process.env.NODE_ENV === 'production') {
    //     options.secure = true;
    // }
    // res.status(statusCode).cookie('token', token, options).json({ success: true, token });

    // Send token in response body
    res.status(statusCode).json({
        success: true,
        token,
        user: { // Optionally send some user data
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isPremium: user.isPremium
        }
    });
};