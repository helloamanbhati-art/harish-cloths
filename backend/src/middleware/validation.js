// Validation middleware using Joi
exports.validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }

    req.validatedData = value;
    next();
  };
};

// Validate query parameters
exports.validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }

    req.validatedQuery = value;
    next();
  };
};

// Validate params
exports.validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }

    req.validatedParams = value;
    next();
  };
};
