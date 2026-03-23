import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import { governanceAPI } from "../../services/api";
import "./PresidentRegistrationForm.css";

const PresidentRegistrationForm = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [hasExistingApplication, setHasExistingApplication] = useState(false);
  const [existingApplication, setExistingApplication] = useState(null);

  const [formData, setFormData] = useState({
    presidentName: "",
    candidateId: "",
    clubOrFacultyType: "CLUB",
    clubOrFacultyName: "",
    currentQualification: "",
    email: "",
  });

  const clubs = [
    "Tech Club",
    "Photography Club",
    "Debate Club",
    "Music Club",
    "Sports Club",
    "Literary Club",
    "Art Club",
    "Robotics Club",
    "Entrepreneurship Club",
  ];

  const faculties = [
    "Engineering",
    "Science",
    "Arts",
    "Commerce",
    "Medicine",
    "Law",
  ];

  // Auth guard and fetch existing application
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      navigate("/login");
      return;
    }

    try {
      const u = JSON.parse(userStr);
      if (u.role !== "STUDENT") {
        navigate("/");
        return;
      }
      setUser(u);

      // Fetch existing application status
      governanceAPI
        .getApplicationStatus()
        .then((data) => {
          if (data.success && data.hasApplication) {
            setHasExistingApplication(true);
            setExistingApplication(data.application);
          }
        })
        .catch((err) =>
          console.error("Error fetching application status:", err),
        );
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.presidentName ||
      !formData.candidateId ||
      !formData.clubOrFacultyName ||
      !formData.currentQualification ||
      !formData.email
    ) {
      setMessage("Please fill in all fields");
      setMessageType("error");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage("Please enter a valid email address");
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      const response = await governanceAPI.applyForPresident(formData);

      if (response.success) {
        setMessage(
          `✅ Application submitted successfully! A notification will be sent to you once the admin reviews your application.`,
        );
        setMessageType("success");

        // Reset form
        setFormData({
          presidentName: "",
          candidateId: "",
          clubOrFacultyType: "CLUB",
          clubOrFacultyName: "",
          currentQualification: "",
          email: "",
        });

        // Refresh application status
        setTimeout(() => {
          governanceAPI
            .getApplicationStatus()
            .then((data) => {
              if (data.success && data.hasApplication) {
                setHasExistingApplication(true);
                setExistingApplication(data.application);
              }
            })
            .catch((err) =>
              console.error("Error fetching application status:", err),
            );
        }, 1000);
      } else {
        setMessage(
          response.message || "Failed to submit application. Please try again.",
        );
        setMessageType("error");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setMessage("An error occurred. Please try again later.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="prf-loading">Loading...</div>;
  }

  return (
    <div className="prf-container">
      <Sidebar />
      <div className="prf-content">
        <div className="prf-header">
          <h1>🎓 President Registration</h1>
          <p className="prf-subtitle">
            Apply to become a Club or Faculty President
          </p>
        </div>

        {hasExistingApplication && existingApplication && (
          <div
            className={`prf-status-card prf-status-${existingApplication.status.toLowerCase()}`}
          >
            <div className="prf-status-header">
              <span className="prf-status-badge">
                {existingApplication.status}
              </span>
              <h3>Your Application Status</h3>
            </div>
            <div className="prf-status-details">
              <p>
                <strong>Position:</strong> {existingApplication.presidentName}
              </p>
              <p>
                <strong>
                  {existingApplication.status === "APPROVED"
                    ? "Club/Faculty"
                    : "Applying for"}
                  :
                </strong>{" "}
                {existingApplication.clubOrFacultyName}
              </p>
              <p>
                <strong>Applied on:</strong>{" "}
                {new Date(existingApplication.appliedAt).toLocaleDateString()}
              </p>
              {existingApplication.approvedRejectAt && (
                <p>
                  <strong>Reviewed on:</strong>{" "}
                  {new Date(
                    existingApplication.approvedRejectAt,
                  ).toLocaleDateString()}
                </p>
              )}
              {existingApplication.status === "REJECTED" &&
                existingApplication.rejectionReason && (
                  <p className="prf-rejection-reason">
                    <strong>Reason:</strong>{" "}
                    {existingApplication.rejectionReason}
                  </p>
                )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="prf-form">
          <div className="prf-form-section">
            <h3>📋 Personal Information</h3>

            <div className="prf-form-group">
              <label htmlFor="presidentName">President Name *</label>
              <input
                type="text"
                id="presidentName"
                name="presidentName"
                value={formData.presidentName}
                onChange={handleChange}
                placeholder="Enter president name"
                required
              />
            </div>

            <div className="prf-form-group">
              <label htmlFor="candidateId">President ID/Candidate ID *</label>
              <input
                type="text"
                id="candidateId"
                name="candidateId"
                value={formData.candidateId}
                onChange={handleChange}
                placeholder="e.g., PRES-2024-001"
                required
              />
            </div>

            <div className="prf-form-group">
              <label htmlFor="currentQualification">
                Current Qualification/Position *
              </label>
              <input
                type="text"
                id="currentQualification"
                name="currentQualification"
                value={formData.currentQualification}
                onChange={handleChange}
                placeholder="e.g., Senior Student, Club Vice President"
                required
              />
            </div>
          </div>

          <div className="prf-form-section">
            <h3>🏛️ Club/Faculty Selection</h3>

            <div className="prf-form-group">
              <label htmlFor="clubOrFacultyType">Position Type *</label>
              <select
                id="clubOrFacultyType"
                name="clubOrFacultyType"
                value={formData.clubOrFacultyType}
                onChange={handleChange}
                required
              >
                <option value="CLUB">Club President</option>
                <option value="FACULTY">Faculty President</option>
              </select>
            </div>

            <div className="prf-form-group">
              <label htmlFor="clubOrFacultyName">
                {formData.clubOrFacultyType === "CLUB"
                  ? "Select Club"
                  : "Select Faculty"}{" "}
                *
              </label>
              <select
                id="clubOrFacultyName"
                name="clubOrFacultyName"
                value={formData.clubOrFacultyName}
                onChange={handleChange}
                required
              >
                <option value="">
                  {formData.clubOrFacultyType === "CLUB"
                    ? "Choose a club"
                    : "Choose a faculty"}
                </option>
                {(formData.clubOrFacultyType === "CLUB"
                  ? clubs
                  : faculties
                ).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="prf-form-section">
            <h3>📧 President Account Email</h3>

            <div className="prf-form-group">
              <label htmlFor="email">President Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email for president account (will be used for login)"
                required
              />
              <small className="prf-email-hint">
                This email will be used to create your president account. You'll
                receive an auto-generated password after approval.
              </small>
            </div>
          </div>

          {message && (
            <div className={`prf-message prf-message-${messageType}`}>
              {message}
            </div>
          )}

          <div className="prf-form-actions">
            <button type="submit" disabled={loading} className="prf-submit-btn">
              {loading ? "Submitting..." : "Submit Application"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/student-dashboard")}
              className="prf-cancel-btn"
            >
              Go Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PresidentRegistrationForm;
