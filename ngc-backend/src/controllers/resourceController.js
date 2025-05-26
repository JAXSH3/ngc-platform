const Resource = require('../models/Resource');
const User = require('../models/User'); // For checking if user exists
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all resources with filtering
// @route   GET /api/v1/resources
// @access  Public (or Private if all resources require login)
exports.getResources = asyncHandler(async (req, res, next) => {
    let query;
    const reqQuery = { ...req.query };

    // Fields to exclude from filtering
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = Resource.find(JSON.parse(queryStr));

    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt'); // Default sort by newest
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Resource.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Populate createdBy with user name and email
    query = query.populate({ path: 'createdBy', select: 'name email' });


    const resources = await query;

    // Pagination result
    const pagination = {};
    if (endIndex < total) {
        pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
        pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
        success: true,
        count: resources.length,
        total,
        pagination,
        data: resources,
    });
});

// @desc    Get single resource
// @route   GET /api/v1/resources/:id
// @access  Public (or Private if resource is premium and user is not)
exports.getResource = asyncHandler(async (req, res, next) => {
    const resource = await Resource.findById(req.params.id).populate({
        path: 'createdBy',
        select: 'name email'
    });

    if (!resource) {
        return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));
    }

    // If resource is premium, and user is not logged in or not premium, deny access
    // This check can also be done via a dedicated middleware
    if (resource.isPremium) {
        if (!req.user || !req.user.isPremium) {
             return next(new ErrorResponse('You must be a premium member to access this resource.', 403));
        }
    }

    res.status(200).json({ success: true, data: resource });
});

// @desc    Create new resource
// @route   POST /api/v1/resources
// @access  Private (User or Admin)
exports.createResource = asyncHandler(async (req, res, next) => {
    req.body.createdBy = req.user.id; // Add user to req.body

    // Check if user exists (though 'protect' middleware should ensure this)
    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new ErrorResponse(`User not found with id ${req.user.id}`, 404));
    }

    const resource = await Resource.create(req.body);
    res.status(201).json({
        success: true,
        data: resource,
    });
});

// @desc    Update resource
// @route   PUT /api/v1/resources/:id
// @access  Private (Owner or Admin)
exports.updateResource = asyncHandler(async (req, res, next) => {
    let resource = await Resource.findById(req.params.id);

    if (!resource) {
        return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is resource owner or admin
    if (resource.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this resource`, 401));
    }

    // Prevent createdBy from being updated
    if (req.body.createdBy) {
        delete req.body.createdBy;
    }

    resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({ success: true, data: resource });
});

// @desc    Delete resource
// @route   DELETE /api/v1/resources/:id
// @access  Private (Owner or Admin)
exports.deleteResource = asyncHandler(async (req, res, next) => {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
        return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is resource owner or admin
    if (resource.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this resource`, 401));
    }

    await resource.remove(); // or resource.deleteOne() in newer Mongoose

    res.status(200).json({ success: true, data: {} });
});