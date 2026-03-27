import React, { useEffect, useState } from "react";
import Sidebar from "../common/Sidebar";
import { authAPI } from "../../services/api";
import { ChevronDown } from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const AVAILABLE_ROLES = [
    { value: "STUDENT", label: "Student" },
    { value: "CLUB_PRESIDENT", label: "Club President" },
    { value: "EVENT_ORGANIZER", label: "Event Organizer" },
    { value: "SYSTEM_ADMIN", label: "System Admin" },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authAPI.getAllUsers();
      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.message || "Failed to fetch users");
      }
    } catch (err) {
      setError("An error occurred while fetching users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingUserId(userId);
      const response = await authAPI.updateUserRole(userId, newRole);

      if (response.success) {
        // Update the user role in the local state
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
        setSuccessMessage(
          `Role updated to ${AVAILABLE_ROLES.find((r) => r.value === newRole)?.label}`
        );
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(response.message || "Failed to update user role");
      }
    } catch (err) {
      setError("An error occurred while updating the user role");
      console.error(err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role) => {
    const colors = {
      SYSTEM_ADMIN: "bg-red-500/20 text-red-400 border-red-500/50",
      EVENT_ORGANIZER: "bg-purple-500/20 text-purple-400 border-purple-500/50",
      CLUB_PRESIDENT: "bg-blue-500/20 text-blue-400 border-blue-500/50",
      STUDENT: "bg-green-500/20 text-green-400 border-green-500/50",
    };
    return colors[role] || "bg-slate-500/20 text-slate-400 border-slate-500/50";
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex">
      <Sidebar isAdmin={true} />

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="px-8 py-6 border-b border-neutral-border bg-background-dark/50 flex justify-between items-center">
          <h1 className="text-3xl font-black text-white">User Management</h1>

          <div className="relative w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="w-full bg-neutral-dark border border-neutral-border rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <main className="flex-1 p-8">
          {successMessage && (
            <div className="mb-4 bg-green-500/10 border border-green-500/50 rounded-xl p-4 text-green-400 text-sm font-medium">
              ✓ {successMessage}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-red-500">
              <p className="font-bold">Error</p>
              <p>{error}</p>
              <button
                onClick={fetchUsers}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="bg-neutral-dark/30 rounded-2xl border border-neutral-border overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-full">
                  <thead>
                    <tr className="bg-neutral-dark/80 border-b border-neutral-border text-slate-400 text-xs font-bold uppercase tracking-widest">
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Current Role</th>
                      <th className="px-6 py-4">Change Role</th>
                      <th className="px-6 py-4">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-border">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-neutral-dark/50 transition"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                                {user.profileImage ? (
                                  <img
                                    src={user.profileImage}
                                    alt={user.name}
                                    className="size-full object-cover"
                                  />
                                ) : (
                                  user.name.charAt(0).toUpperCase()
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-white">
                                  {user.name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300">
                            {user.email}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block px-3 py-1 rounded-md text-xs font-bold border ${getRoleBadgeColor(
                                user.role
                              )}`}
                            >
                              {AVAILABLE_ROLES.find(
                                (r) => r.value === user.role
                              )?.label || user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="relative group">
                              <select
                                value={user.role}
                                onChange={(e) =>
                                  handleRoleChange(user.id, e.target.value)
                                }
                                disabled={updatingUserId === user.id}
                                className={`w-40 px-3 py-2 rounded-lg bg-neutral-dark border border-neutral-border text-white text-sm font-medium focus:outline-none focus:border-primary transition appearance-none pr-8 cursor-pointer ${
                                  updatingUserId === user.id
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-neutral-dark/80"
                                }`}
                              >
                                {AVAILABLE_ROLES.map((role) => (
                                  <option key={role.value} value={role.value}>
                                    {role.label}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-10 text-center text-slate-500 italic"
                        >
                          No users found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserManagement;
