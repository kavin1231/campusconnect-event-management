import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import "./Sidebar.css";
import {
  Award,
  Bell,
  BookOpen,
  Boxes,
  Brain,
  Building2,
  CalendarDays,
  ChevronDown,
  Home,
  LayoutDashboard,
  Link2,
  LogOut,
  Menu,
  PieChart,
  PanelLeftClose,
  PanelLeftOpen,
  Package,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  ShieldAlert,
  ShoppingBag,
  FileText,
  MapPin,
  Trophy,
  UserRound,
  Users,
  Wrench,
  X,
} from "lucide-react";
import LogoutConfirmationModal from "./LogoutConfirmationModal";
import { authAPI } from "../../services/api";
import ThemeToggle from "./ThemeToggle";

const Sidebar = ({ activePage, isAdmin = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUserState] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}"),
  );
  const role = user?.role;
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const refreshProfile = async () => {
      try {
        const response = await authAPI.getProfile();
        if (response.success && response.profile) {
          localStorage.setItem("user", JSON.stringify(response.profile));
          setUserState(response.profile);
        }
      } catch (err) {
        console.error("Failed to refresh profile:", err);
      }
    };
    refreshProfile();
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setProfileOpen(false);
  };

  const handleLogoutConfirm = () => {
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

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname, location.search]);

  const showStaffMenu =
    isAdmin || role === "SYSTEM_ADMIN" || role === "EVENT_ORGANIZER";

  const adminMenuItems = [
    {
      id: "governance",
      label: "Governance",
      icon: "⚖️",
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
          icon: "🤝",
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
          id: "vendor-management",
          label: "Vendor Management",
          path: "/governance/vendors",
          icon: "🏪",
        },
        {
          id: "sponsorship-management",
          label: "Sponsorship Management",
          path: "/governance/sponsorships",
          icon: "🤝",
        },
        {
          id: "stall-allocation",
          label: "Stall Allocation",
          path: "/governance/stalls",
          icon: "📍",
        },
        {
          id: "president-finance-dashboard",
          label: "Finance Dashboard",
          path: "/governance/finance",
          icon: "💹",
        },
        {
          id: "finance-entry-management",
          label: "Finance Entries",
          path: "/governance/finance/entries",
          icon: "🧾",
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
          path: "/logistics/admin",
          icon: "📊",
        },
        {
          id: "asset-management",
          label: "Asset Management",
          path: "/logistics/assets",
          icon: "🛠️",
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
          icon: "📝",
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
      id: "user-management",
      label: "User Management",
      path: "/admin/users",
      icon: "👥",
    },
    {
      id: "role-management",
      label: "Permissions & Roles",
      path: "/admin/roles",
      icon: "🛡️",
    },
    {
      id: "extracurricular",
      label: "Manage Social",
      path: "/admin/group-links",
      icon: "🏆",
    },
    {
      id: "study-support",
      label: "Study Support",
      path: "/admin/study-support",
      icon: "📚",
    },
  ];

  const organizerMenuItems = [
    {
      id: "event-management",
      label: "Event Management",
      icon: "🎉",
      badge: "NEW",
      subItems: [
        {
          id: "organizer-home",
          label: "Overview",
          path: "/organizer-dashboard",
          icon: "📊",
        },
        {
          id: "my-events",
          label: "My Events",
          path: "/my-events",
          icon: "📅",
        },
        {
          id: "create-events",
          label: "Request Permission",
          path: "/create-event",
          icon: "➕",
          badge: "NEW",
        },
        {
          id: "my-event-requests",
          label: "My Event Requests",
          path: "/my-event-requests",
          icon: "📋",
        },
        {
          id: "calendar-conflict",
          label: "Conflict Calendar",
          path: "/calendar",
          icon: "📅",
        },
        {
          id: "merch-orders",
          label: "Merch & Orders",
          path: "/merch-orders",
          icon: "🛍️",
        },
        {
          id: "venues-mgmt",
          label: "Venues",
          path: "/operations/stalls",
          icon: "📍",
        },
        {
          id: "my-requests",
          label: "My Requests",
          path: "/logistics/request",
          icon: "📄",
        },
        {
          id: "staffing-mgmt",
          label: "Staffing",
          path: "/operations",
          icon: "👥",
        },
      ],
    },
    {
      id: "organizer-logistics",
      label: "Logistics Hub",
      icon: "📦",
      subItems: [
        {
          id: "browse-resources",
          label: "Browse Resources",
          path: "/logistics/browse",
          icon: "🔍",
        },
        {
          id: "checkout-tracking",
          label: "Checkout Tracking",
          path: "/logistics/checkout",
          icon: "🔧",
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
      id: "organizer-operations",
      label: "Operations",
      icon: "⚙️",
      subItems: [
        {
          id: "ops-home",
          label: "Operations Dashboard",
          path: "/operations",
          icon: "📊",
        },
        {
          id: "ops-spon",
          label: "Sponsorship Pipeline",
          path: "/operations/sponsorships",
          icon: "🤝",
        },
        {
          id: "ops-vendors",
          label: "Vendor Management",
          path: "/operations/vendors",
          icon: "🏪",
        },
        {
          id: "ops-intel",
          label: "Intelligence Dashboard",
          path: "/operations/intelligence",
          icon: "🧠",
        },
      ],
    },
  ];

  const presidentMenuItems = [
    {
      id: "governance",
      label: "Governance",
      icon: "⚖️",
      subItems: [
        {
          id: "vendor-management",
          label: "Vendor Management",
          path: "/governance/vendors",
          icon: "🏪",
        },
        {
          id: "sponsorship-management",
          label: "Sponsorship Management",
          path: "/governance/sponsorships",
          icon: "🤝",
        },
        {
          id: "stall-allocation",
          label: "Stall Allocation",
          path: "/governance/stalls",
          icon: "📍",
        },
        {
          id: "president-finance-dashboard",
          label: "Finance Dashboard",
          path: "/governance/finance",
          icon: "💹",
        },
        {
          id: "finance-entry-management",
          label: "Finance Entries",
          path: "/governance/finance/entries",
          icon: "🧾",
        },
      ],
    },
  ];

  const studentMenuItems = [
    { id: "home", label: "Home", path: "/", icon: "🏠" },
    { id: "dashboard", label: "Dashboard", path: "/dashboard", icon: "📊" },
    {
      id: "explore-sports",
      label: "Social links",
      path: "/dashboard",
      icon: "🏆",
      query: "?filter=extracurricular",
    },
    {
      id: "study-materials",
      label: "Study Materials",
      path: "/dashboard",
      icon: "📖",
      query: "?filter=study",
    },
    {
      id: "merchandise",
      label: "Merchandise",
      path: "/dashboard",
      icon: "🛍️",
      query: "?filter=orders",
    },
    { id: "profile", label: "My Profile", path: "/profile", icon: "👤" },
  ];

  let menuItems;
  if (role === "EVENT_ORGANIZER") {
    menuItems = organizerMenuItems;
  } else if (role === "CLUB_PRESIDENT") {
    // If in Admin view (isAdmin), show president menu + back to student
    // If in Student view (!isAdmin), show student menu + president workspace
    if (isAdmin) {
      menuItems = [
        ...presidentMenuItems,
        {
          id: "switch-to-student",
          label: "Student View",
          path: "/dashboard",
          icon: "🏠",
        },
      ];
    } else {
      menuItems = [
        ...studentMenuItems,
        {
          id: "president-workspace",
          label: "President Workspace",
          path: "/admin-dashboard",
          icon: "🛡️",
        },
      ];
    }
  } else if (isAdmin || role === "SYSTEM_ADMIN") {
    menuItems = adminMenuItems;
  } else {
    menuItems = studentMenuItems;
  }

  useEffect(() => {
    if (!showStaffMenu) return;

    // Auto-expand operations for organizer if nothing is expanded
    if (role === "EVENT_ORGANIZER" && !expandedMenu) {
      setExpandedMenu("organizer-operations");
      return;
    }

    const activeSection = menuItems.find((section) =>
      section.subItems?.some((item) => item.path === location.pathname),
    );
    if (activeSection?.id) {
      setExpandedMenu(activeSection.id);
    }
  }, [showStaffMenu, location.pathname, menuItems, role]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getNavIcon = (id, isSection = false) => {
    const iconClass = "sd-lucide-icon";
    const iconMap = {
      home: <Home className={iconClass} />,
      dashboard: <LayoutDashboard className={iconClass} />,
      "my-events": <CalendarDays className={iconClass} />,
      "create-events": <Plus className={iconClass} />,
      "merch-orders": <ShoppingBag className={iconClass} />,
      merchandise: <ShoppingBag className={iconClass} />,
      "my-requests": <FileText className={iconClass} />,
      "venues-mgmt": <MapPin className={iconClass} />,
      "staffing-mgmt": <Users className={iconClass} />,
      "explore-sports": <Trophy className={iconClass} />,
      calendar: <CalendarDays className={iconClass} />,
      resources: <Package className={iconClass} />,
      "study-materials": <BookOpen className={iconClass} />,
      profile: <UserRound className={iconClass} />,
      governance: <ShieldCheck className={iconClass} />,
      logistics: <Boxes className={iconClass} />,
      analytics: <LayoutDashboard className={iconClass} />,
      "user-management": <Users className={iconClass} />,
      "all-users": <Users className={iconClass} />,
      "role-management": <ShieldCheck className={iconClass} />,
      "roles-list": <ShieldCheck className={iconClass} />,
      extracurricular: <Award className={iconClass} />,
      "group-links": <Link2 className={iconClass} />,
      "organizer-logistics": <Boxes className={iconClass} />,
      "hub-dashboard": <LayoutDashboard className={iconClass} />,
      "club-onboarding": <Building2 className={iconClass} />,
      "event-approvals": <CalendarDays className={iconClass} />,
      "vendor-management": <ShoppingBag className={iconClass} />,
      "sponsorship-management": <Award className={iconClass} />,
      "stall-allocation": <MapPin className={iconClass} />,
      "president-finance-dashboard": <PieChart className={iconClass} />,
      "finance-entry-management": <FileText className={iconClass} />,
      "president-management": <UserRound className={iconClass} />,
      "logistics-hub": <Boxes className={iconClass} />,
      "asset-management": <Package className={iconClass} />,
      "organizer-home": <LayoutDashboard className={iconClass} />,
      "browse-resources": <Search className={iconClass} />,
      "checkout-tracking": <Wrench className={iconClass} />,
      "availability-engine": <Settings className={iconClass} />,
      "ops-intel": <Brain className={iconClass} />,
      "president-workspace": (
        <ShieldAlert className={`${iconClass} text-emerald-400`} />
      ),
      "switch-to-student": <Home className={`${iconClass} text-primary`} />,
    };
    if (iconMap[id]) return iconMap[id];
    return isSection ? (
      <Boxes className={iconClass} />
    ) : (
      <LayoutDashboard className={iconClass} />
    );
  };

  const roleLabel = useMemo(() => {
    if (!role) return "USER";
    if (!isAdmin && role === "CLUB_PRESIDENT") return "STUDENT";
    if (isAdmin && role === "CLUB_PRESIDENT" && user?.entityName) {
      return `${user.entityName} President`;
    }
    return role.replaceAll("_", " ");
  }, [role, isAdmin, user?.entityName]);

  const dashboardPath = useMemo(() => {
    if (role === "SYSTEM_ADMIN" || role === "CLUB_PRESIDENT")
      return "/admin-dashboard";
    if (role === "EVENT_ORGANIZER") return "/organizer-dashboard";
    return "/dashboard";
  }, [role]);

  return (
    <>
      {isAdmin && (
        <header className="sd-topbar">
          <div className="sd-topbar-left">
            <button
              onClick={() => setCollapsed((prev) => !prev)}
              className="sd-collapse-btn"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              type="button"
            >
              {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="sd-menu-btn"
              aria-label="Toggle sidebar"
              type="button"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <Link to={dashboardPath} className="sd-brand">
              <div className="sd-brand-dot" />
              <span>NEXORA Workspace</span>
            </Link>
          </div>

          <div className="sd-topbar-right">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                className="sd-notify-btn"
                type="button"
                aria-label="Notifications"
              >
                <Bell size={16} />
                <span className="sd-notify-badge" />
              </button>
            </div>

            <div className="sd-user-menu" ref={profileRef}>
              <button
                type="button"
                className="sd-user-trigger"
                onClick={() => setProfileOpen((prev) => !prev)}
              >
                <div className="sd-side-avatar">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.name} />
                  ) : (
                    user.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
                <div className="sd-top-user-meta">
                  <span className="sd-side-user-name">
                    {user.name || "User"}
                  </span>
                  <span className="sd-side-user-role">{roleLabel}</span>
                </div>
                <ChevronDown size={16} className="sd-chev" />
              </button>

              {profileOpen && (
                <div className="sd-user-dropdown">
                  <Link className="sd-user-dropdown-link" to="/profile">
                    <UserRound size={15} />
                    Profile
                  </Link>
                  <button
                    className="sd-user-dropdown-link sd-user-logout"
                    onClick={handleLogoutClick}
                    type="button"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Mobile Toggle for Students (Topbar hidden) */}
      {role === "STUDENT" && (
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="sd-student-mobile-toggle"
          aria-label="Toggle sidebar"
          type="button"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {mobileOpen && (
        <div
          className="sd-mobile-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`sd-sidebar ${mobileOpen ? "sd-mobile-open" : ""} ${collapsed ? "sd-collapsed" : ""} ${!isAdmin ? "sd-student-theme" : ""}`}
      >
        {isAdmin && (
          <div className="sd-side-header">
            <div className="sd-logo-wrap">
              <div className="sd-logo-mark" />
              <div>
                <h2 className="sd-logo-title">Control Center</h2>
                <p className="sd-logo-subtitle">{roleLabel}</p>
              </div>
            </div>
          </div>
        )}

        <div className="sd-side-nav">
          {showStaffMenu ? (
            <>
              {menuItems.map((section) => (
                <div key={section.id}>
                  {section.subItems ? (
                    <>
                      <div className="sd-menu-item">
                        <button
                          onClick={() => {
                            setExpandedMenu(section.id);
                            if (section.subItems?.[0]?.path) {
                              navigate(section.subItems[0].path);
                            }
                          }}
                          className="sd-menu-item-left sd-menu-item-trigger"
                          type="button"
                          title={section.label}
                        >
                          <span className="sd-menu-icon">
                            {getNavIcon(section.id, true)}
                          </span>
                          <span className="sd-menu-label">{section.label}</span>
                        </button>
                        <div className="sd-menu-item-right">
                          {section.badge && (
                            <span className="sd-menu-badge">
                              {section.badge}
                            </span>
                          )}
                          <button
                            onClick={() => toggleMenu(section.id)}
                            className={`sd-menu-toggle ${expandedMenu === section.id ? "sd-expanded" : ""}`}
                            type="button"
                            aria-label={`Toggle ${section.label} menu`}
                          >
                            ▼
                          </button>
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
                            <span className="sd-submenu-icon">
                              {getNavIcon(item.id)}
                            </span>
                            <span>{item.label}</span>
                            {item.badge && (
                              <span className="sd-submenu-badge">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      to={section.path}
                      className={`sd-side-link ${isActive(section.path) ? "sd-side-active" : ""}`}
                      title={section.label}
                    >
                      <span className="sd-side-link-icon">
                        {getNavIcon(section.id, true)}
                      </span>
                      <span className="sd-side-link-label">{section.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </>
          ) : (
            <>
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.query ? `${item.path}${item.query}` : item.path}
                  className={`sd-side-link ${isActive(item.path, item.query) ? "sd-side-active" : ""}`}
                  title={item.label}
                >
                  <span className="sd-side-link-icon">
                    {getNavIcon(item.id)}
                  </span>
                  <span className="sd-side-link-label">{item.label}</span>
                </Link>
              ))}
            </>
          )}
        </div>

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
              <span className="sd-side-user-role">{roleLabel}</span>
            </div>
          </div>
          <button
            onClick={handleLogoutClick}
            className="sd-side-logout-btn"
            title="Sign Out"
            type="button"
          >
            <LogOut size={17} />
          </button>
        </div>
      </aside>

      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};

export default Sidebar;
