import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import { governanceAPI } from "../../services/api";
import "./StudentNotifications.css";

const StudentNotifications = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedNotification, setExpandedNotification] = useState(null);
  const [copySuccess, setCopySuccess] = useState("");

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
      fetchNotifications();
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await governanceAPI.getStudentNotifications();
      if (data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const data = await governanceAPI.markNotificationRead(notificationId);
      if (data.success) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, isRead: true } : notif,
          ),
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleToggleNotification = (notificationId) => {
    if (expandedNotification === notificationId) {
      setExpandedNotification(null);
    } else {
      setExpandedNotification(notificationId);
      // Mark as read when expanded
      const notif = notifications.find((n) => n.id === notificationId);
      if (notif && !notif.isRead) {
        handleMarkAsRead(notificationId);
      }
    }
  };

  const handleCopyPassword = (password) => {
    navigator.clipboard.writeText(password);
    setCopySuccess("Password copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "PRESIDENT_APPROVED":
        return "✅";
      case "PRESIDENT_REJECTED":
        return "❌";
      case "PASSWORD_ALERT":
        return "🔐";
      default:
        return "📬";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "PRESIDENT_APPROVED":
        return "approved";
      case "PRESIDENT_REJECTED":
        return "rejected";
      case "PASSWORD_ALERT":
        return "alert";
      default:
        return "default";
    }
  };

  if (!user) {
    return <div className="sn-loading">Loading...</div>;
  }

  return (
    <div className="sn-container">
      <div className="sn-content">
        <div className="sn-header">
          <h1>🔔 My Notifications</h1>
          <p className="sn-subtitle">
            Stay updated on your president application status
          </p>
        </div>

        {loading ? (
          <div className="sn-loading-state">
            <div className="sn-spinner"></div>
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="sn-empty-state">
            <div className="sn-empty-icon">📭</div>
            <h3>No Notifications Yet</h3>
            <p>
              Your notifications will appear here. Start by applying for a
              president position!
            </p>
            <button
              onClick={() => navigate("/president-registration")}
              className="sn-cta-btn"
            >
              Apply for President →
            </button>
          </div>
        ) : (
          <div className="sn-notifications-list">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`sn-notification-card sn-card-${getNotificationColor(notification.type)} ${
                  !notification.isRead ? "sn-unread" : ""
                }`}
              >
                <div
                  className="sn-notification-header"
                  onClick={() => handleToggleNotification(notification.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="sn-notification-title-group">
                    <span className="sn-notification-icon">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="sn-title-info">
                      <h3 className="sn-notification-title">
                        {notification.title}
                      </h3>
                      <p className="sn-notification-time">
                        {new Date(notification.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="sn-notification-meta">
                    {!notification.isRead && (
                      <span className="sn-unread-badge">New</span>
                    )}
                    <span
                      className="sn-expand-icon"
                      style={{
                        transform:
                          expandedNotification === notification.id
                            ? "rotate(180deg)"
                            : "",
                      }}
                    >
                      ▾
                    </span>
                  </div>
                </div>

                {expandedNotification === notification.id && (
                  <div className="sn-notification-body">
                    <p className="sn-notification-message">
                      {notification.message}
                    </p>

                    {notification.data && (
                      <div className="sn-notification-data">
                        {(() => {
                          try {
                            const data = JSON.parse(notification.data);

                            if (data.autoGeneratedPassword) {
                              return (
                                <div className="sn-password-section">
                                  <h4>🔐 Login Credentials</h4>
                                  <div className="sn-credentials">
                                    <p>
                                      <strong>Email:</strong>{" "}
                                      <code>{data.presidentEmail}</code>
                                    </p>
                                    <p>
                                      <strong>Auto-Generated Password:</strong>
                                      <div className="sn-password-display">
                                        <code>
                                          {data.autoGeneratedPassword}
                                        </code>
                                        <button
                                          className="sn-copy-btn"
                                          onClick={() =>
                                            handleCopyPassword(
                                              data.autoGeneratedPassword,
                                            )
                                          }
                                        >
                                          📋
                                        </button>
                                      </div>
                                    </p>
                                  </div>
                                  <p className="sn-copy-success">
                                    {copySuccess}
                                  </p>
                                  <p className="sn-note">{data.note}</p>
                                  <button
                                    onClick={() => navigate("/login")}
                                    className="sn-login-btn"
                                  >
                                    Go to Login →
                                  </button>
                                </div>
                              );
                            }

                            if (data.reason) {
                              return (
                                <div className="sn-rejection-section">
                                  <h4>ℹ️ Reason for Rejection</h4>
                                  <p className="sn-rejection-reason">
                                    {data.reason}
                                  </p>
                                  <p className="sn-rejection-note">
                                    {data.note}
                                  </p>
                                </div>
                              );
                            }

                            return null;
                          } catch (e) {
                            console.error(
                              "Error parsing notification data:",
                              e,
                            );
                            return null;
                          }
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentNotifications;
