export const Badge = ({
  children,
  variant = "default",
  size = "md",
  className = "",
}) => {
  const variants = {
    default: "bg-blue-50 text-blue-700 border border-blue-200",
    success: "bg-green-50 text-green-700 border border-green-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
    pending: "bg-orange-50 text-orange-700 border border-orange-200",
    info: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs font-medium rounded",
    md: "px-3 py-1.5 text-sm font-medium rounded",
    lg: "px-4 py-2 text-base font-medium rounded",
  };

  return (
    <span
      className={`inline-flex items-center ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export const StatusBadge = ({ status, label }) => {
  const statusMap = {
    approved: { variant: "success", icon: "✓" },
    rejected: { variant: "danger", icon: "✕" },
    pending: { variant: "pending", icon: "⏳" },
    active: { variant: "success", icon: "●" },
    inactive: { variant: "warning", icon: "●" },
    completed: { variant: "success", icon: "✓" },
    in_progress: { variant: "info", icon: "→" },
    overdue: { variant: "danger", icon: "⚠" },
  };

  const config = statusMap[status] || statusMap.pending;

  return (
    <Badge variant={config.variant}>
      <span className="mr-1">{config.icon}</span>
      {label ||
        status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
    </Badge>
  );
};

export const ColoredBadge = ({ color = "blue", children, className = "" }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
    purple: "bg-purple-100 text-purple-800",
    indigo: "bg-indigo-100 text-indigo-800",
    pink: "bg-pink-100 text-pink-800",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colors[color]} ${className}`}
    >
      {children}
    </span>
  );
};
