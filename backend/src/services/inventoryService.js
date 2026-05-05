const Inventory = require("../models/Inventory");
const Product = require("../models/Product");

// Update inventory after purchase
exports.reserveStock = async (productId, quantity) => {
  try {
    const inventory = await Inventory.findOne({ product: productId });

    if (!inventory || inventory.available < quantity) {
      throw new Error("Insufficient stock");
    }

    inventory.available -= quantity;
    inventory.reserved += quantity;

    // Add to history
    inventory.stockHistory.push({
      type: "sale",
      quantity,
      reference: productId,
      notes: "Stock reserved for order",
    });

    await inventory.save();
    return inventory;
  } catch (error) {
    throw new Error(`Failed to reserve stock: ${error.message}`);
  }
};

// Release reserved stock (order cancelled)
exports.releaseReservedStock = async (productId, quantity) => {
  try {
    const inventory = await Inventory.findOne({ product: productId });

    if (!inventory) {
      throw new Error("Inventory not found");
    }

    inventory.available += quantity;
    inventory.reserved -= quantity;

    inventory.stockHistory.push({
      type: "adjustment",
      quantity,
      reference: productId,
      notes: "Reserved stock released",
    });

    await inventory.save();
    return inventory;
  } catch (error) {
    throw new Error(`Failed to release stock: ${error.message}`);
  }
};

// Confirm stock usage (order delivered)
exports.confirmStockUsage = async (productId, quantity) => {
  try {
    const inventory = await Inventory.findOne({ product: productId });

    if (!inventory) {
      throw new Error("Inventory not found");
    }

    inventory.reserved -= quantity;

    inventory.stockHistory.push({
      type: "purchase",
      quantity,
      reference: productId,
      notes: "Stock confirmed as sold",
    });

    // Update product sold count
    await Product.findByIdAndUpdate(productId, {
      $inc: { totalSales: quantity },
    });

    await inventory.save();
    return inventory;
  } catch (error) {
    throw new Error(`Failed to confirm stock: ${error.message}`);
  }
};

// Handle return
exports.handleReturn = async (productId, quantity) => {
  try {
    const inventory = await Inventory.findOne({ product: productId });

    if (!inventory) {
      throw new Error("Inventory not found");
    }

    inventory.available += quantity;
    inventory.returned += quantity;

    inventory.stockHistory.push({
      type: "return",
      quantity,
      reference: productId,
      notes: "Stock returned",
    });

    await inventory.save();
    return inventory;
  } catch (error) {
    throw new Error(`Failed to handle return: ${error.message}`);
  }
};

// Get current stock
exports.getStock = async (productId) => {
  try {
    const inventory = await Inventory.findOne({ product: productId });

    if (!inventory) {
      return {
        available: 0,
        reserved: 0,
        damaged: 0,
      };
    }

    return {
      available: inventory.available,
      reserved: inventory.reserved,
      damaged: inventory.damaged,
      total: inventory.available + inventory.reserved,
    };
  } catch (error) {
    throw new Error(`Failed to get stock: ${error.message}`);
  }
};

// Get low stock products
exports.getLowStockProducts = async (threshold) => {
  try {
    const lowStockProducts = await Inventory.find({
      available: { $lt: threshold || 10 },
    })
      .populate("product", "name sku price")
      .sort({ available: 1 });

    return lowStockProducts;
  } catch (error) {
    throw new Error(`Failed to get low stock products: ${error.message}`);
  }
};

// Adjust inventory (manual adjustment)
exports.adjustInventory = async (productId, quantity, reason) => {
  try {
    const inventory = await Inventory.findOne({ product: productId });

    if (!inventory) {
      throw new Error("Inventory not found");
    }

    inventory.available += quantity;

    inventory.stockHistory.push({
      type: "adjustment",
      quantity: Math.abs(quantity),
      reference: productId,
      notes: reason,
    });

    await inventory.save();
    return inventory;
  } catch (error) {
    throw new Error(`Failed to adjust inventory: ${error.message}`);
  }
};

// Create inventory record
exports.createInventoryRecord = async (productId, stock) => {
  try {
    const inventory = new Inventory({
      product: productId,
      available: stock.available,
      reserved: 0,
      damaged: 0,
      lowStockThreshold: stock.lowStockThreshold || 10,
      reorderPoint: stock.reorderPoint || 5,
      reorderQuantity: stock.reorderQuantity || 50,
    });

    await inventory.save();
    return inventory;
  } catch (error) {
    throw new Error(`Failed to create inventory record: ${error.message}`);
  }
};
