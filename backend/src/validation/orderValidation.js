const Joi = require("joi");

const addressSchema = Joi.object({
  fullName: Joi.string().trim().required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  houseName: Joi.string().trim().required(),
  building: Joi.string().trim().required(),
  street: Joi.string().trim().required(),
  landmark: Joi.string().trim().allow(''),
  addressLine1: Joi.string().trim().allow(''),
  addressLine2: Joi.string().trim().allow(''),
  city: Joi.string().trim().required(),
  state: Joi.string().trim().required(),
  zipCode: Joi.string().pattern(/^[0-9]{6}$/),
  pincode: Joi.string().pattern(/^[0-9]{6}$/),
  zip: Joi.string().pattern(/^[0-9]{6}$/),
  country: Joi.string().trim().default('India'),
}).custom((value, helpers) => {
  if (value.zipCode || value.pincode || value.zip) {
    return value;
  }
  return helpers.message('zipCode, pincode, or zip is required');
}, 'zip code normalization');

// Create Order Schema
exports.createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().positive().required(),
        meters: Joi.number().positive(),
        selectedSize: Joi.string().allow('', null),
        selectedColor: Joi.string().allow('', null),
      })
    )
    .min(1)
    .required(),
  shippingAddress: addressSchema.required(),
  billingAddress: addressSchema,
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
