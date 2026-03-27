import React, { useState } from "react";
import Sidebar from "../common/Sidebar";
import { Link2, Plus, Trash2, ExternalLink } from "lucide-react";

const GroupLinksManagement = () => {
  const [links, setLinks] = useState([
    { id: 1, name: "WhatsApp Main Group", platform: "WhatsApp", url: "https://chat.whatsapp.com/...", category: "General" },
    { id: 2, name: "Telegram Study Support", platform: "Telegram", url: "https://t.me/...", category: "Academic" },
    { id: 3, name: "Discord Sports Hub", platform: "Discord", url: "https://discord.gg/...", category: "Sports" },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newLink, setNewLink] = useState({ name: "", platform: "WhatsApp", url: "", category: "General" });

  const handleAddLink = (e) => {
    e.preventDefault();
    setLinks([...links, { id: Date.now(), ...newLink }]);
    setShowAddModal(false);
    setNewLink({ name: "", platform: "WhatsApp", url: "", category: "General" });
  };

  const handleDeleteLink = (id) => {
    setLinks(links.filter(link => link.id !== id));
  };

  return (
    <div className="bg-background-dark text-slate-100 font-display min-h-screen flex">
      <Sidebar isAdmin={true} />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="px-8 py-6 border-b border-neutral-border bg-background-dark/50 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-white">Group Links Management</h1>
            <p className="text-slate-400 text-sm mt-1">Manage extracurricular and social group links for students.</p>
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl font-bold transition shadow-lg shadow-primary/20"
          >
            <Plus size={18} />
            <span>Add New Link</span>
          </button>
        </header>

        <main className="flex-1 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {links.map((link) => (
              <div key={link.id} className="bg-neutral-dark/30 rounded-2xl border border-neutral-border p-6 hover:border-primary/50 transition relative group">
                <div className="flex justify-between items-start mb-4">
                  <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Link2 size={24} />
                  </div>
                  <button 
                    onClick={() => handleDeleteLink(link.id)}
                    className="text-slate-500 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-1">{link.name}</h3>
                <p className="text-xs text-slate-400 mb-4">{link.platform} • {link.category}</p>
                
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center justify-center gap-2 w-full py-2 bg-neutral-dark border border-neutral-border rounded-xl text-sm font-bold text-slate-300 hover:bg-neutral-dark/80 transition"
                >
                  <span>Visit Link</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>

          {links.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <Link2 size={48} className="mb-4 opacity-20" />
              <p className="italic">No group links added yet.</p>
            </div>
          )}
        </main>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-neutral-dark border border-neutral-border rounded-2xl w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-2xl font-black text-white mb-6">Add New Group Link</h2>
            <form onSubmit={handleAddLink} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Group Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-neutral-dark/50 border border-neutral-border rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary"
                  value={newLink.name}
                  onChange={(e) => setNewLink({...newLink, name: e.target.value})}
                  placeholder="e.g. 1st Year WhatsApp Hub"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Platform</label>
                  <select 
                    className="w-full bg-neutral-dark/50 border border-neutral-border rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary"
                    value={newLink.platform}
                    onChange={(e) => setNewLink({...newLink, platform: e.target.value})}
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Telegram">Telegram</option>
                    <option value="Discord">Discord</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Category</label>
                  <input 
                    type="text"
                    required
                    className="w-full bg-neutral-dark/50 border border-neutral-border rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary"
                    value={newLink.category}
                    onChange={(e) => setNewLink({...newLink, category: e.target.value})}
                    placeholder="e.g. Creative"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">URL</label>
                <input 
                  type="url" 
                  required
                  className="w-full bg-neutral-dark/50 border border-neutral-border rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary"
                  value={newLink.url}
                  onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-neutral-border rounded-xl text-sm font-bold text-slate-400 hover:bg-neutral-dark/50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold transition shadow-lg shadow-primary/20"
                >
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupLinksManagement;
