import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

/**
 * Custom hook for authentication operations
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError("");
    try {
      const response = await authAPI.register(userData);
      if (response.success) {
        setError("");
        return { success: true, message: response.message };
      } else {
        setError(response.message || "Registration failed");
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMsg = err.message || "Network error. Please try again.";
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const response = await authAPI.login(email, password);
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        setUser(response.user);
        setError("");
        return { success: true, user: response.user };
      } else {
        const msg = response.message || "Login failed";
        setError(msg);
        return { success: false, message: msg };
      }
    } catch (err) {
      const errorMsg = err.message || "Network error. Please try again.";
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setError("");
    navigate("/login");
  }, [navigate]);

  const getProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await authAPI.getProfile();
      if (response) {
        setUser(response);
        localStorage.setItem("user", JSON.stringify(response));
        return { success: true, user: response };
      }
    } catch (err) {
      setError(err.message || "Failed to fetch profile");
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    getProfile,
    isAuthenticated: !!localStorage.getItem("token"),
  };
};

export default useAuth;
