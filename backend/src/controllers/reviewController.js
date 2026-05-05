const Review = require("../models/Review");
const Order = require("../models/Order");
const Product = require("../models/Product");

// Create review
exports.createReview = async (req, res, next) => {
  try {
    const { productId, title, content, rating, qualityRating, valueForMoneyRating, shippingRating, images, videos } = req.body;

    // Check if customer purchased this product
    const order = await Order.findOne({
      customer: req.customer._id,
      "items.product": productId,
      status: "delivered",
    });

    const isVerifiedPurchase = !!order;

    // Check if already reviewed
    const existingReview = await Review.findOne({
      product: productId,
      customer: req.customer._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const review = new Review({
      product: productId,
      customer: req.customer._id,
      order: order?._id,
      title,
      content,
      rating,
      qualityRating,
      valueForMoneyRating,
      shippingRating,
      images,
      videos,
      isVerifiedPurchase,
      isApproved: false, // Reviews need moderation
    });

    await review.save();

    // Update product rating
    const allReviews = await Review.find({ product: productId });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    await Product.findByIdAndUpdate(productId, {
      averageRating: avgRating,
      totalReviews: allReviews.length,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted for moderation",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// Get product reviews
exports.getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sortBy = "helpful" } = req.query;
    const skip = (page - 1) * limit;

    let sort = { createdAt: -1 };
    if (sortBy === "helpful") sort = { helpfulCount: -1 };
    if (sortBy === "rating-high") sort = { rating: -1 };
    if (sortBy === "rating-low") sort = { rating: 1 };

    const reviews = await Review.find({
      product: productId,
      isApproved: true,
    })
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate("customer", "firstName lastName");

    const total = await Review.countDocuments({
      product: productId,
      isApproved: true,
    });

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update review
exports.updateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { title, content, rating, images, videos } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.customer.toString() !== req.customer._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    review.title = title || review.title;
    review.content = content || review.content;
    review.rating = rating || review.rating;
    if (images) review.images = images;
    if (videos) review.videos = videos;

    review.isApproved = false; // Re-moderate after edit

    await review.save();

    res.json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// Delete review
exports.deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.customer.toString() !== req.customer._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Review.findByIdAndDelete(reviewId);

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Mark review as helpful
exports.markHelpful = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );

    res.json({
      success: true,
      message: "Marked as helpful",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// Mark review as unhelpful
exports.markUnhelpful = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { unhelpfulCount: 1 } },
      { new: true }
    );

    res.json({
      success: true,
      message: "Marked as unhelpful",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// Get customer reviews
exports.getCustomerReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      customer: req.customer._id,
    })
      .populate("product", "name image")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};
