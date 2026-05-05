const Joi = require("joi");

// Create Order Schema
exports.createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().positive().required(),
        meters: Joi.number().positive(),
      })
    )
    .min(1)
    .required(),
  shippingAddress: Joi.object({
    fullName: Joi.string().trim().required(),
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required(),
    addressLine1: Joi.string().trim().required(),
    addressLine2: Joi.string().trim(),
    city: Joi.string().trim().required(),
    state: Joi.string().trim().required(),
    zipCode: Joi.string()
      .pattern(/^[0-9]{6}$/)
      .required(),
    country: Joi.string().trim().required(),
  }).required(),
  billingAddress: Joi.object({
    fullName: Joi.string().trim().required(),
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required(),
    addressLine1: Joi.string().trim().required(),
    addressLine2: Joi.string().trim(),
    city: Joi.string().trim().required(),
    state: Joi.string().trim().required(),
    zipCode: Joi.string()
      .pattern(/^[0-9]{6}$/)
      .required(),
    country: Joi.string().trim().required(),
  }),
  sameAsShipping: Joi.boolean().default(true),
  paymentMethod: Joi.string()
    .valid("razorpay", "upi", "card", "netbanking", "wallet")
    .required(),
  shippingMethod: Joi.string()
    .valid("standard", "express", "overnight")
    .default("standard"),
  couponCode: Joi.string().trim(),
  customerNotes: Joi.string(),
}).required();

// Update Order Status Schema
exports.updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "out_for_delivery",
      "delivered",
      "cancelled",
      "refunded"
    )
    .required(),
  notes: Joi.string(),
  trackingNumber: Joi.string(),
  carrier: Joi.string(),
}).required();

// Refund Schema
exports.refundSchema = Joi.object({
  refundMethod: Joi.string()
    .valid("original_payment", "store_credit")
    .required(),
  refundReason: Joi.string().required(),
  refundAmount: Joi.number().positive().required(),
  notes: Joi.string(),
}).required();
