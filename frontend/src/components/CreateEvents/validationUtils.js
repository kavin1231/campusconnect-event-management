// Validation utility functions for permission request form

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone) => {
  // Accepts formats like: 077 123 4567, 0771234567, +94771234567, 011 234 5678
  const phoneRegex = /^(\+?94|0)?(\d{9}|\d{2}\s?\d{3}\s?\d{4})$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const isValidStudentStaffId = (id) => {
  // Accepts formats like: S/21/234, ST/21/234, E/21/234, etc.
  const idRegex = /^[A-Z]{1,3}\/\d{2}\/\d{3,4}$/;
  return idRegex.test(id.trim());
};

export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today && !isNaN(date);
};

export const isValidTime = (timeString) => {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeString);
};

export const isTimeAfter = (time1, time2) => {
  // Check if time1 is after time2
  return time1 > time2;
};

export const isTimeBefore = (time1, time2) => {
  // Check if time1 is before time2
  return time1 < time2;
};

export const isTimeAfterOrEqual = (time1, time2) => {
  // Check if time1 is after or equal to time2
  return time1 >= time2;
};

export const wordCount = (text) => {
  return text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
};

export const isMinimumWords = (text, min) => {
  return wordCount(text) >= min;
};

export const isMaximumWords = (text, max) => {
  return wordCount(text) <= max;
};

export const isPositiveNumber = (num) => {
  const n = Number(num);
  return Number.isFinite(n) && n > 0;
};

export const isNonNegativeNumber = (num) => {
  const n = Number(num);
  return Number.isFinite(n) && n >= 0;
};

export const isValidAttendance = (attendance, venueCapacity) => {
  if (!attendance || !venueCapacity) return true;
  const att = Number(attendance);
  const cap = Number(venueCapacity);
  return att > 0 && att <= cap;
};

export const isTrimmedAndNotEmpty = (text) => {
  return text && text.trim().length > 0;
};

export const validateStep1 = (s1, venueCapacityByVenue = {}) => {
  const errors = [];

  // Title validation
  if (!isTrimmedAndNotEmpty(s1.title)) {
    errors.push("Event title is required.");
  } else if (s1.title.trim().length < 5) {
    errors.push("Event title must be at least 5 characters long.");
  } else if (s1.title.trim().length > 100) {
    errors.push("Event title cannot exceed 100 characters.");
  }

  // Event type validation
  if (!s1.event_type) {
    errors.push("Type of event is required.");
  } else if (s1.event_type === "Other" && !isTrimmedAndNotEmpty(s1.event_type_other)) {
    errors.push("Specify the event type when selecting 'Other'.");
  }

  // Purpose validation
  if (!s1.purpose_tag) {
    errors.push("Purpose or objective is required.");
  }

  // Description validation
  const wc = wordCount(s1.purpose_desc);
  if (wc === 0) {
    errors.push("Brief description is required.");
  } else if (wc < 20) {
    errors.push("Brief description must contain at least 20 words.");
  } else if (wc > 200) {
    errors.push("Brief description cannot exceed 200 words.");
  }

  // Date validation
  if (!s1.date) {
    errors.push("Event date is required.");
  } else if (!isValidDate(s1.date)) {
    errors.push("Event date must be today or in the future.");
  }

  // Time validations
  if (!s1.start_time) {
    errors.push("Start time is required.");
  } else if (!isValidTime(s1.start_time)) {
    errors.push("Start time format is invalid.");
  }

  if (!s1.end_time) {
    errors.push("End time is required.");
  } else if (!isValidTime(s1.end_time)) {
    errors.push("End time format is invalid.");
  }

  if (!s1.setup_time) {
    errors.push("Setup start time is required.");
  } else if (!isValidTime(s1.setup_time)) {
    errors.push("Setup start time format is invalid.");
  }

  // Time ordering validations
  if (s1.setup_time && s1.start_time && !isTimeBefore(s1.setup_time, s1.start_time)) {
    errors.push("Setup time must be before event start time.");
  }

  if (s1.start_time && s1.end_time && !isTimeAfter(s1.end_time, s1.start_time)) {
    errors.push("End time must be after start time.");
  }

  if (s1.end_time && s1.teardown_time && !isTimeBefore(s1.end_time, s1.teardown_time)) {
    errors.push("Teardown time must be after event end time.");
  }

  // Audience validation
  if (!s1.audience) {
    errors.push("Target audience is required.");
  }

  return errors;
};

export const validateStep2 = (s2) => {
  const errors = [];

  // Organization name
  if (!isTrimmedAndNotEmpty(s2.org_name)) {
    errors.push("Name of organizing body is required.");
  } else if (s2.org_name.trim().length < 3) {
    errors.push("Organization name must be at least 3 characters long.");
  }

  // Primary contact - Name
  if (!isTrimmedAndNotEmpty(s2.contact_name)) {
    errors.push("Primary contact full name is required.");
  } else if (s2.contact_name.trim().length < 3) {
    errors.push("Contact name must be at least 3 characters long.");
  }

  // Primary contact - ID
  if (!isTrimmedAndNotEmpty(s2.contact_id)) {
    errors.push("Student or staff ID is required.");
  } else if (!isValidStudentStaffId(s2.contact_id)) {
    errors.push("Student/Staff ID format is invalid. Use format like S/21/234.");
  }

  // Primary contact - Phone
  if (!isTrimmedAndNotEmpty(s2.contact_phone)) {
    errors.push("Primary contact phone number is required.");
  } else if (!isValidPhoneNumber(s2.contact_phone)) {
    errors.push("Primary contact phone number format is invalid. Use format like 077 123 4567.");
  }

  // Primary contact - Email (optional but validate if provided)
  if (s2.contact_email && isTrimmedAndNotEmpty(s2.contact_email)) {
    if (!isValidEmail(s2.contact_email)) {
      errors.push("Primary contact email address format is invalid.");
    }
  }

  // Supervisor - Name
  if (!isTrimmedAndNotEmpty(s2.supervisor_name)) {
    errors.push("Supervisor name is required.");
  } else if (s2.supervisor_name.trim().length < 3) {
    errors.push("Supervisor name must be at least 3 characters long.");
  }

  // Supervisor - Department
  if (!isTrimmedAndNotEmpty(s2.supervisor_dept)) {
    errors.push("Supervisor department is required.");
  } else if (s2.supervisor_dept.trim().length < 3) {
    errors.push("Department name must be at least 3 characters long.");
  }

  // Supervisor - Phone (optional but validate if provided)
  if (s2.supervisor_phone && isTrimmedAndNotEmpty(s2.supervisor_phone)) {
    if (!isValidPhoneNumber(s2.supervisor_phone)) {
      errors.push("Supervisor phone number format is invalid. Use format like 011 234 5678.");
    }
  }

  return errors;
};

