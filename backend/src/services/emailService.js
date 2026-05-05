const nodemailer = require("nodemailer");
const Notification = require("../models/Notification");

// Create transporter
const createTransporter = () => {
  if (process.env.EMAIL_PROVIDER === "sendgrid") {
    return nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  }

  // Default SMTP
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

const transporter = createTransporter();

// Send email
exports.sendEmail = async ({ to, subject, html, text, from }) => {
  try {
    const mailOptions = {
      from: from || process.env.EMAIL_FROM_ADDRESS || "noreply@harishcloths.com",
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error: error.message };
  }
};

// Order confirmation email
exports.sendOrderConfirmationEmail = async (order, customer) => {
  const html = `
    <h2>Order Confirmation</h2>
    <p>Dear ${customer.fullName},</p>
    <p>Thank you for your order! Here are the details:</p>
    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
    <p><strong>Order Date:</strong> ${order.createdAt.toLocaleDateString()}</p>
    <p><strong>Total:</strong> ₹${order.total}</p>
    
    <h3>Items:</h3>
    <ul>
      ${order.items
        .map(
          (item) => `
        <li>
          ${item.productName} - Qty: ${item.quantity} - ₹${item.total}
        </li>
      `
        )
        .join("")}
    </ul>
    
    <h3>Shipping Address:</h3>
    <p>
      ${order.shippingAddress.addressLine1}<br>
      ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}
    </p>
    
    <p>You can track your order using order number: <strong>${order.orderNumber}</strong></p>
    <p>Thank you for shopping at Harish Cloths!</p>
  `;

  return exports.sendEmail({
    to: customer.email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html,
  });
};

// Order shipped email
exports.sendOrderShippedEmail = async (order, customer, trackingNumber) => {
  const html = `
    <h2>Your Order Has Been Shipped!</h2>
    <p>Dear ${customer.fullName},</p>
    <p>Your order ${order.orderNumber} has been shipped!</p>
    <p><strong>Tracking Number:</strong> ${trackingNumber || "Coming soon"}</p>
    <p>You can track your shipment using the tracking number above.</p>
    <p>Thank you for your purchase!</p>
  `;

  return exports.sendEmail({
    to: customer.email,
    subject: `Order Shipped - ${order.orderNumber}`,
    html,
  });
};

// Order delivered email
exports.sendOrderDeliveredEmail = async (order, customer) => {
  const html = `
    <h2>Your Order Has Been Delivered!</h2>
    <p>Dear ${customer.fullName},</p>
    <p>Your order ${order.orderNumber} has been delivered!</p>
    <p>We hope you're satisfied with your purchase. If you have any issues, please contact us.</p>
    <p>Please consider leaving a review for the products you purchased.</p>
    <p>Thank you for shopping at Harish Cloths!</p>
  `;

  return exports.sendEmail({
    to: customer.email,
    subject: `Order Delivered - ${order.orderNumber}`,
    html,
  });
};

// Payment received email
exports.sendPaymentReceivedEmail = async (order, customer) => {
  const html = `
    <h2>Payment Received</h2>
    <p>Dear ${customer.fullName},</p>
    <p>We have received your payment for order ${order.orderNumber}.</p>
    <p><strong>Amount Paid:</strong> ₹${order.total}</p>
    <p>Your order is now being processed and will be shipped soon.</p>
    <p>Thank you!</p>
  `;

  return exports.sendEmail({
    to: customer.email,
    subject: `Payment Received - ${order.orderNumber}`,
    html,
  });
};

// Password reset email
exports.sendPasswordResetEmail = async (customer, resetToken, resetLink) => {
  const html = `
    <h2>Password Reset Request</h2>
    <p>Dear ${customer.fullName},</p>
    <p>You requested to reset your password. Click the link below to proceed:</p>
    <p><a href="${resetLink}">${resetLink}</a></p>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  return exports.sendEmail({
    to: customer.email,
    subject: "Password Reset Request",
    html,
  });
};

// Welcome email
exports.sendWelcomeEmail = async (customer) => {
  const html = `
    <h2>Welcome to Harish Cloths!</h2>
    <p>Dear ${customer.fullName},</p>
    <p>Welcome to our store! We're excited to have you here.</p>
    <p>Browse our collection and enjoy shopping with us.</p>
    <p>If you have any questions, feel free to reach out.</p>
  `;

  return exports.sendEmail({
    to: customer.email,
    subject: "Welcome to Harish Cloths",
    html,
  });
};

// Create notification record
exports.createNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
};

// Send notification (multi-channel)
exports.sendNotification = async (notification) => {
  const channels = notification.channels;

  // Send email
  if (channels.email) {
    await exports.sendEmail({
      to: notification.recipient.id, // Assuming email is stored here
      subject: notification.title,
      html: notification.message,
    });
  }

  // Send SMS
  if (channels.sms) {
    // SMS implementation
  }

  // Send push notification
  if (channels.push) {
    // Push notification implementation
  }

  // Update as sent
  notification.isSent = true;
  notification.sentAt = new Date();
  await notification.save();
};
