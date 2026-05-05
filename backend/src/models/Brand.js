const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: String,
    logo: String,
    website: String,
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    seoDescription: String,
    seoKeywords: [String],
  },
  { timestamps: true }
);

// Auto-generate slug
brandSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();
  this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  next();
});

module.exports = mongoose.model("Brand", brandSchema);
