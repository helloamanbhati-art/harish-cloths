const Joi = require("joi");

// Create Review Schema
exports.createReviewSchema = Joi.object({
  productId: Joi.string().required(),
  title: Joi.string().trim().required().max(100),
  content: Joi.string().trim().required().min(10).max(5000),
  rating: Joi.number().integer().min(1).max(5).required(),
  qualityRating: Joi.number().integer().min(1).max(5),
  valueForMoneyRating: Joi.number().integer().min(1).max(5),
  shippingRating: Joi.number().integer().min(1).max(5),
  images: Joi.array().items(Joi.string().uri()),
  videos: Joi.array().items(Joi.string().uri()),
}).required();

// Update Review Schema
exports.updateReviewSchema = Joi.object({
  title: Joi.string().trim().max(100),
  content: Joi.string().trim().min(10).max(5000),
  rating: Joi.number().integer().min(1).max(5),
  qualityRating: Joi.number().integer().min(1).max(5),
  valueForMoneyRating: Joi.number().integer().min(1).max(5),
  shippingRating: Joi.number().integer().min(1).max(5),
})
  .required()
  .min(1);

// Create Return Request Schema
exports.createReturnSchema = Joi.object({
  orderId: Joi.string().required(),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().positive().required(),
        condition: Joi.string()
          .valid("unused", "used", "damaged", "defective")
          .required(),
        reason: Joi.string(),
      })
    )
    .min(1)
    .required(),
  reason: Joi.string()
    .valid(
      "wrong_item",
      "defective",
      "damaged",
      "not_as_described",
      "size_issue",
      "quality_issue",
      "changed_mind",
      "other"
    )
    .required(),
  detailedReason: Joi.string().required(),
  photos: Joi.array().items(Joi.string().uri()),
}).required();

// Apply Coupon Schema
exports.applyCouponSchema = Joi.object({
  couponCode: Joi.string().uppercase().trim().required(),
  subtotal: Joi.number().positive().required(),
}).required();
