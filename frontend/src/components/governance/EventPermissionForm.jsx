import { useState } from "react";
import "./EventPermissionForm.css";

const CATEGORIES = ["TECH", "SPORTS", "ARTS", "MUSIC", "CULTURAL", "ACADEMIC", "OTHER"];

const initialForm = {
  title: "",
  description: "",
  eventDate: "",
  venue: "",
  expectedAttendees: "",
  budget: "",
  category: "",
  organizingClub: "",
  contactEmail: "",
};

const EventPermissionForm = ({ onSuccess, onCancel }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = "Event title is required.";
    if (!form.description.trim()) newErrors.description = "Description is required.";
    if (!form.eventDate) {
      newErrors.eventDate = "Event date is required.";
    } else if (new Date(form.eventDate) <= new Date()) {
      newErrors.eventDate = "Event date must be in the future.";
    }
    if (!form.venue.trim()) newErrors.venue = "Venue is required.";
    if (!form.expectedAttendees) {
      newErrors.expectedAttendees = "Expected attendees is required.";
    } else if (parseInt(form.expectedAttendees, 10) <= 0) {
      newErrors.expectedAttendees = "Must be greater than 0.";
    }
    if (form.budget === "") {
      newErrors.budget = "Budget is required.";
    } else if (parseFloat(form.budget) < 0) {
      newErrors.budget = "Budget cannot be negative.";
    }
    if (!form.category) newErrors.category = "Category is required.";
    if (!form.organizingClub.trim()) newErrors.organizingClub = "Organizing club is required.";
    if (!form.contactEmail.trim()) {
      newErrors.contactEmail = "Contact email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
      newErrors.contactEmail = "Enter a valid email address.";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/event-permissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          expectedAttendees: parseInt(form.expectedAttendees, 10),
          budget: parseFloat(form.budget),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setSubmitError(data.message || "Failed to submit request. Please try again.");
        return;
      }

      setSubmitted(true);
      if (onSuccess) onSuccess(data.request);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setErrors({});
    setSubmitError("");
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="epf-success-state">
        <div className="epf-success-icon">✅</div>
        <h2 className="epf-success-title">Request Submitted!</h2>
        <p className="epf-success-msg">
          Your event permission request has been submitted successfully and is pending review by
          an administrator.
        </p>
        <div className="epf-success-actions">
          <button className="epf-btn epf-btn-primary" onClick={handleReset}>
            Submit Another Request
          </button>
          {onCancel && (
            <button className="epf-btn epf-btn-secondary" onClick={onCancel}>
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="epf-wrapper">
      {/* Header */}
      <div className="epf-header">
        <div className="epf-header-icon">📋</div>
        <div>
          <h1 className="epf-header-title">Event Permission Request</h1>
          <p className="epf-header-subtitle">
            Submit a request to organise an official campus event
          </p>
        </div>
      </div>

      {/* Form */}
      <form className="epf-form" onSubmit={handleSubmit} noValidate>
        {submitError && (
          <div className="epf-alert epf-alert-error">
            <span className="epf-alert-icon">⚠️</span>
            {submitError}
          </div>
        )}

        {/* Row 1: Title */}
        <div className="epf-field epf-field-full">
          <label className="epf-label" htmlFor="title">
            Event Title <span className="epf-required">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className={`epf-input ${errors.title ? "epf-input-error" : ""}`}
            placeholder="e.g. Annual Tech Fest 2026"
            value={form.title}
            onChange={handleChange}
            maxLength={120}
          />
          {errors.title && <p className="epf-error-msg">{errors.title}</p>}
        </div>

        {/* Row 2: Description */}
        <div className="epf-field epf-field-full">
          <label className="epf-label" htmlFor="description">
            Description <span className="epf-required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            className={`epf-textarea ${errors.description ? "epf-input-error" : ""}`}
            placeholder="Describe the purpose, activities, and goals of this event..."
            value={form.description}
            onChange={handleChange}
            rows={4}
            maxLength={1000}
          />
          {errors.description && <p className="epf-error-msg">{errors.description}</p>}
        </div>

        {/* Row 3: Date + Venue */}
        <div className="epf-row">
          <div className="epf-field">
            <label className="epf-label" htmlFor="eventDate">
              Event Date &amp; Time <span className="epf-required">*</span>
            </label>
            <input
              id="eventDate"
              name="eventDate"
              type="datetime-local"
              className={`epf-input ${errors.eventDate ? "epf-input-error" : ""}`}
              value={form.eventDate}
              onChange={handleChange}
            />
            {errors.eventDate && <p className="epf-error-msg">{errors.eventDate}</p>}
          </div>

          <div className="epf-field">
            <label className="epf-label" htmlFor="venue">
              Venue <span className="epf-required">*</span>
            </label>
            <input
              id="venue"
              name="venue"
              type="text"
              className={`epf-input ${errors.venue ? "epf-input-error" : ""}`}
              placeholder="e.g. Main Auditorium"
              value={form.venue}
              onChange={handleChange}
              maxLength={120}
            />
            {errors.venue && <p className="epf-error-msg">{errors.venue}</p>}
          </div>
        </div>

        {/* Row 4: Attendees + Budget */}
        <div className="epf-row">
          <div className="epf-field">
            <label className="epf-label" htmlFor="expectedAttendees">
              Expected Attendees <span className="epf-required">*</span>
            </label>
            <input
              id="expectedAttendees"
              name="expectedAttendees"
              type="number"
              min="1"
              className={`epf-input ${errors.expectedAttendees ? "epf-input-error" : ""}`}
              placeholder="e.g. 250"
              value={form.expectedAttendees}
              onChange={handleChange}
            />
            {errors.expectedAttendees && (
              <p className="epf-error-msg">{errors.expectedAttendees}</p>
            )}
          </div>

          <div className="epf-field">
            <label className="epf-label" htmlFor="budget">
              Estimated Budget (₹) <span className="epf-required">*</span>
            </label>
            <input
              id="budget"
              name="budget"
              type="number"
              min="0"
              step="0.01"
              className={`epf-input ${errors.budget ? "epf-input-error" : ""}`}
              placeholder="e.g. 25000"
              value={form.budget}
              onChange={handleChange}
            />
            {errors.budget && <p className="epf-error-msg">{errors.budget}</p>}
          </div>
        </div>

        {/* Row 5: Category + Organising Club */}
        <div className="epf-row">
          <div className="epf-field">
            <label className="epf-label" htmlFor="category">
              Category <span className="epf-required">*</span>
            </label>
            <select
              id="category"
              name="category"
              className={`epf-select ${errors.category ? "epf-input-error" : ""}`}
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0) + cat.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            {errors.category && <p className="epf-error-msg">{errors.category}</p>}
          </div>

          <div className="epf-field">
            <label className="epf-label" htmlFor="organizingClub">
              Organizing Club / Department <span className="epf-required">*</span>
            </label>
            <input
              id="organizingClub"
              name="organizingClub"
              type="text"
              className={`epf-input ${errors.organizingClub ? "epf-input-error" : ""}`}
              placeholder="e.g. Tech Club"
              value={form.organizingClub}
              onChange={handleChange}
              maxLength={120}
            />
            {errors.organizingClub && (
              <p className="epf-error-msg">{errors.organizingClub}</p>
            )}
          </div>
        </div>

        {/* Row 6: Contact Email */}
        <div className="epf-field epf-field-full">
          <label className="epf-label" htmlFor="contactEmail">
            Contact Email <span className="epf-required">*</span>
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            className={`epf-input ${errors.contactEmail ? "epf-input-error" : ""}`}
            placeholder="e.g. techclub@university.edu"
            value={form.contactEmail}
            onChange={handleChange}
            maxLength={120}
          />
          {errors.contactEmail && <p className="epf-error-msg">{errors.contactEmail}</p>}
        </div>

        {/* Risk preview */}
        {form.expectedAttendees || form.budget ? (
          <div className="epf-risk-preview">
            <p className="epf-risk-title">📊 Risk Preview</p>
            <div className="epf-risk-items">
              {form.expectedAttendees && (
                <span
                  className={`epf-risk-badge ${
                    parseInt(form.expectedAttendees, 10) > 300
                      ? "epf-risk-high"
                      : "epf-risk-moderate"
                  }`}
                >
                  👥 Attendance:{" "}
                  {parseInt(form.expectedAttendees, 10) > 300 ? "High" : "Moderate"}
                </span>
              )}
              {form.budget && (
                <span
                  className={`epf-risk-badge ${
                    parseFloat(form.budget) > 40000 ? "epf-risk-high" : "epf-risk-moderate"
                  }`}
                >
                  💰 Budget: {parseFloat(form.budget) > 40000 ? "High" : "Moderate"}
                </span>
              )}
            </div>
          </div>
        ) : null}

        {/* Actions */}
        <div className="epf-actions">
          {onCancel && (
            <button
              type="button"
              className="epf-btn epf-btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          )}
          <button type="submit" className="epf-btn epf-btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="epf-spinner" /> Submitting…
              </>
            ) : (
              "Submit Permission Request"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventPermissionForm;
