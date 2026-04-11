import React, { useState, useEffect } from "react";
import Sidebar from "../common/Sidebar";
import { authAPI } from "../../services/api";
import { ShieldCheck, UserRound, Users, ShieldAlert, Key, Search, Plus, X, Building2, School } from "lucide-react";
import { CLUBS, FACULTIES } from "../../constants/staticData";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-neutral-dark border border-neutral-border w-full max-w-3xl rounded-[2rem] overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-neutral-border bg-background-dark/50 flex items-center justify-between">
          <h3 className="text-xl font-black text-white">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

const RoleManagement = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  // Assignment Form State
  const [assignment, setAssignment] = useState({
    studentId: "",
    clubOrFacultyName: "",
    clubOrFacultyType: "CLUB"
  });

  const [staffData, setStaffData] = useState({
    name: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    fetchUsers();
    if (selectedRole && selectedRole !== "system-admin") {
      fetchStudents();
    }
  }, [selectedRole]);

  const fetchUsers = async () => {
    try {
      const data = await authAPI.getAllUsers();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await authAPI.getAllStudents();
      if (data.success) {
        setStudents(data.students);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const selectedRoleData = roles.find(r => r.id === selectedRole);
      
      let res;
      if (selectedRole === 'club-president') {
        res = await authAPI.assignRole({
          ...assignment,
          role: "CLUB_PRESIDENT"
        });
      } else {
        res = await authAPI.createUser({
          ...staffData,
          role: selectedRoleData.roleKey
        });
      }
      
      if (res.success) {
        setMessage({ type: "success", text: res.message });
        setAssignment({ studentId: "", clubOrFacultyName: "", clubOrFacultyType: "CLUB" });
        setStaffData({ name: "", email: "", password: "" });
        setShowForm(false); // Close form/modal on success
        fetchUsers();
        setTimeout(() => setSelectedRole(null), 2000);
      } else {
        setMessage({ type: "error", text: res.message || "Something went wrong" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Operation failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to revoke the President role from ${userName}?`)) {
      return;
    }

    try {
      setLoading(true);
      const res = await authAPI.revokeRole(userId);
      if (res.success) {
        setMessage({ type: "success", text: res.message });
        fetchUsers(); // Refresh the list
      } else {
        setMessage({ type: "error", text: res.message });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to revoke role" });
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roles = [
    {
      id: "system-admin",
      title: "System Administrators",
      description: "Full access to platform configuration, user management, and global settings.",
      icon: <ShieldCheck className="text-red-400" size={24} />,
      color: "border-red-500/30 bg-red-500/10",
      users: users.filter(u => u.role === "SYSTEM_ADMIN").length,
      manageable: true,
      roleKey: "SYSTEM_ADMIN"
    },
    {
      id: "event-organizer",
      title: "Event Organizers",
      description: "Authorized to create events, manage logistics, and handle ticket sales.",
      icon: <Users className="text-blue-400" size={24} />,
      color: "border-blue-500/30 bg-blue-500/10",
      users: users.filter(u => u.role === "EVENT_ORGANIZER").length,
      manageable: true,
      roleKey: "EVENT_ORGANIZER"
    },
    {
      id: "club-president",
      title: "Club Presidents",
      description: "Manage club-specific resources, team members, and event requests.",
      icon: <UserRound className="text-emerald-400" size={24} />,
      color: "border-emerald-500/30 bg-emerald-500/10",
      users: users.filter(u => u.role === "CLUB_PRESIDENT").length,
      manageable: true,
      roleKey: "CLUB_PRESIDENT"
    }
  ];

  return (
    <div className="bg-background-dark text-slate-100 font-display min-h-screen flex">
      <Sidebar isAdmin={true} />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="px-8 py-6 border-b border-neutral-border bg-background-dark/50 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-white">Permissions & Roles</h1>
            <p className="text-slate-400 text-sm mt-1">Manage platform access levels and user responsibilities.</p>
          </div>
          
          <button className="flex items-center gap-2 bg-neutral-dark border border-neutral-border hover:border-primary text-white px-4 py-2 rounded-xl text-sm font-bold transition">
            <ShieldAlert size={18} className="text-primary" />
            <span>Audit Logs</span>
          </button>
        </header>

        <main className="flex-1 p-8">
          {!selectedRole ? (
            <>
              <div className="mb-10">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Key size={20} className="text-primary" />
                  <span>Available Roles</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {roles.map((role) => (
                    <div 
                      key={role.id} 
                      onClick={() => role.manageable && setSelectedRole(role.id)}
                      className={`p-8 rounded-2xl border ${role.color} transition hover:scale-[1.02] duration-300 ${role.manageable ? 'cursor-pointer hover:border-primary group' : ''}`}
                    >
                      <div className="size-12 rounded-xl bg-background-dark/50 flex items-center justify-center mb-6 border border-white/5 transition group-hover:border-primary/30">
                        {role.icon}
                      </div>
                      <h3 className="text-xl font-black text-white mb-2">{role.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed mb-6">
                        {role.description}
                      </p>
                      <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{role.users} Active Users</span>
                        {role.manageable && (
                          <div className="text-xs font-bold text-primary group-hover:underline flex items-center gap-1">
                            <span>Manage Members</span>
                            <Plus size={14} className="group-hover:translate-x-1 transition" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-dark/30 rounded-2xl border border-neutral-border p-8">
                <h3 className="text-lg font-bold text-white mb-2">Platform Logic</h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                  Roles are hierarchical. System administrators can override any permission. 
                  Changes to role definitions will affect all assigned users immediately.
                </p>
              </div>
            </>
          ) : (
            <div className="max-w-[1600px] mx-auto w-full">
              <button 
                onClick={() => setSelectedRole(null)}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition font-bold text-sm"
              >
                <X size={16} />
                <span>Back to Overview</span>
              </button>

              <div className="bg-neutral-dark/30 border border-neutral-border rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-neutral-border bg-background-dark/50">
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`size-12 rounded-2xl flex items-center justify-center border ${roles.find(r => r.id === selectedRole)?.color}`}>
                      {roles.find(r => r.id === selectedRole)?.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white leading-tight">
                        Manage {roles.find(r => r.id === selectedRole)?.title}
                      </h2>
                      <p className="text-slate-400 text-sm">View active members and assign new personnel to this role.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowForm(true)}
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl font-black transition flex items-center gap-2 shadow-lg shadow-primary/20"
                  >
                    <Plus size={20} />
                    <span>Add {selectedRole === 'club-president' ? 'President' : 'Member'}</span>
                  </button>
                </div>

                <Modal 
                  isOpen={showForm} 
                  onClose={() => setShowForm(false)} 
                  title={selectedRole === 'club-president' ? "Assign New Club President" : `Create New ${roles.find(r => r.id === selectedRole)?.roleKey.replace('_', ' ')} Account`}
                >
                  <form onSubmit={handleAssign} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {selectedRole === 'club-president' ? (
                        <>
                          {/* Student Selection (Assignment) */}
                          <div className="space-y-4">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em]">1. Select Student</label>
                            
                            {!assignment.studentId ? (
                              <>
                              <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input 
                                  type="text"
                                  placeholder="Type student name or ID..."
                                  className="w-full bg-neutral-dark border border-neutral-border rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition"
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                />
                              </div>

                              {searchTerm.length > 0 && (
                                <div className="absolute z-50 w-full mt-2 max-h-64 overflow-y-auto rounded-2xl border border-neutral-border bg-neutral-dark/95 backdrop-blur-xl shadow-2xl">
                                  {filteredStudents.length > 0 ? (
                                    filteredStudents.map(student => (
                                      <button
                                        key={student.id}
                                        type="button"
                                        onClick={() => {
                                          setAssignment({...assignment, studentId: student.id});
                                          setSearchTerm("");
                                        }}
                                        className="w-full p-4 flex items-center gap-4 border-b border-neutral-border last:border-0 hover:bg-primary/10 transition text-left"
                                      >
                                        <div className="size-10 rounded-full bg-neutral-dark flex items-center justify-center text-slate-300 font-black text-sm border border-white/5">
                                          {student.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                          <p className="text-sm font-bold text-white">{student.name}</p>
                                          <p className="text-xs text-slate-500">{student.studentId} • {student.department}</p>
                                        </div>
                                      </button>
                                    ))
                                  ) : (
                                    <div className="p-8 text-center text-slate-500 italic text-sm">No users found matching "{searchTerm}"</div>
                                  )}
                                </div>
                              )}
                            </>
                          ) : (
                              <div className="p-6 rounded-2xl border-2 border-primary bg-primary/5 flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                  <div className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-lg">
                                    {students.find(s => s.id === assignment.studentId)?.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="text-white font-bold">{students.find(s => s.id === assignment.studentId)?.name}</p>
                                    <p className="text-slate-400 text-xs">{students.find(s => s.id === assignment.studentId)?.studentId} • {students.find(s => s.id === assignment.studentId)?.department}</p>
                                  </div>
                                </div>
                                <button 
                                  type="button"
                                  onClick={() => setAssignment({...assignment, studentId: ""})}
                                  className="bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 p-2 rounded-xl transition"
                                >
                                  <X size={18} />
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="space-y-6">
                            <div className="space-y-4">
                              <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em]">2. Entity Type</label>
                              <div className="grid grid-cols-2 gap-4">
                                <button
                                  type="button"
                                  onClick={() => setAssignment({...assignment, clubOrFacultyType: "CLUB"})}
                                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition ${assignment.clubOrFacultyType === "CLUB" ? 'bg-primary/10 border-primary text-primary' : 'bg-neutral-dark/30 border-neutral-border text-slate-400 hover:border-slate-600'}`}
                                >
                                  <Building2 size={24} />
                                  <span className="text-xs font-black uppercase">Club</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setAssignment({...assignment, clubOrFacultyType: "FACULTY"})}
                                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition ${assignment.clubOrFacultyType === "FACULTY" ? 'bg-primary/10 border-primary text-primary' : 'bg-neutral-dark/30 border-neutral-border text-slate-400 hover:border-slate-600'}`}
                                >
                                  <School size={24} />
                                  <span className="text-xs font-black uppercase">Faculty</span>
                                </button>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em]">3. Entity Name</label>
                              <select 
                                required
                                className="w-full bg-neutral-dark border border-neutral-border rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-primary transition"
                                value={assignment.clubOrFacultyName}
                                onChange={(e) => setAssignment({...assignment, clubOrFacultyName: e.target.value})}
                              >
                                <option value="" disabled style={{ background: '#0B0F19', color: 'white' }}>Select {assignment.clubOrFacultyType === "CLUB" ? "Club" : "Faculty"}...</option>
                                {(assignment.clubOrFacultyType === "CLUB" ? CLUBS : FACULTIES).map(item => (
                                  <option key={item} value={item} style={{ background: '#0B0F19', color: 'white' }}>{item}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* New Staff User Creation Form */}
                          <div className="space-y-4">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Account Info</label>
                            <div className="space-y-4">
                              <div>
                                <input 
                                  type="text"
                                  placeholder="Full Name"
                                  className="w-full bg-neutral-dark border border-neutral-border rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-primary transition"
                                  value={staffData.name}
                                  onChange={(e) => setStaffData({...staffData, name: e.target.value})}
                                  required
                                />
                              </div>
                              <div>
                                <input 
                                  type="email"
                                  placeholder="Corporate Email (e.g. name@nexora.edu)"
                                  className="w-full bg-neutral-dark border border-neutral-border rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-primary transition"
                                  value={staffData.email}
                                  onChange={(e) => setStaffData({...staffData, email: e.target.value})}
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Initial Credentials</label>
                            <div>
                              <input 
                                type="password"
                                placeholder="Setup Initial Password"
                                className="w-full bg-neutral-dark border border-neutral-border rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-primary transition"
                                value={staffData.password}
                                onChange={(e) => setStaffData({...staffData, password: e.target.value})}
                                required
                              />
                              <p className="text-[10px] text-slate-500 mt-2 italic px-2"> Users should be advised to change their password upon first login.</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="pt-6 border-t border-neutral-border flex justify-end">
                      <button
                        type="submit"
                        disabled={loading || (selectedRole === 'club-president' ? !assignment.studentId || !assignment.clubOrFacultyName : !staffData.name || !staffData.email || !staffData.password)}
                        className="bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-4 rounded-3xl font-black transition shadow-lg shadow-primary/20 flex items-center gap-2"
                      >
                        {loading ? (
                          <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : <Plus size={20} />}
                        <span>{selectedRole === 'club-president' ? 'Assign President Role' : `Create Account`}</span>
                      </button>
                    </div>
                  </form>
                </Modal>
              </div>

              {/* Active Members List */}
              <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-black text-white">Active {roles.find(r => r.id === selectedRole)?.title}</h3>
                    <p className="text-slate-400 text-sm">List of currently assigned personnel for this role.</p>
                  </div>
                  <div className="bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-lg border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
                    {users.filter(u => u.role === roles.find(r => r.id === selectedRole)?.roleKey).length} Assigned
                  </div>
                </div>

                <div className="bg-neutral-dark/30 border border-neutral-border rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-background-dark/50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-bottom border-neutral-border">
                        <th className="px-6 py-4">User</th>
                        {selectedRole === 'club-president' && <th className="px-6 py-4">Assigned Entity</th>}
                        {selectedRole === 'club-president' && <th className="px-6 py-4">Type</th>}
                        <th className="px-6 py-4">Joined Date</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-border">
                      {users.filter(u => u.role === roles.find(r => r.id === selectedRole)?.roleKey).length > 0 ? (
                        users.filter(u => u.role === roles.find(r => r.id === selectedRole)?.roleKey).map(user => (
                          <tr key={user.id} className="hover:bg-white/5 transition group">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-neutral-dark border border-white/5 flex items-center justify-center text-slate-300 font-bold">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-white">{user.name}</p>
                                  <p className="text-xs text-slate-500 italic">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            {selectedRole === 'club-president' && (
                              <td className="px-6 py-5">
                                <span className="text-sm font-medium text-slate-200">{user.clubOrFacultyName || "Not Assigned"}</span>
                              </td>
                            )}
                            {selectedRole === 'club-president' && (
                              <td className="px-6 py-5">
                                <span className={`text-[10px] font-black px-2 py-1 rounded-md border ${user.clubOrFacultyType === 'CLUB' ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' : 'border-purple-500/30 text-purple-400 bg-purple-500/10'}`}>
                                  {user.clubOrFacultyType || "N/A"}
                                </span>
                              </td>
                            )}
                            <td className="px-6 py-5 text-sm text-slate-400">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-5 text-right">
                              <button 
                                onClick={() => handleRevoke(user.id, user.name)}
                                className="text-slate-500 hover:text-red-400 p-2 transition opacity-0 group-hover:opacity-100"
                                title="Revoke Role"
                              >
                                <X size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-slate-500 italic text-sm">
                            No active {roles.find(r => r.id === selectedRole)?.title.toLowerCase()} assigned yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RoleManagement;
