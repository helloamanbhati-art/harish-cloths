const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Customer = require("../models/Customer");
const { customerRegisterSchema, customerLoginSchema } = require("../validation/customerValidation");
const emailService = require("../services/emailService");

// Generate JWT Token
const generateToken = (customerId) => {
  const secret = process.env.JWT_ACCESS_SECRET || "dev-secret";
  return jwt.sign({ sub: customerId.toString(), role: "customer" }, secret, {
    expiresIn: "30d",
  });
};

// Register
exports.register = async (req, res, next) => {
  try {
    const { error, value } = customerRegisterSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((d) => ({ field: d.path[0], message: d.message })),
      });
    }

    // Check if email exists
    const existingCustomer = await Customer.findOne({ email: value.email });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Create customer
    const customer = new Customer({
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      phone: value.phone,
      password: value.password,
    });

    await customer.save();

    // Send welcome email
    await emailService.sendWelcomeEmail(customer);

    // Generate token
    const token = generateToken(customer._id);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        customer: {
          id: customer._id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { error, value } = customerLoginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((d) => ({ field: d.path[0], message: d.message })),
      });
    }

    // Find customer
    const customer = await Customer.findOne({ email: value.email }).select(
      "+password"
    );
    if (!customer || !customer.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await customer.matchPassword(value.password);
    if (!isPasswordValid) {
      customer.loginAttempts = (customer.loginAttempts || 0) + 1;
      if (customer.loginAttempts >= 5) {
        customer.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 mins
      }
      await customer.save();

      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if account is locked
    if (customer.lockUntil && customer.lockUntil > new Date()) {
      return res.status(403).json({
        success: false,
        message: "Account locked. Try again later.",
      });
    }

    // Update login info
    customer.lastLogin = new Date();
    customer.loginAttempts = 0;
    customer.lockUntil = null;
    await customer.save();

    // Generate token
    const token = generateToken(customer._id);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        customer: {
          id: customer._id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get profile
exports.getProfile = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.customer._id);

    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// Update profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, dateOfBirth, gender, preferences } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      req.customer._id,
      {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone && { phone }),
        ...(dateOfBirth && { dateOfBirth }),
        ...(gender && { gender }),
        ...(preferences && { preferences }),
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// Request password reset
exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    customer.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    customer.passwordResetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await customer.save();

    // Send email
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await emailService.sendPasswordResetEmail(customer, resetToken, resetLink);

    res.json({
      success: true,
      message: "Password reset link sent to email",
    });
  } catch (error) {
    next(error);
  }
};

// Reset password
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const customer = await Customer.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpiry: { $gt: new Date() },
    });

    if (!customer) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    customer.password = password;
    customer.passwordResetToken = null;
    customer.passwordResetTokenExpiry = null;

    await customer.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    next(error);
  }
};

// Add address
exports.addAddress = async (req, res, next) => {
  try {
    const { type, fullName, phone, addressLine1, addressLine2, city, state, zipCode, country, isDefault } = req.body;

    const customer = await Customer.findById(req.customer._id);

    // If this is default, remove default from others
    if (isDefault) {
      customer.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    customer.addresses.push({
      _id: new require("mongoose").Types.ObjectId(),
      type,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country,
      isDefault: isDefault || customer.addresses.length === 0,
    });

    await customer.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// Update address
exports.updateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const updateData = req.body;

    const customer = await Customer.findById(req.customer._id);
    const addressIndex = customer.addresses.findIndex((a) => a._id.toString() === addressId);

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    customer.addresses[addressIndex] = {
      ...customer.addresses[addressIndex],
      ...updateData,
    };

    if (updateData.isDefault) {
      customer.addresses.forEach((addr, idx) => {
        addr.isDefault = idx === addressIndex;
      });
    }

    await customer.save();

    res.json({
      success: true,
      message: "Address updated successfully",
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// Delete address
exports.deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;

    const customer = await Customer.findByIdAndUpdate(
      req.customer._id,
      { $pull: { addresses: { _id: addressId } } },
      { new: true }
    );

    res.json({
      success: true,
      message: "Address deleted successfully",
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// Add to wishlist
exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const customer = await Customer.findById(req.customer._id);

    // Check if already in wishlist
    const exists = customer.wishlist.some((w) => w.productId.toString() === productId);
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    customer.wishlist.push({ productId });
    await customer.save();

    res.json({
      success: true,
      message: "Added to wishlist",
      data: customer.wishlist,
    });
  } catch (error) {
    next(error);
  }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const customer = await Customer.findByIdAndUpdate(
      req.customer._id,
      { $pull: { wishlist: { productId } } },
      { new: true }
    );

    res.json({
      success: true,
      message: "Removed from wishlist",
      data: customer.wishlist,
    });
  } catch (error) {
    next(error);
  }
};

// Get wishlist
exports.getWishlist = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.customer._id).populate(
      "wishlist.productId"
    );

    res.json({
      success: true,
      data: customer.wishlist,
    });
  } catch (error) {
    next(error);
  }
};
