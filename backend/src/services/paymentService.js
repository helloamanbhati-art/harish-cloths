const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const PaymentTransaction = require("../models/PaymentTransaction");

// Lazy initialize Razorpay only if credentials exist
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// Create Razorpay order
exports.createRazorpayOrder = async (orderData) => {
  try {
    const options = {
      amount: Math.round(orderData.total * 100), // Amount in paise
      currency: "INR",
      receipt: `order_${orderData.orderNumber}`,
      description: "Harish Cloths Order",
      customer_notify: 1,
      notes: {
        orderId: orderData._id.toString(),
        orderNumber: orderData.orderNumber,
      },
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    throw new Error(`Razorpay order creation failed: ${error.message}`);
  }
};

// Verify payment
exports.verifyPayment = async (paymentData) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      paymentData;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      throw new Error("Invalid payment signature");
    }

    // Fetch payment details
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    return {
      isValid: true,
      payment,
    };
  } catch (error) {
    throw new Error(`Payment verification failed: ${error.message}`);
  }
};

// Get payment status
exports.getPaymentStatus = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    throw new Error(`Failed to fetch payment: ${error.message}`);
  }
};

// Refund payment
exports.refundPayment = async (paymentId, amount) => {
  try {
    const options = {
      amount: amount ? Math.round(amount * 100) : undefined, // Partial refund
      speed: "optimum",
      receipt: `refund_${Date.now()}`,
      notes: {
        reason: "Customer return",
        processedAt: new Date().toISOString(),
      },
    };

    const refund = await razorpay.payments.refund(paymentId, options);
    return refund;
  } catch (error) {
    throw new Error(`Refund failed: ${error.message}`);
  }
};

// Record payment transaction
exports.recordPaymentTransaction = async (transactionData) => {
  try {
    const transaction = new PaymentTransaction(transactionData);
    await transaction.save();
    return transaction;
  } catch (error) {
    throw new Error(`Failed to record transaction: ${error.message}`);
  }
};

// Update order payment status
exports.updateOrderPaymentStatus = async (orderId, paymentStatus, paymentData) => {
  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus,
        "paymentDetails.paymentStatus": paymentStatus,
        "paymentDetails.razorpayPaymentId": paymentData.razorpayPaymentId,
        "paymentDetails.transactionId": paymentData.razorpayPaymentId,
        "paymentDetails.paidAmount": paymentData.paidAmount,
        "paymentDetails.paidAt": new Date(),
      },
      { new: true }
    );

    return order;
  } catch (error) {
    throw new Error(`Failed to update payment status: ${error.message}`);
  }
};

// Handle webhook
exports.handleRazorpayWebhook = async (event) => {
  try {
    const { event: eventType, payload } = event;

    switch (eventType) {
      case "payment.authorized":
        // Payment authorized
        break;

      case "payment.failed":
        // Payment failed
        const failedPaymentData = payload.payment.entity;
        await updateOrderPaymentStatus(
          failedPaymentData.notes.orderId,
          "failed",
          {
            razorpayPaymentId: failedPaymentData.id,
            paidAmount: 0,
          }
        );
        break;

      case "order.paid":
        // Order paid
        const paidOrderData = payload.order.entity;
        const paidPaymentData = payload.payment.entity;
        await updateOrderPaymentStatus(paidOrderData.notes.orderId, "paid", {
          razorpayPaymentId: paidPaymentData.id,
          paidAmount: paidPaymentData.amount / 100,
        });
        break;

      case "refund.created":
        // Refund initiated
        break;

      case "refund.failed":
        // Refund failed
        break;

      default:
        console.log(`Unknown event: ${eventType}`);
    }

    return { success: true };
  } catch (error) {
    throw new Error(`Webhook handling failed: ${error.message}`);
  }
};
