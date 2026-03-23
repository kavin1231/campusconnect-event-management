export const Table = ({ children, className = "" }) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  );
};

export const TableHead = ({ children, className = "" }) => {
  return (
    <thead className={`bg-gray-50 border-b border-gray-200 ${className}`}>
      {children}
    </thead>
  );
};

export const TableBody = ({ children, className = "" }) => {
  return (
    <tbody className={`divide-y divide-gray-200 ${className}`}>
      {children}
    </tbody>
  );
};

export const TableRow = ({ children, className = "", hover = true }) => {
  return (
    <tr
      className={`${hover ? "hover:bg-gray-50 transition-colors" : ""} ${className}`}
    >
      {children}
    </tr>
  );
};

export const TableHeader = ({ children, align = "left", className = "" }) => {
  return (
    <th
      className={`px-6 py-3.5 font-semibold text-gray-700 text-${align} ${className}`}
    >
      {children}
    </th>
  );
};

export const TableCell = ({ children, align = "left", className = "" }) => {
  return (
    <td className={`px-6 py-4 text-gray-900 text-${align} ${className}`}>
      {children}
    </td>
  );
};

export const StatCard = ({
  icon,
  label,
  value,
  color = "blue",
  trend = null,
  className = "",
}) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    red: "bg-red-50 border-red-200",
    amber: "bg-amber-50 border-amber-200",
    indigo: "bg-indigo-50 border-indigo-200",
  };

  const iconColors = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    amber: "text-amber-600",
    indigo: "text-indigo-600",
  };

  return (
    <div
      className={`bg-white rounded-lg border ${colorClasses[color]} p-6 ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <span className={`text-2xl ${iconColors[color]}`}>{icon}</span>
        </div>
        {trend && (
          <span
            className={`text-sm font-semibold ${trend > 0 ? "text-green-600" : "text-red-600"}`}
          >
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-gray-600 text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
};

export const MetricCard = ({
  label,
  value,
  unit = "",
  icon = null,
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <label className="text-gray-600 text-sm font-medium">{label}</label>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {unit && <span className="text-gray-500 text-sm">{unit}</span>}
      </div>
    </div>
  );
};
