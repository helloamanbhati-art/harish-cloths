const mongoose = require("mongoose");

const appSettingsSchema = new mongoose.Schema(
  {
    // General Settings
    storeName: String,
    storeEmail: String,
    storePhone: String,
    storeAddress: String,
    storeCity: String,
    storeState: String,
    storeZipCode: String,
    storeCountry: String,
    storeTimezone: String,
    storeCurrency: { type: String, default: "INR" },

    // Shipping Settings
    freeShippingThreshold: Number,
    standardShippingCost: Number,
    expressShippingCost: Number,
    overnightShippingCost: Number,
    shippingFromState: String,

    // Tax Settings
    enableTaxCalculation: { type: Boolean, default: true },
    defaultTaxRate: Number,

    // Payment Settings
    razorpayKeyId: String,
    razorpayKeySecret: { type: String, select: false },
    enableCOD: { type: Boolean, default: true },
    enableUPI: { type: Boolean, default: true },
    enableWallet: { type: Boolean, default: false },

    // Business Rules
    autoConfirmOrders: { type: Boolean, default: true },
    allowGuestCheckout: { type: Boolean, default: true },
    requireEmailVerification: { type: Boolean, default: false },
    pointsPerRupeesSpent: { type: Number, default: 1 },

    // Email Settings
    emailProvider: {
      type: String,
      enum: ["sendgrid", "mailgun", "smtp", "none"],
      default: "smtp",
    },
    emailFromAddress: String,
    emailFromName: String,
    smtpHost: String,
    smtpPort: Number,
    smtpUsername: { type: String, select: false },
    smtpPassword: { type: String, select: false },

    // SMS Settings
    smsProvider: {
      type: String,
      enum: ["twilio", "exotel", "fast2sms", "none"],
      default: "none",
    },
    smsApiKey: { type: String, select: false },
    smsApiSecret: { type: String, select: false },

    // Social Links
    facebookUrl: String,
    instagramUrl: String,
    twitterUrl: String,
    linkedinUrl: String,
    youtubeUrl: String,

    // Branding
    logoUrl: String,
    faviconUrl: String,
    bannerUrl: String,
    siteBgColor: String,
    sitePrimaryColor: String,

    // Maintenance
    isMaintenance: { type: Boolean, default: false },
    maintenanceMessage: String,

    // Version
    version: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AppSettings", appSettingsSchema);
