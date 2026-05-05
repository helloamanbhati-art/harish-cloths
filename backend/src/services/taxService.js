const Tax = require("../models/Tax");

// Calculate tax for product
exports.calculateTax = async (productId, amount, state) => {
  try {
    // Find applicable tax
    const tax = await Tax.findOne({
      isActive: true,
      $or: [
        { states: { $in: [state] } },
        { states: { $size: 0 } }, // Global tax
      ],
    });

    if (!tax) {
      return 0;
    }

    if (tax.isSlab) {
      // Find applicable slab
      const slab = tax.slabs.find(
        (s) => amount >= (s.minAmount || 0) && amount <= (s.maxAmount || Infinity)
      );
      if (slab) {
        return (amount * slab.rate) / 100;
      }
    } else {
      return (amount * tax.rate) / 100;
    }

    return 0;
  } catch (error) {
    throw new Error(`Failed to calculate tax: ${error.message}`);
  }
};

// Get applicable taxes for order
exports.getOrderTax = async (items, shippingState) => {
  try {
    let totalTax = 0;

    for (const item of items) {
      const tax = await exports.calculateTax(
        item.productId,
        item.subtotal,
        shippingState
      );
      totalTax += tax;
    }

    return totalTax;
  } catch (error) {
    throw new Error(`Failed to get order tax: ${error.message}`);
  }
};

// Create tax rule
exports.createTaxRule = async (taxData) => {
  try {
    const tax = new Tax(taxData);
    await tax.save();
    return tax;
  } catch (error) {
    throw new Error(`Failed to create tax rule: ${error.message}`);
  }
};

// Update tax rule
exports.updateTaxRule = async (taxId, updates) => {
  try {
    const tax = await Tax.findByIdAndUpdate(taxId, updates, { new: true });
    return tax;
  } catch (error) {
    throw new Error(`Failed to update tax rule: ${error.message}`);
  }
};

// Get all tax rules
exports.getTaxRules = async () => {
  try {
    const taxes = await Tax.find({ isActive: true });
    return taxes;
  } catch (error) {
    throw new Error(`Failed to fetch tax rules: ${error.message}`);
  }
};
