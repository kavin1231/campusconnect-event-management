import React, { useState, useEffect } from "react";
import Sidebar from "../common/Sidebar";
import { groupLinksAPI, sportsAPI } from "../../services/api";
import { Link2, Plus, Trash2, ExternalLink, Loader2, Trophy, Users, Edit } from "lucide-react";

const GroupLinksManagement = () => {
  const [links, setLinks] = useState([]);
  const [sports, setSports] = useState([]);
  const [activeTab, setActiveTab] = useState("sports"); // Default to sports to address user report
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddSportModal, setShowAddSportModal] = useState(false);
  const [showEditLinkModal, setShowEditLinkModal] = useState(false);
  const [newLink, setNewLink] = useState({ name: "", platform: "WhatsApp", url: "", category: "General" });
  const [newSport, setNewSport] = useState({ name: "", description: "", coachName: "", whatsappLink: "" });
  const [showEditSportModal, setShowEditSportModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [editingSport, setEditingSport] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [linksData, sportsData] = await Promise.all([
        groupLinksAPI.getAllLinks(),
        sportsAPI.getAllSports()
      ]);

      if (linksData.success) setLinks(linksData.links);
      if (sportsData.success) setSports(sportsData.sports);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load extracurricular data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const data = await groupLinksAPI.createLink(newLink);
      if (data.success) {
        setLinks([data.link, ...links]);
        setShowAddModal(false);
        setNewLink({ name: "", platform: "WhatsApp", url: "", category: "General" });
      }
    } catch (err) {
      console.error("Failed to add link:", err);
      alert("Failed to save link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSport = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const data = await sportsAPI.createSport(newSport);
      if (data.success) {
        setSports([data.sport, ...sports]);
        setShowAddSportModal(false);
        setNewSport({ name: "", description: "", coachName: "", whatsappLink: "" });
      }
    } catch (err) {
      console.error("Failed to add sport:", err);
      alert("Failed to save sport.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSport = (sport) => {
    setEditingSport(sport);
    setNewSport({
      name: sport.name,
      description: sport.description || "",
      coachName: sport.coachName || "",
      whatsappLink: sport.whatsappLink || ""
    });
    setShowEditSportModal(true);
  };

  const handleUpdateSport = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const data = await sportsAPI.updateSport(editingSport.id, newSport);
      if (data.success) {
        setSports(sports.map(s => s.id === editingSport.id ? data.sport : s));
        setShowEditSportModal(false);
        setEditingSport(null);
        setNewSport({ name: "", description: "", coachName: "", whatsappLink: "" });
      }
    } catch (err) {
      console.error("Failed to update sport:", err);
      alert("Failed to update sport.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSport = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sport club?")) return;
    try {
      const data = await sportsAPI.deleteSport(id);
      if (data.success) {
        setSports(sports.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete sport:", err);
      alert("Failed to delete sport.");
    }
  };

  const handleDeleteLink = async (id) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;
    try {
      const data = await groupLinksAPI.deleteLink(id);
      if (data.success) {
        setLinks(links.filter(link => link.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete link:", err);
      alert("Failed to delete link.");
    }
  };

  const handleEditLink = (link) => {
    setEditingLink(link);
    setNewLink({
      name: link.name,
      platform: link.platform || "WhatsApp",
      url: link.url || "",
      category: link.category || "General"
    });
    setShowEditLinkModal(true);
  };

  const handleUpdateLink = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const data = await groupLinksAPI.updateLink(editingLink.id, newLink);
      if (data.success) {
        setLinks(links.map(l => l.id === editingLink.id ? data.link : l));
        setShowEditLinkModal(false);
        setEditingLink(null);
        setNewLink({ name: "", platform: "WhatsApp", url: "", category: "General" });
      }
    } catch (err) {
      console.error("Failed to update link:", err);
      alert("Failed to update link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background-dark text-slate-100 font-display min-h-screen flex">
      <Sidebar isAdmin={true} />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="px-8 py-6 border-b border-neutral-border bg-background-dark/50 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-white">Manage Social</h1>
            <p className="text-slate-400 text-sm mt-1">Manage sports clubs and social group links for students.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-neutral-dark/50 p-1 rounded-xl border border-neutral-border mr-4">
              <button 
                onClick={() => setActiveTab("sports")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === "sports" ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
              >
                <Trophy size={16} />
                <span>Sports Clubs</span>
              </button>
              <button 
                onClick={() => setActiveTab("links")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === "links" ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
              >
                <Users size={16} />
                <span>Social Hub</span>
              </button>
            </div>

            {activeTab === "links" ? (
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl font-bold transition shadow-lg shadow-primary/20"
              >
                <Plus size={18} />
                <span>Add Hub Link</span>
              </button>
            ) : (
              <button 
                onClick={() => setShowAddSportModal(true)}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-bold transition shadow-lg shadow-orange-500/20"
              >
                <Plus size={18} />
                <span>Add Sport Club</span>
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <Loader2 size={48} className="mb-4 animate-spin opacity-20" />
              <p className="italic">Loading hubs...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-red-500">
              <p className="font-bold">{error}</p>
              <button onClick={fetchAllData} className="mt-4 text-primary hover:underline">Retry</button>
            </div>
          ) : activeTab === "sports" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sports.map((sport) => (
                <div key={sport.id} className="bg-neutral-dark/30 rounded-2xl border border-neutral-border p-6 hover:border-primary/50 transition relative group flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="size-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                      <Trophy size={24} />
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditSport(sport)}
                        className="text-slate-500 hover:text-primary transition"
                        title="Edit Sport"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteSport(sport.id)}
                        className="text-slate-500 hover:text-red-500 transition"
                        title="Delete Sport"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-1">{sport.name}</h3>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">{sport.description || "Official campus sports club"}</p>
                  
                  <div className="space-y-2 mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Coach:</span>
                      <span className="text-slate-300 font-bold">{sport.coachName || 'N/A'}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">WhatsApp:</span>
                      <span className="text-slate-300 truncate max-w-[150px]">{sport.whatsappLink ? "Linked" : "Not Linked"}</span>
                    </div>
                  </div>
                </div>
              ))}
              {sports.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center h-64 text-slate-500">
                  <Trophy size={48} className="mb-4 opacity-20" />
                  <p className="italic">No sports clubs found.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {links.map((link) => (
                <div key={link.id} className="bg-neutral-dark/30 rounded-2xl border border-neutral-border p-6 hover:border-primary/50 transition relative group flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Link2 size={24} />
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditLink(link)}
                        className="text-slate-500 hover:text-primary transition"
                        title="Edit Link"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                         onClick={() => handleDeleteLink(link.id)}
                        className="text-slate-500 hover:text-red-500 transition"
                        title="Delete Link"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-1">{link.name}</h3>
                  <p className="text-xs text-slate-400 mb-4">{link.platform} • {link.category}</p>
                  
                  <div className="mt-auto pt-4 border-t border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Target:</span>
                      <span className="text-slate-300 truncate max-w-[150px] font-mono">{link.url}</span>
                    </div>
                  </div>
                </div>
              ))}
              {links.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center h-64 text-slate-500">
                  <Users size={48} className="mb-4 opacity-20" />
                  <p className="italic">No social hub links added yet.</p>
                </div>
              )}
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
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  <span>{isSubmitting ? "Saving..." : "Save Link"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-neutral-dark border border-neutral-border rounded-2xl w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-2xl font-black text-white mb-6">Edit Group Link</h2>
            <form onSubmit={handleUpdateLink} className="space-y-4">
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
                  onClick={() => {
                    setShowEditLinkModal(false);
                    setEditingLink(null);
                    setNewLink({ name: "", platform: "WhatsApp", url: "", category: "General" });
                  }}
                  className="flex-1 py-3 border border-neutral-border rounded-xl text-sm font-bold text-slate-400 hover:bg-neutral-dark/50 transition"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  <span>{isSubmitting ? "Updating..." : "Update Link"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddSportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-neutral-dark border border-neutral-border rounded-2xl w-full max-w-md p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-400">
                <Trophy size={20} />
              </div>
              <h2 className="text-2xl font-black text-white">Add Sport Club</h2>
            </div>
            <form onSubmit={handleAddSport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Club Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-neutral-dark/50 border border-neutral-border rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary"
                  value={newSport.name}
                  onChange={(e) => setNewSport({...newSport, name: e.target.value})}
                  placeholder="e.g. Cricket Club"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Coach / Contact</label>
                <input 
                  type="text" 
                  className="w-full bg-neutral-dark/50 border border-neutral-border rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary"
                  value={newSport.coachName}
                  onChange={(e) => setNewSport({...newSport, coachName: e.target.value})}
                  placeholder="Coach name or contact info"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">WhatsApp Group Link</label>
                <input 
                  type="url" 
                  className="w-full bg-neutral-dark/50 border border-neutral-border rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary"
                  value={newSport.whatsappLink}
                  onChange={(e) => setNewSport({...newSport, whatsappLink: e.target.value})}
                  placeholder="https://chat.whatsapp.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Description</label>
                <textarea 
                  className="w-full bg-neutral-dark/50 border border-neutral-border rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary resize-none"
                  rows={3}
                  value={newSport.description}
                  onChange={(e) => setNewSport({...newSport, description: e.target.value})}
                  placeholder="Brief description of the club..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddSportModal(false)}
                  className="flex-1 py-3 border border-neutral-border rounded-xl text-sm font-bold text-slate-400 hover:bg-neutral-dark/50 transition"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  <span>{isSubmitting ? "Creating..." : "Create Club"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditSportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-neutral-dark border border-neutral-border rounded-2xl w-full max-w-md p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                <Edit size={20} />
              </div>
              <h2 className="text-2xl font-black text-white">Edit Sport Club</h2>
            </div>
            <form onSubmit={handleUpdateSport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Club Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-neutral-dark/50 border border-neutral-border rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary"
                  value={newSport.name}
                  onChange={(e) => setNewSport({...newSport, name: e.target.value})}
                  placeholder="e.g. Cricket Club"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Coach / Contact</label>
                <input 
                  type="text" 
                  className="w-full bg-neutral-dark/50 border border-neutral-border rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary"
                  value={newSport.coachName}
                  onChange={(e) => setNewSport({...newSport, coachName: e.target.value})}
                  placeholder="Coach name or contact info"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">WhatsApp Group Link</label>
                <input 
                  type="url" 
                  className="w-full bg-neutral-dark/50 border border-neutral-border rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary"
                  value={newSport.whatsappLink}
                  onChange={(e) => setNewSport({...newSport, whatsappLink: e.target.value})}
                  placeholder="https://chat.whatsapp.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Description</label>
                <textarea 
                  className="w-full bg-neutral-dark/50 border border-neutral-border rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary resize-none"
                  rows={3}
                  value={newSport.description}
                  onChange={(e) => setNewSport({...newSport, description: e.target.value})}
                  placeholder="Brief description of the club..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowEditSportModal(false);
                    setEditingSport(null);
                    setNewSport({ name: "", description: "", coachName: "", whatsappLink: "" });
                  }}
                  className="flex-1 py-3 border border-neutral-border rounded-xl text-sm font-bold text-slate-400 hover:bg-neutral-dark/50 transition"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  <span>{isSubmitting ? "Updating..." : "Update Club"}</span>
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
