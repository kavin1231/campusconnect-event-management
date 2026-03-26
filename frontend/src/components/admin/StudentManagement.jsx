import React, { useEffect, useState } from "react";
import Sidebar from "../common/Sidebar";
import { authAPI } from "../../services/api";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await authAPI.getAllStudents();
      if (data.success) {
        setStudents(data.students);
      } else {
        setError(data.message || "Failed to fetch students");
      }
    } catch (err) {
      setError("An error occurred while fetching students");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex">
      <Sidebar isAdmin={true} />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="px-8 py-6 border-b border-neutral-border bg-background-dark/50 flex justify-between items-center">
          <h1 className="text-3xl font-black text-white">Student Management</h1>
          
          <div className="relative w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
            <input 
              type="text" 
              placeholder="Search students..." 
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
              <button onClick={fetchStudents} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold">Try Again</button>
            </div>
          ) : (
            <div className="bg-neutral-dark/30 rounded-2xl border border-neutral-border overflow-hidden shadow-xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-neutral-dark/80 border-b border-neutral-border text-slate-400 text-xs font-bold uppercase tracking-widest">
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Student ID</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Year</th>
                    <th className="px-6 py-4">Joined At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-border">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-neutral-dark/50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                              {student.profileImage ? (
                                <img src={student.profileImage} alt={student.name} className="size-full object-cover" />
                              ) : (
                                student.name.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{student.name}</p>
                              <p className="text-xs text-slate-400">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300 font-mono">{student.studentId}</td>
                        <td className="px-6 py-4 text-sm text-slate-300">{student.department}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-md bg-neutral-dark text-xs font-bold text-slate-300 border border-neutral-border">
                            Year {student.year}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {new Date(student.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-slate-500 italic">
                        No students found matching your search.
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

export default StudentManagement;
