const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminUserSchema = new mongoose.Schema(
  {
    // Basic Info
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: String,
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    // Role and Permissions
    role: {
      type: String,
      enum: ["super_admin", "admin", "manager", "staff"],
      default: "admin",
    },
    permissions: [String], // Granular permissions

    // Status
    isActive: { type: Boolean, default: true },

    // Phone
    phone: String,

    // Avatar
    avatar: String,

    // Security
    lastLogin: Date,
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
    passwordChangedAt: Date,

    // Session
    sessionTokens: [
      {
        token: String,
        expiresAt: Date,
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
adminUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.passwordChangedAt = Date.now();
    next();
  } catch (error) {
    next(error);
  }
});

// Compare passwords
adminUserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Get full name
adminUserSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName || ""}`.trim();
});

// Indexes
adminUserSchema.index({ role: 1 });

module.exports = mongoose.model("AdminUser", adminUserSchema);
