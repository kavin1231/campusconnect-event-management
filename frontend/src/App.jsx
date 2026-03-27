import { Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Landing from "./components/home/Landing";
import EventDetail from "./components/events/EventDetail";
import StudentProfile from "./components/profile/StudentProfile";
import StudentDashboard from "./components/dashboard/StudentDashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import OrganizerDashboard from "./components/dashboard/OrganizerDashboard"; // Original OrganizerDashboard
import StudyMaterials from "./components/study/StudyMaterials";
import StudySupportAdmin from "./components/admin/StudySupportAdmin";
import RoleManagement from "./components/admin/RoleManagement";
import StudentManagement from "./components/admin/StudentManagement";
import SportsManagement from "./components/admin/SportsManagement";
import SportsList from "./components/sports/SportsList";
import Sidebar from "./components/common/Sidebar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Unauthorized from "./components/common/Unauthorized";

// Oshhim Branch Additions
import OrganizerDashboardV2 from "./components/dashboard/OrganizerDashboard_v2"; // New OrganizerDashboard
import MyEventsPage from "./components/dashboard/MyEventsPage";
import PendingEventPage from "./components/dashboard/PendingEventPage";
import EventSetupPage from "./components/dashboard/EventSetupPage";
import PublishedEventPage from "./components/dashboard/PublishedEventPage";
import EventRequestFormPage from "./pages/EventRequestFormPage";
import { CalendarPage } from "./pages/CalendarPage";

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

        {/* My Events & Event Management (Oshhim Branch) */}
        <Route
          path="/my-events"
          element={
            <ProtectedRoute
              element={MyEventsPage}
              allowedRoles={["STUDENT", "EVENT_ORGANIZER", "CLUB_PRESIDENT"]}
            />
          }
        />
        <Route
          path="/my-events/:id/pending"
          element={
            <ProtectedRoute
              element={PendingEventPage}
              allowedRoles={["STUDENT", "EVENT_ORGANIZER", "CLUB_PRESIDENT"]}
            />
          }
        />
        <Route
          path="/my-events/:id/setup"
          element={
            <ProtectedRoute
              element={EventSetupPage}
              allowedRoles={["STUDENT", "EVENT_ORGANIZER", "CLUB_PRESIDENT"]}
            />
          }
        />
        <Route
          path="/my-events/:id/published"
          element={
            <ProtectedRoute
              element={PublishedEventPage}
              allowedRoles={["STUDENT", "EVENT_ORGANIZER", "CLUB_PRESIDENT"]}
            />
          }
        />
        <Route
          path="/create-event"
          element={
            <ProtectedRoute
              element={() => <EventRequestFormPage onBack={() => window.history.back()} />}
              allowedRoles={["STUDENT", "EVENT_ORGANIZER", "CLUB_PRESIDENT"]}
            />
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute
              element={() => <CalendarPage onBack={() => window.history.back()} />}
              allowedRoles={["STUDENT", "EVENT_ORGANIZER", "CLUB_PRESIDENT", "SYSTEM_ADMIN"]}
            />
          }
        />
        <Route
          path="/explore-sports"
          element={
            <ProtectedRoute
              element={SportsList}
              allowedRoles={["STUDENT", "SYSTEM_ADMIN"]}
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
          path="/admin/students"
          element={
            <ProtectedRoute
              element={StudentManagement}
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
          path="/admin/study-support"
          element={
            <ProtectedRoute
              element={StudySupportAdmin}
              allowedRoles={["SYSTEM_ADMIN"]}
            />
          }
        />
      </Routes>

    </div>
  );
}

export default App;
