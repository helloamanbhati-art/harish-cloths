const Joi = require("joi");

// Customer Registration Schema
exports.customerRegisterSchema = Joi.object({
  firstName: Joi.string().trim().required().messages({
    "string.empty": "First name is required",
  }),
  lastName: Joi.string().trim().required().messages({
    "string.empty": "Last name is required",
  }),
  email: Joi.string()
    .email()
    .lowercase()
    .required()
    .messages({
      "string.email": "Invalid email address",
    }),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone must be 10 digits",
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
    }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords must match",
  }),
});

// Customer Login Schema
exports.customerLoginSchema = Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .required()
    .messages({
      "string.email": "Invalid email address",
    }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

// Update Customer Profile
exports.updateCustomerSchema = Joi.object({
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
  phone: Joi.string().pattern(/^[0-9]{10}$/),
  dateOfBirth: Joi.date(),
  gender: Joi.string().valid("male", "female", "other", "prefer_not_to_say"),
  profileImage: Joi.string().uri(),
  preferences: Joi.object({
    newsletter: Joi.boolean(),
    smsNotifications: Joi.boolean(),
    emailNotifications: Joi.boolean(),
  }),
});

// Add Address Schema
exports.addAddressSchema = Joi.object({
  type: Joi.string().valid("home", "work", "other").required(),
  fullName: Joi.string().trim().required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  addressLine1: Joi.string().trim().required(),
  addressLine2: Joi.string().trim(),
  city: Joi.string().trim().required(),
  state: Joi.string().trim().required(),
  zipCode: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required(),
  country: Joi.string().trim().required(),
  isDefault: Joi.boolean(),
});

// Password Reset Schema
exports.passwordResetSchema = Joi.object({
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
    }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords must match",
  }),
});

// Verify Email Schema
exports.verifyEmailSchema = Joi.object({
  token: Joi.string().required(),
});
