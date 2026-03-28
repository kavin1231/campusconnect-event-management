/**
 * Logistics Validation Utilities
 * Comprehensive validation rules for assets, requests, and bookings
 */

export const ValidationRules = {
  // Asset Validations
  asset: {
    name: {
      required: true,
      minLength: 3,
      maxLength: 100,
      regex: /^[a-zA-Z0-9\s\-()]+$/,
      message: "Asset name must be 3-100 characters, alphanumeric with hyphens",
    },
    description: {
      required: false,
      maxLength: 500,
      message: "Description cannot exceed 500 characters",
    },
    quantity: {
      required: true,
      minValue: 1,
      maxValue: 1000,
      regex: /^\d+$/,
      message: "Quantity must be a positive integer between 1-1000",
    },
    imageUrl: {
      required: false,
      regex: /^https?:\/\/.+/,
      message: "Image URL must be a valid HTTP(S) URL",
    },
  },

  // Asset Request Validations
  request: {
    quantity: {
      required: true,
      minValue: 1,
      maxValue: 500,
      regex: /^\d+$/,
      message: "Quantity must be a positive integer between 1-500",
    },
    neededDate: {
      required: true,
      message: "Needed date is required",
    },
    returnDate: {
      required: true,
      message: "Return date is required",
    },
    purpose: {
      required: true,
      minLength: 10,
      maxLength: 300,
      message: "Purpose must be between 10-300 characters",
    },
    contact: {
      required: false,
      regex: /^[0-9]{10}$/,
      message: "Contact number must be 10 digits",
    },
  },
};

/**
 * Validate asset creation/update
 */
export const validateAsset = (data) => {
  const errors = [];

  if (!data.name) {
    errors.push("Asset name is required");
  } else if (data.name.length < 3 || data.name.length > 100) {
    errors.push("Asset name must be between 3-100 characters");
  } else if (!ValidationRules.asset.name.regex.test(data.name)) {
    errors.push("Asset name contains invalid characters");
  }

  if (
    data.description &&
    data.description.length > ValidationRules.asset.description.maxLength
  ) {
    errors.push("Description cannot exceed 500 characters");
  }

  if (!data.quantity) {
    errors.push("Quantity is required");
  } else if (
    isNaN(data.quantity) ||
    data.quantity < 1 ||
    data.quantity > 1000
  ) {
    errors.push("Quantity must be a number between 1-1000");
  }

  if (
    data.imageUrl &&
    !ValidationRules.asset.imageUrl.regex.test(data.imageUrl)
  ) {
    errors.push("Image URL must be a valid HTTP(S) URL");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate asset request
 */
export const validateAssetRequest = (data) => {
  const errors = [];

  // Quantity validation
  if (!data.quantity) {
    errors.push("Quantity is required");
  } else if (isNaN(data.quantity) || data.quantity < 1 || data.quantity > 500) {
    errors.push("Quantity must be a positive number between 1-500");
  }

  // Date validations
  if (!data.neededDate) {
    errors.push("Needed date is required");
  }

  if (!data.returnDate) {
    errors.push("Return date is required");
  }

  if (data.neededDate && data.returnDate) {
    const start = new Date(data.neededDate);
    const end = new Date(data.returnDate);

    if (isNaN(start.getTime())) {
      errors.push("Needed date is invalid");
    }

    if (isNaN(end.getTime())) {
      errors.push("Return date is invalid");
    }

    if (start > end) {
      errors.push("Needed date must be before or equal to return date");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start < today) {
      errors.push("Needed date cannot be in the past");
    }

    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (duration > 90) {
      errors.push("Request duration cannot exceed 90 days");
    }
  }

  // Purpose validation
  if (!data.purpose) {
    errors.push("Purpose is required");
  } else if (data.purpose.length < 10 || data.purpose.length > 300) {
    errors.push("Purpose must be between 10-300 characters");
  }

  // Contact validation
  if (data.contact) {
    if (!/^\d{10}$/.test(data.contact.replace(/\D/g, ""))) {
      errors.push("Contact number must be 10 digits");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate quantity availability
 */
export const validateQuantityAvailability = (
  availableQuantity,
  requestedQuantity,
) => {
  const errors = [];

  if (requestedQuantity > availableQuantity) {
    errors.push(
      `Insufficient quantity. Available: ${availableQuantity}, Requested: ${requestedQuantity}`,
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate date range conflicts
 */
export const validateDateRange = (
  startDate,
  endDate,
  existingRequestsDateRanges,
) => {
  const errors = [];

  const start = new Date(startDate);
  const end = new Date(endDate);

  for (const existingRange of existingRequestsDateRanges || []) {
    const existingStart = new Date(existingRange.startDate);
    const existingEnd = new Date(existingRange.endDate);

    // Check for overlaps
    if (start <= existingEnd && end >= existingStart) {
      errors.push(
        `Date range conflicts with existing request from ${existingStart.toLocaleDateString()} to ${existingEnd.toLocaleDateString()}`,
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Sanitize input strings
 */
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.trim().replace(/[<>]/g, "");
};
