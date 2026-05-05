const Discount = require("../models/Discount");

// Validate and apply coupon
exports.validateCoupon = async (code, subtotal, customerId) => {
  try {
    const coupon = await Discount.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      throw new Error("Coupon not found or inactive");
    }

    // Check dates
    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate) {
      throw new Error("Coupon expired or not yet active");
    }

    // Check minimum purchase
    if (subtotal < coupon.minPurchaseAmount) {
      throw new Error(
        `Minimum purchase of ₹${coupon.minPurchaseAmount} required`
      );
    }

    // Check max uses
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      throw new Error("Coupon has reached maximum usage limit");
    }

    // Check customer usage limit
    if (coupon.maxUsesPerCustomer) {
      // Query order count with this coupon for customer
      // This would require an Order query
    }

    return coupon;
  } catch (error) {
    throw new Error(`Coupon validation failed: ${error.message}`);
  }
};

// Calculate discount amount
exports.calculateDiscount = (coupon, subtotal) => {
  let discountAmount = 0;

  if (coupon.discountType === "percentage") {
    discountAmount = (subtotal * coupon.value) / 100;
    if (coupon.maxDiscountAmount) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
    }
  } else if (coupon.discountType === "fixed") {
    discountAmount = coupon.value;
  } else if (coupon.discountType === "free_shipping") {
    discountAmount = 0; // Handled separately
  }

  return Math.min(discountAmount, subtotal);
};

// Mark coupon as used
exports.markCouponAsUsed = async (couponCode) => {
  try {
    await Discount.findOneAndUpdate(
      { code: couponCode.toUpperCase() },
      { $inc: { usedCount: 1 } }
    );
  } catch (error) {
    console.error("Failed to mark coupon as used:", error);
  }
};

// Get active coupons
exports.getActiveCoupons = async () => {
  try {
    const now = new Date();
    const coupons = await Discount.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    return coupons;
  } catch (error) {
    throw new Error(`Failed to fetch coupons: ${error.message}`);
  }
};

// Create coupon
exports.createCoupon = async (couponData) => {
  try {
    const coupon = new Discount(couponData);
    await coupon.save();
    return coupon;
  } catch (error) {
    throw new Error(`Failed to create coupon: ${error.message}`);
  }
};

// Update coupon
exports.updateCoupon = async (couponId, updates) => {
  try {
    const coupon = await Discount.findByIdAndUpdate(couponId, updates, {
      new: true,
    });
    return coupon;
  } catch (error) {
    throw new Error(`Failed to update coupon: ${error.message}`);
  }
};

// Delete coupon
exports.deleteCoupon = async (couponId) => {
  try {
    await Discount.findByIdAndDelete(couponId);
    return { success: true };
  } catch (error) {
    throw new Error(`Failed to delete coupon: ${error.message}`);
  }
};
