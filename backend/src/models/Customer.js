const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const customerSchema = new mongoose.Schema(
  {
    // Basic Info
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      match: [/^[0-9]{10}$/, "Phone must be 10 digits"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password by default
    },

    // Profile
    profileImage: String,
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say"],
    },
    dateOfBirth: Date,

    // Addresses
    addresses: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        type: {
          type: String,
          enum: ["home", "work", "other"],
          default: "home",
        },
        fullName: String,
        phone: String,
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        isDefault: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // Preferences
    preferences: {
      newsletter: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      emailNotifications: { type: Boolean, default: true },
      preferredCurrency: { type: String, default: "INR" },
    },

    // Account Stats
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastOrderDate: Date,
    loyaltyPoints: { type: Number, default: 0 },

    // Wishlist
    wishlist: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        addedAt: { type: Date, default: Date.now },
      },
    ],

    // Account Status
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpiry: Date,
    passwordResetToken: String,
    passwordResetTokenExpiry: Date,

    // Metadata
    lastLogin: Date,
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
  },
  { timestamps: true }
);

// Hash password before saving
customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare passwords
customerSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Get full name
customerSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Index for faster queries
customerSchema.index({ phone: 1 });
customerSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Customer", customerSchema);
