import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";
import { useState } from "react";

const Sidebar = ({ activePage, isAdmin = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [expandedMenu, setExpandedMenu] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path, query = "") => {
    const pathMatch = location.pathname === path;
    if (query) {
      return pathMatch && location.search === query;
    }
    // For items without a query (like Dashboard), they should only be active
    // if there's no filter query parameter currently in the URL.
    return pathMatch && !location.search.includes("filter=");
  };

  const toggleMenu = (menu) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  const adminMenuItems = [
    {
      id: "governance",
      label: "Governance",
      icon: "⚙️",
      badge: "5",
      subItems: [
        {
          id: "hub-dashboard",
          label: "Hub Dashboard",
          path: "/governance",
          icon: "📊",
        },
        {
          id: "club-onboarding",
          label: "Club Onboarding",
          path: "/governance/club-onboarding",
          icon: "🏢",
          badge: "3",
        },
        {
          id: "event-approvals",
          label: "Event Approvals",
          path: "/governance/event-approval",
          icon: "📅",
          badge: "12",
        },
        {
          id: "president-management",
          label: "President Management",
          path: "/governance/president-applications",
          icon: "👑",
        },
      ],
    },
    {
      id: "logistics",
      label: "Logistics",
      icon: "📦",
      badge: "3",
      subItems: [
        {
          id: "logistics-hub",
          label: "Logistics Hub",
          path: "/logistics",
          icon: "📊",
        },
        {
          id: "asset-management",
          label: "Asset Management",
          path: "/logistics/assets",
          icon: "🏷️",
        },
        {
          id: "resource-requests",
          label: "Resource Requests",
          path: "/logistics/requests",
          icon: "📋",
          badge: "5",
        },
        {
          id: "checkout-tracking",
          label: "Checkout Tracking",
          path: "/logistics/checkout",
          icon: "🔄",
          badge: "3",
        },
        {
          id: "availability-engine",
          label: "Availability Engine",
          path: "/logistics/availability",
          icon: "⚙️",
        },
      ],
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: "📈",
      subItems: [
        {
          id: "platform-overview",
          label: "Platform Overview",
          path: "/analytics/overview",
          icon: "📊",
        },
        {
          id: "usage-reports",
          label: "Usage Reports",
          path: "/analytics/reports",
          icon: "📑",
        },
        {
          id: "user-activity",
          label: "User Activity",
          path: "/analytics/activity",
          icon: "👥",
        },
      ],
    },
    {
      id: "operations",
      label: "Operations",
      icon: "🤝",
      badge: "6",
      subItems: [
        { label: "Operations Hub", path: "/operations", icon: "📊" },
        { label: "Org Profile", path: "/operations/profile", icon: "🎨" },
        { label: "Sponsorships", path: "/operations/sponsorships", icon: "💼" },
        { label: "Budget Tracking", path: "/operations/budgets", icon: "💰" },
        { label: "Vendor Partners", path: "/operations/vendors", icon: "🍕" },
        { label: "Stall Management", path: "/operations/stalls", icon: "🛒" },
        { label: "Intelligence", path: "/operations/intelligence", icon: "🧠" },
      ],
    },
  ];

  const studentMenuItems = [
    { id: "dashboard", label: "Dashboard", path: "/dashboard", icon: "📊" },
    { id: "my-events", label: "My Events", path: "/events", icon: "📅" },
    { id: "logistics", label: "Logistics", path: "/logistics", icon: "📦" },
    { id: "resources", label: "Resources", path: "/resources", icon: "📦" },
    {
      id: "study-materials",
      label: "Study Materials",
      path: "/dashboard",
      icon: "📚",
      query: "?filter=study",
    },
    { id: "profile", label: "My Profile", path: "/profile", icon: "👤" },
  ];

  const menuItems = isAdmin ? adminMenuItems : studentMenuItems;

  return (
    <aside className="sd-sidebar">
      {/* SIDEBAR HEADER */}

      {/* SIDEBAR NAVIGATION */}
      <div className="sd-side-nav">
        {isAdmin ? (
          // ADMIN MENU
          <>
            {menuItems.map((section) => (
              <div key={section.id}>
                <div
                  onClick={() => toggleMenu(section.id)}
                  className="sd-menu-item"
                >
                  <div className="sd-menu-item-left">
                    <span className="sd-menu-icon">{section.icon}</span>
                    <span className="sd-menu-label">{section.label}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {section.badge && (
                      <span className="sd-menu-badge">{section.badge}</span>
                    )}
                    <span
                      className={`sd-menu-toggle ${expandedMenu === section.id ? "sd-expanded" : ""}`}
                    >
                      ⌄
                    </span>
                  </div>
                </div>

                <div
                  className={`sd-submenu ${expandedMenu === section.id ? "sd-submenu-active" : ""}`}
                >
                  {section.subItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`sd-submenu-item ${isActive(item.path) ? "sd-active" : ""}`}
                    >
                      <span className="sd-submenu-icon">{item.icon}</span>
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="sd-submenu-badge">{item.badge}</span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          // STUDENT MENU
          <>
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={item.query ? `${item.path}${item.query}` : item.path}
                className={`sd-side-link ${isActive(item.path, item.query) ? "sd-side-active" : ""}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </>
        )}
      </div>

      {/* SIDEBAR FOOTER */}
      <div className="sd-side-footer">
        <div className="sd-side-user">
          <div className="sd-side-avatar">
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.name} />
            ) : (
              user.name?.charAt(0).toUpperCase() || "U"
            )}
          </div>
          <div className="sd-side-user-info">
            <span className="sd-side-user-name">{user.name}</span>
            <span className="sd-side-user-role">{user.role}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="sd-side-logout-btn"
          title="Sign Out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
