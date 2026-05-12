const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Product = require("../models/Product");
const paymentService = require("../services/paymentService");
const inventoryService = require("../services/inventoryService");
const emailService = require("../services/emailService");
const discountService = require("../services/discountService");
const taxService = require("../services/taxService");

// Create order
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, billingAddress, sameAsShipping, paymentMethod, shippingMethod, couponCode, customerNotes } = req.body;

    // Validate items
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`,
        });
      }

      const metersPerPiece =
        product.soldBy === "meter"
          ? Math.max(Number(item.meters) || 1, 1)
          : 1;
      const itemTotal = product.price * item.quantity * metersPerPiece;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        productName: product.name,
        productImage: product.image,
        brand: product.brand,
        price: product.price,
        quantity: item.quantity,
        meters: metersPerPiece,
        soldBy: product.soldBy,
        subtotal: itemTotal,
        discount: 0,
        tax: 0,
        total: itemTotal,
      });
    }

    // Apply coupon if provided
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await discountService.validateCoupon(
        couponCode,
        subtotal,
        req.customer?._id
      );
      discountAmount = discountService.calculateDiscount(coupon, subtotal);
    }

    // Calculate tax
    const tax = await taxService.getOrderTax(
      orderItems,
      shippingAddress.state
    );

    // Create order
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const order = new Order({
      orderNumber,
      customer: req.customer?._id || null,
      customerName: req.customer?.fullName || shippingAddress.fullName,
      customerEmail: req.customer?.email || req.body.email,
      customerPhone: shippingAddress.phone,
      items: orderItems,
      subtotal,
      discount: discountAmount,
      tax,
      shippingMethod,
      shippingAddress,
      billingAddress: sameAsShipping ? shippingAddress : billingAddress,
      paymentMethod,
      customerNotes,
    });

    // Calculate totals
    const shippingCost = shippingMethod === "standard" ? 0 : 50; // Adjust as needed
    order.shippingCost = shippingCost;
    order.total = subtotal - discountAmount + tax + shippingCost;

    await order.save();

    // Create Razorpay order for payment
    let razorpayOrder = null;
    if (paymentMethod === "razorpay") {
      razorpayOrder = await paymentService.createRazorpayOrder({
        total: order.total,
        orderNumber: order.orderNumber,
        _id: order._id,
      });

      order.paymentDetails.razorpayOrderId = razorpayOrder.id;
      await order.save();
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        order,
        razorpayOrder,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get customer orders
exports.getCustomerOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    let query = { customer: req.customer._id };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("items.product", "name image");

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

// Get order by ID
exports.getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check authorization
    if (order.customer && order.customer.toString() !== req.customer._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel order
exports.cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "pending" && order.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled in current status",
      });
    }

    order.status = "cancelled";
    order.statusHistory.push({
      status: "cancelled",
      updatedAt: new Date(),
      notes: "Cancelled by customer",
    });

    // Release reserved stock
    for (const item of order.items) {
      await inventoryService.releaseReservedStock(item.product, item.quantity);
    }

    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Request return
exports.requestReturn = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { items, reason, detailedReason, photos } = req.body;

    const order = await Order.findById(orderId);

    if (!order || order.status !== "delivered") {
      return res.status(400).json({
        success: false,
        message: "Order cannot be returned in current status",
      });
    }

    const Return = require("../models/Return");

    const returnRequest = new Return({
      order: orderId,
      customer: req.customer._id,
      items,
      reason,
      detailedReason,
      photos,
      status: "requested",
    });

    await returnRequest.save();

    order.refundStatus = "requested";
    await order.save();

    res.status(201).json({
      success: true,
      message: "Return request created successfully",
      data: returnRequest,
    });
  } catch (error) {
    next(error);
  }
};

// Get returns
exports.getReturns = async (req, res, next) => {
  try {
    const Return = require("../models/Return");

    const returns = await Return.find({ customer: req.customer._id })
      .populate("order")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: returns,
    });
  } catch (error) {
    next(error);
  }
};

// Track order
exports.trackOrder = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;

    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        status: order.status,
        trackingNumber: order.trackingNumber,
        carrier: order.carrier,
        statusHistory: order.statusHistory,
        estimatedDeliveryDate: order.estimatedDeliveryDate,
      },
    });
  } catch (error) {
    next(error);
  }
};
