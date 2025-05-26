const ErrorResponse = require('../utils/errorResponse'); // To be created

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log to console for dev
    console.error('ERROR STACK:', err.stack.red); // Add colors later if desired
    console.error('ERROR MESSAGE:', err.message.red);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new ErrorResponse(message, 400);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Not authorized, token failed';
        error = new ErrorResponse(message, 401);
    }
    if (err.name === 'TokenExpiredError') {
        const message = 'Not authorized, token expired';
        error = new ErrorResponse(message, 401);
    }


    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;