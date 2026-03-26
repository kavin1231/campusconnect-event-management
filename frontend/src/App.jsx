import { Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Landing from "./components/home/Landing";
import EventDetail from "./components/events/EventDetail";
import StudentProfile from "./components/profile/StudentProfile";
import StudentDashboard from "./components/dashboard/StudentDashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import OrganizerDashboard from "./components/dashboard/OrganizerDashboard";
import StudyMaterials from "./components/study/StudyMaterials";
import StudySupportAdmin from "./components/admin/StudySupportAdmin";
import RoleManagement from "./components/admin/RoleManagement";
import StudentManagement from "./components/admin/StudentManagement";
import SportsManagement from "./components/admin/SportsManagement";
import SportsList from "./components/sports/SportsList";
import Sidebar from "./components/common/Sidebar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Unauthorized from "./components/common/Unauthorized";

// Placeholder for Analytics
const AnalyticsPlaceholder = ({ title }) => (
  <div className="sd-layout">
    <Sidebar activePage="analytics" isAdmin={true} />
    <div className="sd-content-wrapper">
      <div style={{ padding: "30px", color: "#fff" }}>
        <h1>📈 {title}</h1>
        <p>This module is currently under development. Stay tuned for advanced insights!</p>
      </div>
    </div>
  </div>
);

// Governance Components
import {
  GovernanceDashboard,
  ClubOnboarding,
  EventApproval,
  PresidentApplicationManagement,
  PresidentRegistrationForm,
  StudentNotifications,
} from "./components/governance";

// Logistics Components
import {
  LogisticsDashboard,
  AssetManagement,
  ResourceRequest,
  ResourceAvailabilityEngine,
  CheckoutReturnTracking,
} from "./components/logistics";

// Operations Components
import {
  OperationsDashboard,
  OrganizationProfile,
  SponsorshipPipeline,
  BudgetTracking,
  VendorManagement,
  StallManagement,
  IntelligenceDashboard,
} from "./components/operations";

// Analytics Components
import {
  AnalyticsOverview,
  AnalyticsReports,
  AnalyticsActivity,
} from "./components/analytics";

import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Routes>
        {/* Auth & Landing */}
        <Route path="/" element={<Landing />} />
        <Route path="/event/:eventId" element={<EventDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Profile & Dashboards */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              element={StudentProfile}
              allowedRoles={[
                "STUDENT",
                "SYSTEM_ADMIN",
                "EVENT_ORGANIZER",
                "CLUB_PRESIDENT",
              ]}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              element={StudentDashboard}
              allowedRoles={["STUDENT"]}
            />
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute
              element={AdminDashboard}
              allowedRoles={["SYSTEM_ADMIN", "CLUB_PRESIDENT"]}
            />
          }
        />

        <Route
          path="/organizer-dashboard"
          element={
            <ProtectedRoute
              element={OrganizerDashboard}
              allowedRoles={["EVENT_ORGANIZER"]}
            />
          }
        />

        {/* Study Support Routes */}
        {/* Study Support Routes */}
        <Route
          path="/study-materials"
          element={
            <ProtectedRoute
              element={StudyMaterials}
              allowedRoles={["STUDENT", "SYSTEM_ADMIN", "EVENT_ORGANIZER", "CLUB_PRESIDENT"]}
            />
          }
        />
        <Route
          path="/admin/study-support"
          element={
            <ProtectedRoute
              element={StudySupportAdmin}
              allowedRoles={["SYSTEM_ADMIN"]}
            />
          }
        />
        <Route
          path="/admin/roles"
          element={
            <ProtectedRoute
              element={RoleManagement}
              allowedRoles={["SYSTEM_ADMIN"]}
            />
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute
              element={StudentManagement}
              allowedRoles={["SYSTEM_ADMIN"]}
            />
          }
        />
        <Route
          path="/admin/sports"
          element={
            <ProtectedRoute
              element={SportsManagement}
              allowedRoles={["SYSTEM_ADMIN"]}
            />
          }
        />
        <Route
          path="/sports"
          element={
            <ProtectedRoute
              element={SportsList}
              allowedRoles={["STUDENT", "SYSTEM_ADMIN", "EVENT_ORGANIZER", "CLUB_PRESIDENT"]}
            />
          }
        />

        {/* Governance Routes */}
        <Route
          path="/governance"
          element={
            <ProtectedRoute
              element={GovernanceDashboard}
              allowedRoles={["SYSTEM_ADMIN", "CLUB_PRESIDENT"]}
            />
          }
        />
        <Route
          path="/governance/dashboard"
          element={
            <ProtectedRoute
              element={GovernanceDashboard}
              allowedRoles={["SYSTEM_ADMIN", "CLUB_PRESIDENT"]}
            />
          }
        />
        <Route
          path="/governance/club-onboarding"
          element={
            <ProtectedRoute
              element={ClubOnboarding}
              allowedRoles={["SYSTEM_ADMIN"]}
            />
          }
        />
        <Route
          path="/governance/event-approval"
          element={
            <ProtectedRoute
              element={EventApproval}
              allowedRoles={["SYSTEM_ADMIN"]}
            />
          }
        />
        <Route
          path="/governance/president-applications"
          element={
            <ProtectedRoute
              element={PresidentApplicationManagement}
              allowedRoles={["SYSTEM_ADMIN"]}
            />
          }
        />
        <Route
          path="/president-registration"
          element={
            <ProtectedRoute
              element={PresidentRegistrationForm}
              allowedRoles={["STUDENT"]}
            />
          }
        />
        <Route
          path="/student-notifications"
          element={
            <ProtectedRoute
              element={StudentNotifications}
              allowedRoles={["STUDENT"]}
            />
          }
        />

        {/* Logistics Routes */}
        <Route
          path="/logistics"
          element={
            <ProtectedRoute
              element={ResourceRequest}
              allowedRoles={["EVENT_ORGANIZER"]}
            />
          }
        />
        <Route
          path="/logistics/browse"
          element={
            <ProtectedRoute
              element={ResourceRequest}
              allowedRoles={["EVENT_ORGANIZER"]}
            />
          }
        />
        <Route
          path="/logistics/admin"
          element={
            <ProtectedRoute
              element={LogisticsDashboard}
              allowedRoles={["SYSTEM_ADMIN"]}
            />
          }
        />
        <Route
          path="/logistics/assets"
          element={
            <ProtectedRoute
              element={AssetManagement}
              allowedRoles={["SYSTEM_ADMIN", "EVENT_ORGANIZER"]}
            />
          }
        />
        <Route
          path="/logistics/requests"
          element={
            <ProtectedRoute
              element={ResourceRequest}
              allowedRoles={["EVENT_ORGANIZER"]}
            />
          }
        />
        <Route
          path="/logistics/availability"
          element={
            <ProtectedRoute
              element={ResourceAvailabilityEngine}
              allowedRoles={["EVENT_ORGANIZER"]}
            />
          }
        />
        <Route
          path="/logistics/checkout"
          element={
            <ProtectedRoute
              element={CheckoutReturnTracking}
              allowedRoles={["EVENT_ORGANIZER"]}
            />
          }
        />

        {/* Operations Routes */}
        <Route
          path="/operations"
          element={
            <ProtectedRoute
              element={OperationsDashboard}
              allowedRoles={["SYSTEM_ADMIN", "EVENT_ORGANIZER"]}
            />
          }
        />
        <Route
          path="/operations/dashboard"
          element={
            <ProtectedRoute
              element={OperationsDashboard}
              allowedRoles={["SYSTEM_ADMIN", "EVENT_ORGANIZER"]}
            />
          }
        />
        <Route
          path="/operations/profile"
          element={
            <ProtectedRoute
              element={OrganizationProfile}
              allowedRoles={["SYSTEM_ADMIN", "EVENT_ORGANIZER"]}
            />
          }
        />
        <Route
          path="/operations/sponsorships"
          element={
            <ProtectedRoute
              element={SponsorshipPipeline}
              allowedRoles={["SYSTEM_ADMIN", "EVENT_ORGANIZER"]}
            />
          }
        />
        <Route
          path="/operations/budgets"
          element={
            <ProtectedRoute
              element={BudgetTracking}
              allowedRoles={["SYSTEM_ADMIN", "EVENT_ORGANIZER"]}
            />
          }
        />
        <Route
          path="/operations/vendors"
          element={
            <ProtectedRoute
              element={VendorManagement}
              allowedRoles={["SYSTEM_ADMIN", "EVENT_ORGANIZER"]}
            />
          }
        />
        <Route
          path="/operations/stalls"
          element={
            <ProtectedRoute
              element={StallManagement}
              allowedRoles={["SYSTEM_ADMIN", "EVENT_ORGANIZER"]}
            />
          }
        />
        <Route
          path="/operations/intelligence"
          element={
            <ProtectedRoute
              element={IntelligenceDashboard}
              allowedRoles={["SYSTEM_ADMIN", "EVENT_ORGANIZER"]}
            />
          }
        />

        {/* Analytics Routes */}
        <Route
          path="/analytics/overview"
          element={
            <ProtectedRoute
              element={AnalyticsOverview}
              allowedRoles={["SYSTEM_ADMIN"]}
            />
          }
        />
        <Route
          path="/analytics/reports"
          element={
            <ProtectedRoute
              element={AnalyticsReports}
              allowedRoles={["SYSTEM_ADMIN"]}
            />
          }
        />
        <Route
          path="/analytics/activity"
          element={
            <ProtectedRoute
              element={AnalyticsActivity}
              allowedRoles={["SYSTEM_ADMIN"]}
            />
          }
        />

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>

    </div>
  );
}

export default App;
