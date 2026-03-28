export const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  icon = null,
  ...props
}) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-900",
    outline:
      "border-2 border-gray-300 hover:border-gray-400 text-gray-900 bg-white",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center gap-2 font-medium rounded-lg transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {loading && <span className="animate-spin">⟳</span>}
      {icon && !loading && <span>{icon}</span>}
      {children}
    </button>
  );
};

export const ButtonGroup = ({ children, className = "" }) => {
  return <div className={`flex gap-3 ${className}`}>{children}</div>;
};

export const IconButton = ({
  icon,
  variant = "ghost",
  tooltip = "",
  ...props
}) => {
  return (
    <button
      title={tooltip}
      className={`
        p-2 rounded-lg transition-all
        ${variant === "ghost" ? "hover:bg-gray-100 text-gray-600 hover:text-gray-900" : ""}
        ${variant === "primary" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
      `}
      {...props}
    >
      {icon}
    </button>
  );
};
