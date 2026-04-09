/**
 * Frontend Logistics Validation Utilities
 * Client-side validation for form inputs
 */

export const validateAssetForm = (formData) => {
  const errors = {};

  // Name validation
  if (!formData.name || formData.name.trim() === "") {
    errors.name = "Asset name is required";
  } else if (formData.name.length < 3) {
    errors.name = "Asset name must be at least 3 characters";
  } else if (formData.name.length > 100) {
    errors.name = "Asset name cannot exceed 100 characters";
  }

  // Description validation
  if (formData.description && formData.description.length > 500) {
    errors.description = "Description cannot exceed 500 characters";
  }

  // Quantity validation
  if (!formData.quantity) {
    errors.quantity = "Quantity is required";
  } else if (isNaN(formData.quantity) || formData.quantity < 1) {
    errors.quantity = "Quantity must be a positive number";
  } else if (formData.quantity > 1000) {
    errors.quantity = "Quantity cannot exceed 1000";
  }

  // Image URL validation
  if (
    formData.imageUrl &&
    !formData.imageUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)
  ) {
    errors.imageUrl = "Please enter a valid image URL";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateAssetRequestForm = (formData) => {
  const errors = {};

  // Quantity validation
  if (!formData.quantity) {
    errors.quantity = "Quantity is required";
  } else if (isNaN(formData.quantity) || formData.quantity < 1) {
    errors.quantity = "Quantity must be a positive number";
  } else if (formData.quantity > 500) {
    errors.quantity = "Quantity cannot exceed 500 units";
  }

  // Date validations
  if (!formData.neededDate) {
    errors.neededDate = "Needed date is required";
  } else {
    const neededDate = new Date(formData.neededDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (neededDate < today) {
      errors.neededDate = "Needed date cannot be in the past";
    }
  }

  if (!formData.returnDate) {
    errors.returnDate = "Return date is required";
  }

  // Date range validation
  if (formData.neededDate && formData.returnDate) {
    const start = new Date(formData.neededDate);
    const end = new Date(formData.returnDate);

    if (start > end) {
      errors.returnDate = "Return date must be after or equal to needed date";
    }

    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (duration > 90) {
      errors.returnDate =
        "Rental duration cannot exceed 90 days. You have " +
        duration +
        " days.";
    }
  }

  // Purpose validation
  if (!formData.purpose || formData.purpose.trim() === "") {
    errors.purpose = "Purpose is required";
  } else if (formData.purpose.length < 10) {
    errors.purpose = "Purpose must be at least 10 characters";
  } else if (formData.purpose.length > 300) {
    errors.purpose = "Purpose cannot exceed 300 characters";
  }

  // Contact validation (optional but validated if provided)
  if (formData.contact) {
    const cleanContact = formData.contact.replace(/\D/g, "");
    if (cleanContact.length !== 10) {
      errors.contact = "Contact number must be 10 digits";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateCheckoutForm = (formData) => {
  const errors = {};

  if (!formData.notes || formData.notes.trim() === "") {
    errors.notes = "Notes are required";
  } else if (formData.notes.length < 5) {
    errors.notes = "Notes must be at least 5 characters";
  }

  if (!formData.checkedOutCondition) {
    errors.checkedOutCondition = "Please confirm asset condition";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateReturnForm = (formData) => {
  const errors = {};

  if (!formData.returnCondition) {
    errors.returnCondition = "Please select asset condition";
  }

  if (!formData.notes || formData.notes.trim() === "") {
    errors.notes = "Return notes are required";
  } else if (formData.notes.length < 5) {
    errors.notes = "Notes must be at least 5 characters";
  }

  // Damage report if condition is damaged
  if (formData.returnCondition === "DAMAGED") {
    if (
      !formData.damageDescription ||
      formData.damageDescription.trim() === ""
    ) {
      errors.damageDescription = "Please describe the damage";
    } else if (formData.damageDescription.length < 20) {
      errors.damageDescription =
        "Damage description must be at least 20 characters";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Format validation errors for display
 */
export const formatValidationErrors = (errors) => {
  return Object.entries(errors)
    .map(([field, message]) => message)
    .join("\n");
};

/**
 * Check if field has error
 */
export const hasFieldError = (errors, fieldName) => {
  return errors && errors[fieldName];
};

/**
 * Get field error message
 */
export const getFieldError = (errors, fieldName) => {
  return errors ? errors[fieldName] : null;
};

/**
 * Sanitize form input
 */
export const sanitizeFormInput = (input) => {
  if (typeof input !== "string") return input;
  return input.trim().replace(/[<>]/g, "");
};

/**
 * Format date for input
 */
export const formatDateForInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

/**
 * Calculate rental duration in days
 */
export const calculateRentalDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
};
