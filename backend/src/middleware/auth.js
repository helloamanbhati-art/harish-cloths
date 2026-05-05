const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const AdminUser = require("../models/AdminUser");

// Authenticate Customer
exports.authenticateCustomer = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const secret = process.env.JWT_ACCESS_SECRET || "dev-access-secret-change-me";
    const decoded = jwt.verify(token, secret);

    const customer = await Customer.findById(decoded.sub);
    if (!customer || !customer.isActive) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized" });
    }

    req.customer = customer;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid token", error: error.message });
  }
};

// Authenticate Admin
exports.authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const secret = process.env.JWT_ACCESS_SECRET || "dev-access-secret-change-me";
    const decoded = jwt.verify(token, secret);

    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Admin access required" });
    }

    const admin = await AdminUser.findById(decoded.sub);
    if (!admin || !admin.isActive) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid token", error: error.message });
  }
};

// Authenticate Customer or Admin
exports.authenticateAny = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const secret = process.env.JWT_ACCESS_SECRET || "dev-access-secret-change-me";
    const decoded = jwt.verify(token, secret);

    if (decoded.role === "admin") {
      const admin = await AdminUser.findById(decoded.sub);
      if (!admin || !admin.isActive) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }
      req.admin = admin;
      req.user = admin;
      req.userType = "admin";
    } else {
      const customer = await Customer.findById(decoded.sub);
      if (!customer || !customer.isActive) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }
      req.customer = customer;
      req.user = customer;
      req.userType = "customer";
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid token", error: error.message });
  }
};

// Optional Authentication (doesn't fail if not authenticated)
exports.optionalAuthenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      const secret = process.env.JWT_ACCESS_SECRET || "dev-access-secret-change-me";
      const decoded = jwt.verify(token, secret);

      if (decoded.role === "admin") {
        const admin = await AdminUser.findById(decoded.sub);
        if (admin) {
          req.admin = admin;
          req.user = admin;
          req.userType = "admin";
        }
      } else {
        const customer = await Customer.findById(decoded.sub);
        if (customer) {
          req.customer = customer;
          req.user = customer;
          req.userType = "customer";
        }
      }
    }
    next();
  } catch (error) {
    next();
  }
};

// Check Admin Role
exports.requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Insufficient permissions" });
    }
    next();
  };
};
