const Resource = require('../models/Resource');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get premium resources (user must be premium)
// @route   GET /api/v1/premium/resources
// @access  Private (Premium Users Only via isPremiumUser middleware)
exports.getPremiumResources = asyncHandler(async (req, res, next) => {
    // Filtering and pagination can be added similar to getResources in resourceController
    // For now, just fetch all resources marked as premium.
    const premiumResources = await Resource.find({ isPremium: true })
        .populate('createdBy', 'name email')
        .sort('-createdAt');

    res.status(200).json({
        success: true,
        count: premiumResources.length,
        data: premiumResources,
    });
});

// @desc    Handle subscription (stub for Stripe/PayPal)
// @route   POST /api/v1/payment/subscribe
// @access  Private
exports.subscribe = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    // const { paymentMethodId, planId } = req.body; // Example from Stripe

    // STUB RESPONSE - In a real app:
    // 1. Validate paymentMethodId and planId.
    // 2. Create a customer in Stripe (if not exists).
    // 3. Create a subscription in Stripe.
    // 4. Handle successful payment or failures.
    // 5. If successful, update the user's 'isPremium' status in your DB.

    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    // Simulate successful subscription
    user.isPremium = true;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Subscription successful (stub). User is now premium.',
        data: {
            userId: user._id,
            isPremium: user.isPremium,
            // customerId: 'stripe_customer_id_example', // Example
            // subscriptionId: 'stripe_subscription_id_example' // Example
        }
    });
});

// @desc    Handle cancellation of subscription (stub)
// @route   POST /api/v1/payment/cancel-subscription
// @access  Private
exports.cancelSubscription = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    // STUB RESPONSE - In a real app:
    // 1. Retrieve subscription from Stripe using stored subscriptionId.
    // 2. Cancel the subscription in Stripe.
    // 3. Update the user's 'isPremium' status in your DB (e.g., set to false at period end).

    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    // Simulate successful cancellation
    user.isPremium = false; // Or handle based on Stripe webhook for subscription end
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Subscription cancellation processed (stub). User is no longer premium immediately for demo.',
        data: {
            userId: user._id,
            isPremium: user.isPremium
        }
    });
});