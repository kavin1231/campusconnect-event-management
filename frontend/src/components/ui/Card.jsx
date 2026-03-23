export const Card = ({
  children,
  className = "",
  onClick = null,
  hover = true,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 transition-all ${
        hover ? "hover:shadow-md hover:border-gray-300" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, icon, action }) => {
  return (
    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {icon && <div className="text-2xl">{icon}</div>}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export const CardBody = ({ children, className = "" }) => {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
};

export const CardFooter = ({ children, className = "" }) => {
  return (
    <div
      className={`px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-lg flex justify-end gap-3 ${className}`}
    >
      {children}
    </div>
  );
};