export const validateStep3 = (s3, venueCapacityMap = {}) => {
  const errors = [];

  // Venue validation
  if (!s3.venue) {
    errors.push("Proposed venue is required.");
  } else if (s3.venue === "Other" && !isTrimmedAndNotEmpty(s3.venue_other)) {
    errors.push("Specify venue details when selecting 'Other'.");
  }

  // Attendance validation
  if (!s3.attendance) {
    errors.push("Expected attendance is required.");
  } else if (!isPositiveNumber(s3.attendance)) {
    errors.push("Expected attendance must be a number greater than zero.");
  } else if (s3.venue && s3.venue !== "Other" && venueCapacityMap[s3.venue]) {
    const capacity = venueCapacityMap[s3.venue];
    if (Number(s3.attendance) > capacity) {
      errors.push(`Expected attendance cannot exceed venue capacity of ${capacity} people.`);
    }
  }

  // Power requirements validation
  if (!s3.power) {
    // Power might be optional, so only validate if selected
  } else if ((s3.power === "High Voltage" || s3.power === "Outdoor Extension") && !isTrimmedAndNotEmpty(s3.power_desc)) {
    errors.push("Power requirement details are required for the selected power type.");
  }

  return errors;
};

export const validateStep4 = (s4) => {
  const errors = [];

  // Budget validation
  if (!s4.budget) {
    errors.push("Estimated total budget is required.");
  } else if (!isPositiveNumber(s4.budget)) {
    errors.push("Budget must be a positive number.");
  } else if (Number(s4.budget) < 1000) {
    errors.push("Budget must be at least LKR 1,000.");
  } else if (Number(s4.budget) > 1000000) {
    errors.push("Budget cannot exceed LKR 1,000,000 without special approval.");
  }

  // Budget breakdown validation (optional but validate if provided)
  if (s4.budget_breakdown && isTrimmedAndNotEmpty(s4.budget_breakdown)) {
    const bcWc = wordCount(s4.budget_breakdown);
    if (bcWc < 5) {
      errors.push("Budget breakdown must contain at least 5 words for clarity.");
    }
  }

  // Fund source validation
  const hasFundSource = Array.isArray(s4.fund_source) ? s4.fund_source.length > 0 : !!s4.fund_source;
  if (!hasFundSource) {
    errors.push("Select at least one source of funding.");
  }

  // Sponsor validation
  if (s4.has_sponsors) {
    if (!isTrimmedAndNotEmpty(s4.sponsor_details)) {
      errors.push("Sponsor names and details are required when external sponsors are enabled.");
    } else if (wordCount(s4.sponsor_details) < 5) {
      errors.push("Sponsor details must be more descriptive (at least 5 words).");
    }

    if (!s4.sponsor_branding) {
      errors.push("Sponsor branding selection is required when external sponsors are enabled.");
    }
  }

  return errors;
};

export const validateStep5 = (s5) => {
  const errors = [];

  // Security plan validation
  if (!s5.security) {
    errors.push("Security plan type is required.");
  }

  if (!isTrimmedAndNotEmpty(s5.security_plan)) {
    errors.push("Security plan description is required.");
  } else if (wordCount(s5.security_plan) < 10) {
    errors.push("Security plan description must be at least 10 words.");
  }

  // Food & beverage validation
  if (s5.has_food) {
    if (!isTrimmedAndNotEmpty(s5.food_vendors)) {
      errors.push("Food vendor and permit details are required when food and beverage is involved.");
    } else if (wordCount(s5.food_vendors) < 5) {
      errors.push("Food vendor details must be more descriptive (at least 5 words).");
    }
  }

  // External speakers validation
  if (s5.has_speakers) {
    if (!isTrimmedAndNotEmpty(s5.speaker_bios)) {
      errors.push("Speaker bios are required when external speakers are involved.");
    } else if (wordCount(s5.speaker_bios) < 10) {
      errors.push("Speaker bios must be at least 10 words per speaker.");
    }
  }

  // Emergency plan validation (optional but validate if provided)
  if (s5.emergency_plan && isTrimmedAndNotEmpty(s5.emergency_plan)) {
    if (wordCount(s5.emergency_plan) < 10) {
      errors.push("Emergency plan description must be at least 10 words.");
    }
  }

  // Declaration validation
  if (!s5.declaration) {
    errors.push("You must confirm the declaration before submitting.");
  }

  return errors;
};

export const validateAllSteps = (s1, s2, s3, s4, s5, venueCapacityMap = {}) => {
  return [
    ...validateStep1(s1, venueCapacityMap),
    ...validateStep2(s2),
    ...validateStep3(s3, venueCapacityMap),
    ...validateStep4(s4),
    ...validateStep5(s5),
  ];
};
