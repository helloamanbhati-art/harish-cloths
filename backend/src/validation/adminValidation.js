const Joi = require("joi");

// Create Brand Schema
exports.createBrandSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string(),
  logo: Joi.string().uri(),
  website: Joi.string().uri(),
  isActive: Joi.boolean().default(true),
  isFeatured: Joi.boolean().default(false),
  seoDescription: Joi.string(),
  seoKeywords: Joi.array().items(Joi.string()),
}).required();

// Update Brand Schema
exports.updateBrandSchema = Joi.object({
  name: Joi.string().trim(),
  description: Joi.string(),
  logo: Joi.string().uri(),
  website: Joi.string().uri(),
  isActive: Joi.boolean(),
  isFeatured: Joi.boolean(),
  seoDescription: Joi.string(),
  seoKeywords: Joi.array().items(Joi.string()),
})
  .required()
  .min(1);

// Create Category Schema
exports.createCategorySchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string(),
  image: Joi.string().uri(),
  icon: Joi.string(),
  parent: Joi.string(),
  isActive: Joi.boolean().default(true),
  isFeatured: Joi.boolean().default(false),
  displayOrder: Joi.number().min(0),
  seoDescription: Joi.string(),
  seoKeywords: Joi.array().items(Joi.string()),
}).required();

// Update Category Schema
exports.updateCategorySchema = Joi.object({
  name: Joi.string().trim(),
  description: Joi.string(),
  image: Joi.string().uri(),
  icon: Joi.string(),
  parent: Joi.string(),
  isActive: Joi.boolean(),
  isFeatured: Joi.boolean(),
  displayOrder: Joi.number().min(0),
  seoDescription: Joi.string(),
  seoKeywords: Joi.array().items(Joi.string()),
})
  .required()
  .min(1);

// Create Discount Schema
exports.createDiscountSchema = Joi.object({
  code: Joi.string().uppercase().trim().required(),
  description: Joi.string(),
  discountType: Joi.string()
    .valid("percentage", "fixed", "free_shipping", "bogo")
    .required(),
  value: Joi.number().positive().required(),
  maxDiscountAmount: Joi.number().positive(),
  applicableTo: Joi.string()
    .valid("all", "categories", "brands", "products")
    .default("all"),
  categories: Joi.array().items(Joi.string()),
  brands: Joi.array().items(Joi.string()),
  products: Joi.array().items(Joi.string()),
  minPurchaseAmount: Joi.number().min(0),
  maxUses: Joi.number().positive(),
  maxUsesPerCustomer: Joi.number().positive(),
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref("startDate")).required(),
  applicableToCustomers: Joi.string()
    .valid("all", "new", "loyal", "specific")
    .default("all"),
  specificCustomers: Joi.array().items(Joi.string()),
  canStackWithOtherCoupons: Joi.boolean().default(false),
}).required();

// Update Discount Schema
exports.updateDiscountSchema = Joi.object({
  code: Joi.string().uppercase().trim(),
  description: Joi.string(),
  discountType: Joi.string().valid(
    "percentage",
    "fixed",
    "free_shipping",
    "bogo"
  ),
  value: Joi.number().positive(),
  maxDiscountAmount: Joi.number().positive(),
  minPurchaseAmount: Joi.number().min(0),
  maxUses: Joi.number().positive(),
  maxUsesPerCustomer: Joi.number().positive(),
  startDate: Joi.date(),
  endDate: Joi.date().min(Joi.ref("startDate")),
  isActive: Joi.boolean(),
})
  .required()
  .min(1);
