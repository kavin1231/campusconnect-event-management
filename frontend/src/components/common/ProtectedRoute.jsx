import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../../utils/auth";

const ProtectedRoute = ({ element: Component, allowedRoles }) => {
  const authed = isAuthenticated();

  if (!authed) {
    return <Navigate to="/login" replace />;
  }

  const role = getUserRole();

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Component />;
};

export default ProtectedRoute;
