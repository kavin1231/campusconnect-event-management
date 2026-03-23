import React from "react";

export const Modal = ({
  open = false,
  onClose = null,
  title = "",
  children,
  size = "md",
  className = "",
}) => {
  if (!open) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-lg shadow-xl ${sizes[size]} w-full mx-4 ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
};

export const Dialog = ({
  open = false,
  onClose = null,
  onConfirm = null,
  title = "",
  message = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
        <div className="px-6 py-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-base mb-6">{message}</p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2.5 text-white rounded-lg font-medium transition ${
                confirmVariant === "danger"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Drawer = ({
  open = false,
  onClose = null,
  title = "",
  children,
  side = "right",
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      <div
        className={`
        relative bg-white shadow-xl transition-transform
        ${side === "right" ? "ml-auto" : ""}
        w-96 max-w-full
      `}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-70px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export const PageHeader = ({
  title,
  subtitle = "",
  icon = null,
  action = null,
  className = "",
}) => {
  return (
    <div
      className={`bg-white border-b border-gray-200 sticky top-0 z-30 ${className}`}
    >
      <div className="px-6 py-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {icon && <span className="text-4xl">{icon}</span>}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-gray-600 text-base mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      </div>
    </div>
  );
};

export const PageContainer = ({ children, className = "" }) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>{children}</div>
  );
};

export const Container = ({ children, className = "" }) => {
  return (
    <div className={`max-w-7xl mx-auto px-6 py-8 ${className}`}>{children}</div>
  );
};

export const Section = ({
  title,
  subtitle = "",
  children,
  className = "",
  action = null,
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-gray-600 text-sm mt-1">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
};
