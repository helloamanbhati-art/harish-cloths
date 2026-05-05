const Joi = require("joi");
// Create Product Schema
exports.createProductSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().required(),
  shortDescription: Joi.string(),
  price: Joi.number().positive().required(),
  compareAtPrice: Joi.number().positive(),
  cost: Joi.number().positive(),
  brand: Joi.string().required(),
  category: Joi.string().required(),
  soldBy: Joi.string().valid("meter", "piece").required(),
  sku: Joi.string().trim(),
  barcode: Joi.string(),
  stock: Joi.object({
    available: Joi.number().min(0).required(),
    reserved: Joi.number().min(0),
    damaged: Joi.number().min(0),
    lowStockThreshold: Joi.number().min(0),
  }).required(),
  tags: Joi.array().items(Joi.string()),
  attributes: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      value: Joi.string().required(),
    })
  ),
  taxable: Joi.boolean(),
  taxClass: Joi.string().valid("standard", "reduced", "zero"),
  seoTitle: Joi.string(),
  seoDescription: Joi.string(),
  seoKeywords: Joi.array().items(Joi.string()),
  isActive: Joi.boolean(),
  isFeatured: Joi.boolean(),
}).required();

// Update Product Schema
exports.updateProductSchema = Joi.object({
  name: Joi.string().trim(),
  description: Joi.string(),
  shortDescription: Joi.string(),
  price: Joi.number().positive(),
  compareAtPrice: Joi.number().positive(),
  cost: Joi.number().positive(),
  brand: Joi.string(),
  category: Joi.string(),
  soldBy: Joi.string().valid("meter", "piece"),
  sku: Joi.string().trim(),
  barcode: Joi.string(),
  stock: Joi.object({
    available: Joi.number().min(0),
    reserved: Joi.number().min(0),
    damaged: Joi.number().min(0),
    lowStockThreshold: Joi.number().min(0),
  }),
  tags: Joi.array().items(Joi.string()),
  attributes: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      value: Joi.string().required(),
    })
  ),
  taxable: Joi.boolean(),
  taxClass: Joi.string().valid("standard", "reduced", "zero"),
  seoTitle: Joi.string(),
  seoDescription: Joi.string(),
  seoKeywords: Joi.array().items(Joi.string()),
  isActive: Joi.boolean(),
  isFeatured: Joi.boolean(),
}).min(1);

// Bulk Update Products
exports.bulkUpdateProductSchema = Joi.object({
  productIds: Joi.array()
    .items(Joi.string())
    .required(),
  updates: Joi.object({
    price: Joi.number().positive(),
    discount: Joi.number().min(0).max(100),
    isActive: Joi.boolean(),
    isFeatured: Joi.boolean(),
  })
    .required()
    .min(1),
}).required();
