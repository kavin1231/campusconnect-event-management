/**
 * Authentication utility functions
 */

export const getToken = () => {
  return localStorage.getItem("token");
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

export const getUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const setUser = (user) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const getUserRole = () => {
  const user = getUser();
  return user?.role || null;
};

export const isAdmin = () => {
  const role = getUserRole();
  return (
    role === "SYSTEM_ADMIN" ||
    role === "EVENT_ORGANIZER" ||
    role === "CLUB_PRESIDENT"
  );
};

export default {
  getToken,
  setToken,
  getUser,
  setUser,
  clearAuth,
  isAuthenticated,
  getUserRole,
  isAdmin,
};
