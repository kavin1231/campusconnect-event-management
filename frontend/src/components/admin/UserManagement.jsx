import React, { useEffect, useState } from "react";
import Sidebar from "../common/Sidebar";
import { authAPI, resolveImageUrl } from "../../services/api";
import Modal from "../ui/Modal";
import { Eye, Trash2, Search, AlertTriangle, CheckCircle2, Shield, Plus, XCircle } from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("students"); // "students" or "management"
  
  // States for actions
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAssignRoleModalOpen, setIsAssignRoleModalOpen] = useState(false);
  const [isRevokeRoleModalOpen, setIsRevokeRoleModalOpen] = useState(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Form states
  const [assignRoleData, setAssignRoleData] = useState({
    role: "EVENT_ORGANIZER",
    clubOrFacultyName: "",
    clubOrFacultyType: "Club"
  });

  const [createUserData, setCreateUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "EVENT_ORGANIZER"
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
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

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleAssignRoleClick = (user) => {
    setSelectedUser(user);
    setAssignRoleData({
      role: "EVENT_ORGANIZER",
      clubOrFacultyName: "",
      clubOrFacultyType: "Club"
    });
    setIsAssignRoleModalOpen(true);
  };

  const handleRevokeRoleClick = (user) => {
    setSelectedUser(user);
    setIsRevokeRoleModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    
    try {
      setActionLoading(true);
      const type = selectedUser.studentId ? "student" : "staff";
      const data = await authAPI.deleteUser(selectedUser.id, type);
      
      if (data.success) {
        showSuccess("User deleted successfully");
        setIsDeleteModalOpen(false);
        fetchUsers();
      } else {
        alert(data.message || "Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting user");
    } finally {
      setActionLoading(false);
    }
  };

  const confirmAssignRole = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      const data = await authAPI.assignRole({
        studentId: selectedUser.id,
        role: assignRoleData.role,
        clubOrFacultyName: assignRoleData.clubOrFacultyName,
        clubOrFacultyType: assignRoleData.clubOrFacultyType,
      });

      if (data.success) {
        showSuccess(data.message || "Role assigned successfully");
        setIsAssignRoleModalOpen(false);
        fetchUsers();
      } else {
        alert(data.message || "Failed to assign role");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while assigning role");
    } finally {
      setActionLoading(false);
    }
  };

  const confirmRevokeRole = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      const data = await authAPI.revokeRole(selectedUser.id);
      
      if (data.success) {
        showSuccess(data.message || "Role revoked successfully");
        setIsRevokeRoleModalOpen(false);
        fetchUsers();
      } else {
        alert(data.message || "Failed to revoke role");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while revoking role");
    } finally {
      setActionLoading(false);
    }
  };

  const confirmCreateUser = async (e) => {
    e.preventDefault();
    
    try {
      setActionLoading(true);
      const data = await authAPI.createUser(createUserData);
      
      if (data.success) {
        showSuccess("Staff user created successfully");
        setIsCreateUserModalOpen(false);
        setCreateUserData({ name: "", email: "", password: "", role: "EVENT_ORGANIZER" });
        fetchUsers();
      } else {
        alert(data.message || "Failed to create user");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while creating user");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.studentId?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;

    if (activeTab === "students") {
      return !!user.studentId;
    } else {
      return !user.studentId;
    }
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case "SYSTEM_ADMIN":
        return <span className="px-2 py-1 rounded-md bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">System Admin</span>;
      case "EVENT_ORGANIZER":
        return <span className="px-2 py-1 rounded-md bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">Organizer</span>;
      case "CLUB_PRESIDENT":
        return <span className="px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">President</span>;
      default:
        return <span className="px-2 py-1 rounded-md bg-neutral-dark text-xs font-bold text-slate-300 border border-neutral-border">{role || "STUDENT"}</span>;
    }
  };

  return (
    <div className="bg-background-dark text-slate-100 font-display min-h-screen flex">
      <Sidebar isAdmin={true} />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="px-8 py-6 border-b border-neutral-border bg-background-dark/50 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-white">User Management</h1>
            <div className="flex gap-6 mt-4">
              <button 
                onClick={() => setActiveTab("students")}
                className={`pb-2 px-1 text-sm font-bold transition relative ${activeTab === "students" ? "text-primary border-b-2 border-primary" : "text-slate-400 hover:text-slate-200"}`}
              >
                Students ({users.filter(u => !!u.studentId).length})
              </button>
              <button 
                onClick={() => setActiveTab("management")}
                className={`pb-2 px-1 text-sm font-bold transition relative ${activeTab === "management" ? "text-primary border-b-2 border-primary" : "text-slate-400 hover:text-slate-200"}`}
              >
                Management Users ({users.filter(u => !u.studentId).length})
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {activeTab === "management" && (
              <button
                onClick={() => setIsCreateUserModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-hover transition"
              >
                <Plus size={18} />
                Add Staff
              </button>
            )}
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`} 
                className="w-full bg-neutral-dark border border-neutral-border rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-red-500">
              <p className="font-bold">Error</p>
              <p>{error}</p>
              <button onClick={fetchUsers} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold">Try Again</button>
            </div>
          ) : (
            <div className="bg-neutral-dark/30 rounded-2xl border border-neutral-border overflow-hidden shadow-xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-neutral-dark/80 border-b border-neutral-border text-slate-400 text-xs font-bold uppercase tracking-widest">
                    <th className="px-6 py-4">User</th>
                    {activeTab === "management" ? (
                      <th className="px-6 py-4">Role</th>
                    ) : (
                      <>
                        <th className="px-6 py-4">Student ID</th>
                        <th className="px-6 py-4">Department</th>
                      </>
                    )}
                    <th className="px-6 py-4">Joined At</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-border">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-neutral-dark/50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                              {user.profileImage ? (
                                <img src={resolveImageUrl(user.profileImage)} alt={user.name} className="size-full object-cover" />
                              ) : (
                                (user.name || "U").charAt(0).toUpperCase()
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{user.name || "Unknown"}</p>
                              <p className="text-xs text-slate-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        {activeTab === "management" ? (
                          <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                        ) : (
                          <>
                            <td className="px-6 py-4 text-sm text-slate-300 font-mono">{user.studentId || "-"}</td>
                            <td className="px-6 py-4 text-sm text-slate-300">{user.department || "-"}</td>
                          </>
                        )}
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleView(user)}
                              className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            
                            {activeTab === "students" && (
                              <button 
                                onClick={() => handleAssignRoleClick(user)}
                                className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors"
                                title="Assign Role"
                              >
                                <Shield size={18} />
                              </button>
                            )}

                            {activeTab === "management" && user.role !== "SYSTEM_ADMIN" && (
                              <button 
                                onClick={() => handleRevokeRoleClick(user)}
                                className="p-2 rounded-lg bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors"
                                title="Revoke Role"
                              >
                                <XCircle size={18} />
                              </button>
                            )}

                            <button 
                              onClick={() => handleDeleteClick(user)}
                              className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                              title="Delete User"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={activeTab === "management" ? "4" : "5"} className="px-6 py-10 text-center text-slate-500 italic">
                        No {activeTab} found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* View User Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-neutral-dark/50 rounded-xl border border-neutral-border">
              <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-black overflow-hidden">
                {selectedUser.profileImage ? (
                  <img src={resolveImageUrl(selectedUser.profileImage)} alt={selectedUser.name} className="size-full object-cover" />
                ) : (
                  (selectedUser.name || "U").charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h3 className="text-xl font-black text-white">{selectedUser.name || "Unknown"}</h3>
                <div className="mt-1">{getRoleBadge(selectedUser.role || (selectedUser.studentId ? "STUDENT" : ""))}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-dark/30 rounded-xl border border-neutral-border">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Email Address</p>
                <p className="text-sm text-slate-200">{selectedUser.email}</p>
              </div>
              <div className="p-4 bg-neutral-dark/30 rounded-xl border border-neutral-border">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Joined Date</p>
                <p className="text-sm text-slate-200">{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : "N/A"}</p>
              </div>
              {selectedUser.studentId && (
                <>
                  <div className="p-4 bg-neutral-dark/30 rounded-xl border border-neutral-border">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Student ID</p>
                    <p className="text-sm text-slate-200 font-mono">{selectedUser.studentId}</p>
                  </div>
                  <div className="p-4 bg-neutral-dark/30 rounded-xl border border-neutral-border">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Department</p>
                    <p className="text-sm text-slate-200">{selectedUser.department || "N/A"}</p>
                  </div>
                </>
              )}
               {!selectedUser.studentId && selectedUser.clubOrFacultyName && (
                <div className="p-4 bg-neutral-dark/30 rounded-xl border border-neutral-border col-span-2">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Organization</p>
                  <p className="text-sm text-slate-200">{selectedUser.clubOrFacultyName} ({selectedUser.clubOrFacultyType || "Staff"})</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end pt-4">
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="px-6 py-2 bg-neutral-border text-white rounded-xl text-sm font-bold hover:bg-neutral-border/80 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Assign Role Modal */}
      <Modal
        isOpen={isAssignRoleModalOpen}
        onClose={() => setIsAssignRoleModalOpen(false)}
        title="Assign Role"
      >
        <form onSubmit={confirmAssignRole} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300">Select Role</label>
            <select
              className="w-full bg-neutral-dark border border-neutral-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition"
              value={assignRoleData.role}
              onChange={(e) => setAssignRoleData({ ...assignRoleData, role: e.target.value })}
              required
            >
              <option value="EVENT_ORGANIZER">Event Organizer</option>
              <option value="CLUB_PRESIDENT">Club President</option>
              <option value="SYSTEM_ADMIN">System Admin</option>
            </select>
          </div>

          {['EVENT_ORGANIZER', 'CLUB_PRESIDENT'].includes(assignRoleData.role) && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300">Organization Name</label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science Club"
                  className="w-full bg-neutral-dark border border-neutral-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition"
                  value={assignRoleData.clubOrFacultyName}
                  onChange={(e) => setAssignRoleData({ ...assignRoleData, clubOrFacultyName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300">Organization Type</label>
                <select
                  className="w-full bg-neutral-dark border border-neutral-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition"
                  value={assignRoleData.clubOrFacultyType}
                  onChange={(e) => setAssignRoleData({ ...assignRoleData, clubOrFacultyType: e.target.value })}
                  required
                >
                  <option value="Club">Club</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Department">Department</option>
                </select>
              </div>
            </>
          )}

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={() => setIsAssignRoleModalOpen(false)}
              className="flex-1 py-3 bg-neutral-dark border border-neutral-border text-slate-300 rounded-xl font-bold hover:bg-neutral-dark/50 transition"
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              disabled={actionLoading}
            >
              {actionLoading ? (
                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Assign Role"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Revoke Role Modal */}
      <Modal
        isOpen={isRevokeRoleModalOpen}
        onClose={() => setIsRevokeRoleModalOpen(false)}
        title="Revoke Role"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center p-6 bg-orange-500/5 rounded-2xl border border-orange-500/20">
            <Shield className="text-orange-500 mb-4" size={48} />
            <h3 className="text-xl font-black text-white mb-2">Revoke Access</h3>
            <p className="text-slate-400">
              You are about to revoke the <span className="text-white font-bold">{selectedUser?.role}</span> role from <span className="text-white font-bold">{selectedUser?.name}</span>. 
              They will be demoted back to a standard student account.
            </p>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setIsRevokeRoleModalOpen(false)}
              className="flex-1 py-3 bg-neutral-dark border border-neutral-border text-slate-300 rounded-xl font-bold hover:bg-neutral-dark/50 transition"
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button 
              onClick={confirmRevokeRole}
              className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
              disabled={actionLoading}
            >
              {actionLoading ? (
                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Confirm Revocation"
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        title="Add Staff User"
      >
        <form onSubmit={confirmCreateUser} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300">Full Name</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              className="w-full bg-neutral-dark border border-neutral-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition"
              value={createUserData.name}
              onChange={(e) => setCreateUserData({ ...createUserData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300">Email Address</label>
            <input
              type="email"
              placeholder="e.g. john@university.edu"
              className="w-full bg-neutral-dark border border-neutral-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition"
              value={createUserData.email}
              onChange={(e) => setCreateUserData({ ...createUserData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300">Password</label>
            <input
              type="password"
              placeholder="Enter a secure password"
              className="w-full bg-neutral-dark border border-neutral-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition"
              value={createUserData.password}
              onChange={(e) => setCreateUserData({ ...createUserData, password: e.target.value })}
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300">Role</label>
            <select
              className="w-full bg-neutral-dark border border-neutral-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition"
              value={createUserData.role}
              onChange={(e) => setCreateUserData({ ...createUserData, role: e.target.value })}
              required
            >
              <option value="EVENT_ORGANIZER">Event Organizer</option>
              <option value="SYSTEM_ADMIN">System Admin</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={() => setIsCreateUserModalOpen(false)}
              className="flex-1 py-3 bg-neutral-dark border border-neutral-border text-slate-300 rounded-xl font-bold hover:bg-neutral-dark/50 transition"
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              disabled={actionLoading}
            >
              {actionLoading ? (
                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center p-6 bg-red-500/5 rounded-2xl border border-red-500/20">
            <AlertTriangle className="text-red-500 mb-4 animate-pulse" size={48} />
            <h3 className="text-xl font-black text-white mb-2">Are you sure?</h3>
            <p className="text-slate-400">
              You are about to permanently delete <span className="text-white font-bold">{selectedUser?.name}</span>. 
              This action cannot be undone and may affect related data.
            </p>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 py-3 bg-neutral-dark border border-neutral-border text-slate-300 rounded-xl font-bold hover:bg-neutral-dark/50 transition"
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button 
              onClick={confirmDelete}
              className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
              disabled={actionLoading}
            >
              {actionLoading ? (
                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Trash2 size={18} />
                  Confirm Delete
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Success Notification */}
      {successMessage && (
        <div className="fixed bottom-8 right-8 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-emerald-500/20 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 z-50">
          <CheckCircle2 size={20} />
          <p className="font-bold">{successMessage}</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
