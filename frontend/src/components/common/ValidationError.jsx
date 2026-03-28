import React from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Validation Error Display Component
 * Shows formatted validation error messages
 */
export const ValidationError = ({ errors, className = "" }) => {
  if (!errors || Object.keys(errors).length === 0) {
    return null;
  }

  const errorList = Object.entries(errors).map(([field, message]) => ({
    field,
    message,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-red-500/10 border border-red-500/30 rounded-lg p-4 my-4 ${className}`}
    >
      <div className="flex gap-3">
        <AlertCircle className="text-red-400 mt-1 flex-shrink-0" size={20} />
        <div className="flex-1">
          <h4 className="text-red-300 font-semibold mb-2">Validation Error</h4>
          <ul className="space-y-1">
            {errorList.map((error, idx) => (
              <li key={idx} className="text-red-200 text-sm">
                • {error.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Field Error Component
 * Shows inline field-level error
 */
export const FieldError = ({ error, className = "" }) => {
  if (!error) {
    return null;
  }

  return (
    <motion.p
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-red-400 text-sm mt-1 flex items-center gap-1 ${className}`}
    >
      <AlertCircle size={14} />
      {error}
    </motion.p>
  );
};

/**
 * Validation Success Component
 * Shows success message after validation passes
 */
export const ValidationSuccess = ({ message, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`bg-green-500/10 border border-green-500/30 rounded-lg p-4 my-4 flex items-center gap-3 ${className}`}
    >
      <CheckCircle className="text-green-400" size={20} />
      <p className="text-green-300">{message}</p>
    </motion.div>
  );
};

/**
 * Form Input with Validation
 * Input field with error display
 */
export const ValidatedInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  placeholder,
  className = "",
}) => {
  const hasError = Boolean(error);

  return (
    <div className="mb-4">
      <label className="block text-gray-300 text-sm font-medium mb-2">
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition ${
          hasError ? "border-red-500/50" : "border-gray-600"
        } ${className}`}
      />
      {error && <FieldError error={error} />}
    </div>
  );
};

/**
 * Form Textarea with Validation
 * Textarea field with character count and error display
 */
export const ValidatedTextarea = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  maxLength,
  minLength,
  rows = 4,
  className = "",
}) => {
  const hasError = Boolean(error);
  const charCount = value ? value.length : 0;

  return (
    <div className="mb-4">
      <label className="block text-gray-300 text-sm font-medium mb-2">
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition resize-none ${
          hasError ? "border-red-500/50" : "border-gray-600"
        } ${className}`}
      />
      <div className="flex justify-between items-center mt-1">
        {error && <FieldError error={error} />}
        {maxLength && (
          <span
            className={`text-xs ${charCount > maxLength * 0.9 ? "text-yellow-400" : "text-gray-400"}`}
          >
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Form Select with Validation
 */
export const ValidatedSelect = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  options,
  className = "",
}) => {
  const hasError = Boolean(error);

  return (
    <div className="mb-4">
      <label className="block text-gray-300 text-sm font-medium mb-2">
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-blue-500 transition ${
          hasError ? "border-red-500/50" : "border-gray-600"
        } ${className}`}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <FieldError error={error} />}
    </div>
  );
};

export default ValidationError;
