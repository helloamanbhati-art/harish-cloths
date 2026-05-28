const mongoose = require("mongoose");

const productOptionsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "default",
    },
    sizes: {
      type: [String],
      default: ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36"],
    },
    clothingTypes: {
      type: [String],
      default: ["shirt", "jeans", "dress", "kurti", "saree", "women", "men"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductOptions", productOptionsSchema);
