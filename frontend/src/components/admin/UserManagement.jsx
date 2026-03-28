import React, { useEffect, useState } from "react";
import Sidebar from "../common/Sidebar";
import { authAPI } from "../../services/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("students"); // "students" or "management"

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
        return <span className="px-2 py-1 rounded-md bg-neutral-dark text-xs font-bold text-slate-300 border border-neutral-border">{role}</span>;
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
          
          <div className="relative w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`} 
              className="w-full bg-neutral-dark border border-neutral-border rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                                <img src={user.profileImage} alt={user.name} className="size-full object-cover" />
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
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={activeTab === "management" ? "3" : "4"} className="px-6 py-10 text-center text-slate-500 italic">
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
    </div>
  );
};

export default UserManagement;
