import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import "./StudentProfile.css";
import "../dashboard/StudentDashboard.css"; // Reuse some layout styles if needed, or I'll copy them to Sidebar.css

const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Biotechnology",
  "Mathematics",
  "Physics",
  "Business Administration",
  "Other",
];

const StudentProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const profileRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    year: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userDataStr = localStorage.getItem("user");

    if (!token || !userDataStr) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userDataStr);
      setUser(parsedUser);
    } catch {
      navigate("/login");
      return;
    }

    fetchProfile(token);
  }, [navigate]);

  const fetchProfile = async (token) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
        setFormData({
          name: data.profile.name,
          department: data.profile.department || "",
          year: data.profile.year || "",
        });
      } else {
        setErrorMsg(data.message || "Failed to load profile");
      }
    } catch {
      setErrorMsg("Network error. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileMenu]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleEdit = () => {
    setEditing(true);
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      name: profile.name,
      department: profile.department || "",
      year: profile.year || "",
    });
    setErrorMsg("");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      // 1MB limit
      setErrorMsg("Image size too large. Max 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({ ...prev, profileImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setSaving(true);

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          profileImage: profile.profileImage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
        // Update localStorage user
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        storedUser.name = data.profile.name;
        storedUser.profileImage = data.profile.profileImage;
        localStorage.setItem("user", JSON.stringify(storedUser));
        setUser(storedUser);
        setEditing(false);
        setSuccessMsg("Profile updated successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg(data.message || "Failed to update profile");
      }
    } catch {
      setErrorMsg("Network error. Is the server running?");
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const getYearLabel = (year) => {
    const labels = {
      1: "1st Year",
      2: "2nd Year",
      3: "3rd Year",
      4: "4th Year",
      5: "5th Year",
    };
    return labels[year] || `Year ${year}`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="sd-layout">
        <div className="sd-content-wrapper">
          <div className="sp-loading-container">
            <div className="sp-spinner"></div>
            <p>Setting up your workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sd-layout">
      <div className="sd-content-wrapper">
        {/* ── Profile Header ── */}
        <header className="sp-header">
          <div className="sp-header-overlay"></div>
          <div className="sp-header-content">
            <div className="sp-profile-main">
              <div className="sp-avatar-container">
                <div className="sp-avatar-large">
                  {profile?.profileImage ? (
                    <img src={profile.profileImage} alt={profile.name} />
                  ) : (
                    getInitials(profile?.name)
                  )}
                  {editing && (
                    <label className="sp-avatar-upload">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        hidden
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                    </label>
                  )}
                </div>
                <div className="sp-status-dot"></div>
              </div>
              <div className="sp-info-text">
                <h1>{profile?.name}</h1>
                <div className="sp-meta-tags">
                  <span className="sp-role-tag">STUDENT</span>
                  <span className="sp-meta-sep">•</span>
                  <span>{profile?.department}</span>
                  <span className="sp-meta-sep">•</span>
                  <span>{getYearLabel(profile?.year)}</span>
                </div>
              </div>
            </div>
            {!editing && (
              <button className="sp-edit-btn" onClick={handleEdit}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Profile
              </button>
            )}
          </div>
        </header>

        <main className="sp-content">
          {successMsg && (
            <div className="sp-toast sp-toast-success">{successMsg}</div>
          )}
          {errorMsg && (
            <div className="sp-toast sp-toast-error">{errorMsg}</div>
          )}

          <div className="sp-grid">
            {/* ── Left Column: Information ── */}
            <div className="sp-main-col">
              <form className="sp-card" onSubmit={handleSave}>
                <div className="sp-card-header">
                  <h3>Personal Information</h3>
                  {editing && (
                    <span className="sp-editing-indicator">
                      Currently Editing
                    </span>
                  )}
                </div>
                <div className="sp-card-body">
                  <div className="sp-form-grid">
                    <div className="sp-form-group">
                      <label>Full Name</label>
                      {editing ? (
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      ) : (
                        <div className="sp-field-value">{profile?.name}</div>
                      )}
                    </div>
                    <div className="sp-form-group">
                      <label>Email Address</label>
                      <div className="sp-field-value sp-disabled">
                        {profile?.email}
                      </div>
                    </div>
                    <div className="sp-form-group">
                      <label>Student ID</label>
                      <div className="sp-field-value sp-disabled">
                        {profile?.studentId}
                      </div>
                    </div>
                    <div className="sp-form-group">
                      <label>Year of Study</label>
                      {editing ? (
                        <select
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          required
                        >
                          {[1, 2, 3, 4, 5].map((y) => (
                            <option key={y} value={y}>
                              {getYearLabel(y)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="sp-field-value">
                          {getYearLabel(profile?.year)}
                        </div>
                      )}
                    </div>
                    <div className="sp-form-group sp-full">
                      <label>Department</label>
                      {editing ? (
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Department</option>
                          {DEPARTMENTS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="sp-field-value">
                          {profile?.department}
                        </div>
                      )}
                    </div>
                  </div>

                  {editing && (
                    <div className="sp-form-footer">
                      <button
                        type="button"
                        className="sp-cancel-btn"
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="sp-save-btn"
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  )}
                </div>
              </form>

              <div className="sp-card">
                <div className="sp-card-header">
                  <h3>Security & Privacy</h3>
                </div>
                <div className="sp-card-body">
                  <div className="sp-security-row">
                    <div className="sp-security-info">
                      <h4>Password</h4>
                      <p>Change your password to keep your account secure.</p>
                    </div>
                    <button className="sp-btn-outline">Update Password</button>
                  </div>
                  <div className="sp-security-row">
                    <div className="sp-security-info">
                      <h4>Two-Factor Authentication</h4>
                      <p>Add an extra layer of security to your account.</p>
                    </div>
                    <button className="sp-btn-outline">Enable 2FA</button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right Column: Stats & Meta ── */}
            <div className="sp-side-col">
              <div className="sp-card sp-stats-card">
                <div className="sp-stat-item">
                  <span className="sp-stat-label">Joined On</span>
                  <span className="sp-stat-val">
                    {formatDate(profile?.createdAt)}
                  </span>
                </div>
                <div className="sp-divider"></div>
                <div className="sp-stat-item">
                  <span className="sp-stat-label">Participation Rate</span>
                  <span className="sp-stat-val">High</span>
                </div>
              </div>

              <div className="sp-help-card">
                <h3>Need Help?</h3>
                <p>
                  Having trouble with your profile? Contact our support team.
                </p>
                <button className="sp-support-btn">Contact Support</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentProfile;
