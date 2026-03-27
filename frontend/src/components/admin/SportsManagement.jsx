import React, { useState, useEffect } from "react";
import { sportsAPI } from "../../services/api";
import Sidebar from "../common/Sidebar";
import "./SportsManagement.css";


const SportsManagement = () => {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentSport, setCurrentSport] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coachName: "",
    whatsappLink: "",
    imageUrl: "",
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchSports();
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {}
    }
  }, []);


  const fetchSports = async () => {
    try {
      setLoading(true);
      const data = await sportsAPI.getAllSports();
      if (data.success) {
        setSports(data.sports);
      }
    } catch (error) {
      console.error("Failed to fetch sports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (sport = null) => {
    if (sport) {
      setCurrentSport(sport);
      setFormData({
        name: sport.name,
        description: sport.description || "",
        coachName: sport.coachName || "",
        whatsappLink: sport.whatsappLink || "",
        imageUrl: sport.imageUrl || "",
      });
    } else {
      setCurrentSport(null);
      setFormData({
        name: "",
        description: "",
        coachName: "",
        whatsappLink: "",
        imageUrl: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentSport(null);
    setDragActive(false);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size too large. Max 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (currentSport) {
        response = await sportsAPI.updateSport(currentSport.id, formData);
      } else {
        response = await sportsAPI.createSport(formData);
      }

      if (response.success) {
        fetchSports();
        handleCloseModal();
      }
    } catch (error) {
      console.error("Failed to save sport:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sport?")) {
      try {
        const response = await sportsAPI.deleteSport(id);
        if (response.success) {
          fetchSports();
        }
      } catch (error) {
        console.error("Failed to delete sport:", error);
      }
    }
  };

  return (
    <div className="bg-background-dark text-slate-100 font-display min-h-screen flex">
      <Sidebar isAdmin={true} activePage="sports" />

      <div className="flex flex-col min-h-screen flex-1">
        <header className="flex items-center justify-between px-8 py-4 border-b border-neutral-border bg-background-dark">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3 text-white">
              <div className="size-9 bg-primary rounded-xl flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-white text-lg">
                  sports_basketball
                </span>
              </div>
              <h2 className="text-xl font-extrabold tracking-wide">NEXORA</h2>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-semibold text-white">
                {user?.name || "Admin User"}
              </p>
              <p className="text-xs text-slate-400">
                {user?.role || "Administrator"}
              </p>
            </div>
            <div className="size-11 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-primary font-bold">
              {user?.name?.charAt(0) || "A"}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="sports-mgmt-container">
            <div className="sports-mgmt-header">
              <h1>🏆 Sports Management</h1>
              <button
                className="btn-add-sport"
                onClick={() => handleOpenModal()}
              >
                Add New Sport
              </button>
            </div>

            {loading ? (
              <div className="loading-spinner">Loading...</div>
            ) : (
              <div className="sports-grid">
                {sports.map((sport) => (
                  <div key={sport.id} className="sport-card-admin">
                    <div
                      className="sport-card-image"
                      style={{
                        backgroundImage: `url(${sport.imageUrl || "/default-sport.jpg"})`,
                      }}
                    ></div>
                    <div className="sport-card-details">
                      <h3>{sport.name}</h3>
                      <p className="sport-coach">
                        Coach: {sport.coachName || "N/A"}
                      </p>
                      <div className="sport-actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleOpenModal(sport)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(sport.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>



      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{currentSport ? "Edit Sport" : "Add New Sport"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Sport Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                ></textarea>
              </div>
              <div className="form-group">
                <label>Coach/Contact Person</label>
                <input
                  type="text"
                  name="coachName"
                  value={formData.coachName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>WhatsApp Group Link</label>
                <input
                  type="url"
                  name="whatsappLink"
                  value={formData.whatsappLink}
                  onChange={handleChange}
                  placeholder="https://chat.whatsapp.com/..."
                />
              </div>
              <div className="form-group">
                <label>Sport Image</label>
                <div
                  className={`image-upload-zone ${dragActive ? "drag-active" : ""} ${formData.imageUrl ? "has-image" : ""}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {formData.imageUrl ? (
                    <div className="image-preview-container">
                      <img src={formData.imageUrl} alt="Preview" />
                      <button
                        type="button"
                        className="btn-remove-image"
                        onClick={handleRemoveImage}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className="upload-label">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        hidden
                      />
                      <div className="upload-icon">📁</div>
                      <p>
                        <strong>Drag & drop</strong> or <span>browse</span>
                      </p>
                      <span className="upload-hint">JPG, PNG, WebP (Max 2MB)</span>
                    </label>
                  )}
                </div>
              </div>
              <div className="modal-actions">

                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {currentSport ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export default SportsManagement;
