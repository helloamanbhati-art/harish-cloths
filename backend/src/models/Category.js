const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
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
    image: String,
    icon: String,
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    seoDescription: String,
    seoKeywords: [String],
  },
  { timestamps: true }
);

// Auto-generate slug
categorySchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();
  this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  next();
});

module.exports = mongoose.model("Category", categorySchema);
