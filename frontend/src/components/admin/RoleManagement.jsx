import React, { useState, useEffect } from "react";
import Sidebar from "../common/Sidebar";
import { authAPI } from "../../services/api";
import { ShieldCheck, UserRound, Users, ShieldAlert, Key, Search, Plus, X, Building2, School } from "lucide-react";

const RoleManagement = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  // Assignment Form State
  const [assignment, setAssignment] = useState({
    studentId: "",
    clubOrFacultyName: "",
    clubOrFacultyType: "CLUB"
  });

  useEffect(() => {
    if (selectedRole === "club-president") {
      fetchStudents();
    }
  }, [selectedRole]);

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
      const res = await authAPI.assignRole({
        ...assignment,
        role: "CLUB_PRESIDENT"
      });
      
      if (res.success) {
        setMessage({ type: "success", text: res.message });
        setAssignment({ studentId: "", clubOrFacultyName: "", clubOrFacultyType: "CLUB" });
        setTimeout(() => setSelectedRole(null), 2000);
      } else {
        setMessage({ type: "error", text: res.message });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to assign role" });
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
      users: 2,
      manageable: false
    },
    {
      id: "event-organizer",
      title: "Event Organizers",
      description: "Authorized to create events, manage logistics, and handle ticket sales.",
      icon: <Users className="text-blue-400" size={24} />,
      color: "border-blue-500/30 bg-blue-500/10",
      users: 5,
      manageable: false
    },
    {
      id: "club-president",
      title: "Club Presidents",
      description: "Manage club-specific resources, team members, and event requests.",
      icon: <UserRound className="text-emerald-400" size={24} />,
      color: "border-emerald-500/30 bg-emerald-500/10",
      users: 12,
      manageable: true
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
                    <div key={role.id} className={`p-8 rounded-2xl border ${role.color} transition hover:scale-[1.02] duration-300`}>
                      <div className="size-12 rounded-xl bg-background-dark/50 flex items-center justify-center mb-6 border border-white/5">
                        {role.icon}
                      </div>
                      <h3 className="text-xl font-black text-white mb-2">{role.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed mb-6">
                        {role.description}
                      </p>
                      <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{role.users} Active Users</span>
                        {role.manageable && (
                          <button 
                            onClick={() => setSelectedRole(role.id)}
                            className="text-xs font-bold text-primary hover:underline"
                          >
                            Manage Members →
                          </button>
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
            <div className="max-w-4xl mx-auto">
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
                    <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                      <UserRound size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white leading-tight">Assign Club President</h2>
                      <p className="text-slate-400 text-sm">Select a student and assign them to a specific club or faculty.</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleAssign} className="p-8 space-y-8">
                  {message && (
                    <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                      <span>{message.text}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Student Selection */}
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em]">1. Select Student</label>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                          type="text"
                          placeholder="Search name or student ID..."
                          className="w-full bg-neutral-dark border border-neutral-border rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>

                      <div className="max-h-64 overflow-y-auto rounded-2xl border border-neutral-border bg-neutral-dark/20 pr-1 mr-[-4px]">
                        {loading && students.length === 0 ? (
                          <div className="p-8 text-center text-slate-500 italic text-sm">Loading students...</div>
                        ) : filteredStudents.length > 0 ? (
                          filteredStudents.map(student => (
                            <button
                              key={student.id}
                              type="button"
                              onClick={() => setAssignment({...assignment, studentId: student.id})}
                              className={`w-full p-4 flex items-center gap-4 border-b border-neutral-border last:border-0 transition text-left ${assignment.studentId === student.id ? 'bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-white/5'}`}
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
                          <div className="p-8 text-center text-slate-500 italic text-sm">No students found</div>
                        )}
                      </div>
                    </div>

                    {/* Entity Details */}
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
                        <input 
                          type="text"
                          required
                          placeholder={assignment.clubOrFacultyType === "CLUB" ? "e.g. Sports Club" : "e.g. Faculty of Computing"}
                          className="w-full bg-neutral-dark border border-neutral-border rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-primary transition"
                          value={assignment.clubOrFacultyName}
                          onChange={(e) => setAssignment({...assignment, clubOrFacultyName: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-neutral-border flex justify-end">
                    <button
                      type="submit"
                      disabled={loading || !assignment.studentId || !assignment.clubOrFacultyName}
                      className="bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-4 rounded-2xl font-black transition shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                      {loading ? (
                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : <Plus size={20} />}
                      <span>Assign President Role</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RoleManagement;
