const Product = require("../models/Product");
const Brand = require("../models/Brand");
const Category = require("../models/Category");
const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Review = require("../models/Review");
const Discount = require("../models/Discount");
const Tax = require("../models/Tax");
const Inventory = require("../models/Inventory");
const Return = require("../models/Return");

// Get dashboard stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const recentOrders = await Order.find()
      .limit(10)
      .sort({ createdAt: -1 })
      .populate("customer", "firstName lastName email");

    const topProducts = await Product.find()
      .limit(5)
      .sort({ totalSales: -1 });

    const lowStockProducts = await Inventory.find({
      available: { $lt: 10 },
    })
      .populate("product", "name sku")
      .limit(10);

    res.json({
      success: true,
      data: {
        stats: {
          totalProducts,
          totalOrders,
          totalCustomers,
          totalRevenue: totalRevenue[0]?.total || 0,
        },
        recentOrders,
        topProducts,
        lowStockProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get analytics
exports.getAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    let query = { paymentStatus: "paid" };

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Revenue by date
    const revenueByDate = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Revenue by category
    const revenueByCategory = await Order.aggregate([
      { $match: query },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productName",
          revenue: { $sum: "$items.total" },
          quantity: { $sum: "$items.quantity" },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
    ]);

    // Top customers
    const topCustomers = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$customer",
          totalSpent: { $sum: "$total" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "customers",
          localField: "_id",
          foreignField: "_id",
          as: "customerInfo",
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        revenueByDate,
        revenueByCategory,
        topCustomers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin product management
exports.createProduct = async (req, res, next) => {
  try {
    const productData = req.body;

    const product = new Product({
      ...productData,
      createdBy: req.admin._id,
    });

    // Auto-generate SKU if not provided
    if (!product.sku) {
      product.sku = `SKU-${product.name.substring(0, 3).toUpperCase()}-${Date.now()}`;
    }

    await product.save();

    // Create inventory record
    await Inventory.create({
      product: product._id,
      available: productData.stock?.available || 0,
      lowStockThreshold: productData.stock?.lowStockThreshold || 10,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Update product
exports.updateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Delete product
exports.deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete inventory
    await Inventory.deleteOne({ product: productId });

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Bulk update products
exports.bulkUpdateProducts = async (req, res, next) => {
  try {
    const { productIds, updates } = req.body;

    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: updates }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} products updated`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Manage orders
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { customerEmail: { $regex: search, $options: "i" } },
      ];
    }

    const orders = await Order.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("customer");

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update order status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber, carrier, notes } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (carrier) order.carrier = carrier;

    order.statusHistory.push({
      status,
      updatedAt: new Date(),
      updatedBy: req.admin._id,
      notes,
    });

    await order.save();

    res.json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Manage customers
exports.getAllCustomers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ];
    }

    const customers = await Customer.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Customer.countDocuments(query);

    res.json({
      success: true,
      data: customers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get customer details
exports.getCustomerDetails = async (req, res, next) => {
  try {
    const { customerId } = req.params;

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const orders = await Order.find({ customer: customerId });
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

    res.json({
      success: true,
      data: {
        customer,
        stats: {
          totalOrders: orders.length,
          totalSpent,
          averageOrderValue: orders.length > 0 ? totalSpent / orders.length : 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Manage returns
exports.getReturns = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;

    const returns = await Return.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("customer")
      .populate("order");

    const total = await Return.countDocuments(query);

    res.json({
      success: true,
      data: returns,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Approve return
exports.approveReturn = async (req, res, next) => {
  try {
    const { returnId } = req.params;
    const { refundAmount, notes } = req.body;

    const returnRequest = await Return.findByIdAndUpdate(
      returnId,
      {
        status: "approved",
        refundAmount,
        approvedBy: req.admin._id,
        approvedAt: new Date(),
        inspectionNotes: notes,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Return approved",
      data: returnRequest,
    });
  } catch (error) {
    next(error);
  }
};

// Manage reviews
exports.getAllReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, isApproved } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (isApproved !== undefined) query.isApproved = isApproved === "true";

    const reviews = await Review.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("customer")
      .populate("product");

    const total = await Review.countDocuments(query);

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Approve review
exports.approveReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      {
        isApproved: true,
        approvedBy: req.admin._id,
        approvedAt: new Date(),
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Review approved",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// Reject review
exports.rejectReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { reason } = req.body;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      {
        isApproved: false,
        rejectReason: reason,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Review rejected",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};
