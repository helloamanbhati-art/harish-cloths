const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    shortDescription: String,

    // Pricing
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    compareAtPrice: Number,
    cost: Number,

    // Images
    image: String, // Main image
    images: [String], // All images

    // Categories and Tags
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: [String],

    // Product Details
    soldBy: {
      type: String,
      enum: ["meter", "piece"],
      required: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    barcode: String,

    // Inventory
    stock: {
      available: { type: Number, default: 0, min: 0 },
      reserved: { type: Number, default: 0, min: 0 },
      damaged: { type: Number, default: 0, min: 0 },
      lowStockThreshold: { type: Number, default: 10 },
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    trackInventory: { type: Boolean, default: true },

    // Tax
    taxable: { type: Boolean, default: true },
    taxClass: {
      type: String,
      enum: ["standard", "reduced", "zero"],
      default: "standard",
    },

    // Attributes/Properties
    attributes: [
      {
        name: String,
        value: String,
      },
    ],

    // Sizes (for clothing items)
    availableSizes: {
      type: [String],
      default: [],
    },
    clothingType: {
      type: String,
      default: null,
    },

    // Variants
    hasVariants: { type: Boolean, default: false },
    variants: [
      {
        name: String,
        sku: String,
        price: Number,
        stock: Number,
        image: String,
        size: String,
      },
    ],

    // Ratings and Reviews
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },

    // SEO
    seoTitle: String,
    seoDescription: String,
    seoKeywords: [String],

    // Status
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false },

    // Metadata
    createdBy: mongoose.Schema.Types.ObjectId,
    updatedBy: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

// Indexes
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ brand: 1, category: 1 });
productSchema.index({ isActive: 1, inStock: 1 });
productSchema.index({ createdAt: -1 });

// Auto-generate slug
productSchema.pre("save", async function (next) {
  if (!this.isModified("name")) return next();
  this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  next();
});

// Ensure stock.available >= 0
productSchema.pre("save", function (next) {
  if (this.trackInventory) {
    const totalStock =
      (this.stock.available || 0) + (this.stock.reserved || 0);
    this.inStock = totalStock > 0;
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
