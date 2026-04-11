import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Landing from "./components/home/Landing";
import EventDetail from "./components/events/EventDetail";
import StudentProfile from "./components/profile/StudentProfile";
import StudentDashboard from "./components/dashboard/StudentDashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import OrganizerDashboard from "./components/dashboard/OrganizerDashboard";
import MyEventsPage from "./components/dashboard/MyEventsPage";
import PendingEventPage from "./components/dashboard/PendingEventPage";
import EventSetupPage from "./components/dashboard/EventSetupPage";
import PublishedEventPage from "./components/dashboard/PublishedEventPage";
import MerchandiseOrdersPage from "./components/dashboard/MerchandiseOrdersPage";
import CreateEventsApp from "./components/CreateEvents";
import EventRequestFormPage from "./pages/EventRequestFormPage";
import { CalendarPage } from "./pages/CalendarPage";
import StudyMaterials from "./components/study/StudyMaterials";
import StudySupportAdmin from "./components/admin/StudySupportAdmin";
import RoleManagement from "./components/admin/RoleManagement";
import UserManagement from "./components/admin/UserManagement";
import StudentManagement from "./components/admin/StudentManagement";
import GroupLinksManagement from "./components/admin/GroupLinksManagement";
import SportsManagement from "./components/admin/SportsManagement";
import SportsList from "./components/sports/SportsList";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Unauthorized from "./components/common/Unauthorized";
import {
  GovernanceDashboard,
  ClubOnboarding,
  EventApproval,
  PresidentApplicationManagement,
  PresidentRegistrationForm,
  PresidentFinanceDashboard,
  FinanceEntryManagement,
  StudentNotifications,
  VendorManagement as GovernanceVendorManagement,
  StallAllocation,
  SponsorshipManagement,
} from "./components/governance";
import {
  LogisticsDashboard,
  AssetManagement,
  BrowseResources,
  ResourceRequest,
  ResourceAvailabilityEngine,
  CheckoutReturnTracking,
} from "./components/logistics";
import {
  OperationsDashboard,
  OrganizationProfile,
  SponsorshipPipeline,
  BudgetTracking,
  VendorManagement,
  StallManagement,
  IntelligenceDashboard,
} from "./components/operations";
import {
  AnalyticsOverview,
  AnalyticsReports,
  AnalyticsActivity,
} from "./components/analytics";
import { ClubsModule } from "./pages/ClubsModule";
import "./App.css";

function LogisticsEntry() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userDataStr = localStorage.getItem("user");

    if (!token || !userDataStr) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const user = JSON.parse(userDataStr);
      const role = user?.role?.toUpperCase();

      if (role === "SYSTEM_ADMIN" || role === "CLUB_PRESIDENT") {
        navigate("/logistics/admin", { replace: true });
        return;
      }

      navigate("/logistics/browse", { replace: true });
    } catch {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return null;
}

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/event/:eventId" element={<EventDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

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
              allowedRoles={["STUDENT", "CLUB_PRESIDENT"]}
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
          path="/my-events/:id/merchandise"
          element={
            <ProtectedRoute
              element={MerchandiseOrdersPage}
              allowedRoles={["STUDENT", "EVENT_ORGANIZER", "CLUB_PRESIDENT"]}
            />
          }
        />
        <Route
          path="/merch-orders"
          element={
            <ProtectedRoute
              element={MerchandiseOrdersPage}
              allowedRoles={["EVENT_ORGANIZER", "SYSTEM_ADMIN"]}
            />
          }
        />
        <Route
          path="/create-event"
          element={
            <ProtectedRoute
              element={() => (
                <EventRequestFormPage onBack={() => window.history.back()} />
              )}
              allowedRoles={["STUDENT", "EVENT_ORGANIZER", "CLUB_PRESIDENT"]}
            />
          }
        />
        <Route
          path="/create-events"
          element={
            <ProtectedRoute
              element={CreateEventsApp}
              allowedRoles={[
                "STUDENT",
                "EVENT_ORGANIZER",
                "CLUB_PRESIDENT",
                "SYSTEM_ADMIN",
              ]}
            />
          }
        />
        <Route path="/create-events-preview" element={<CreateEventsApp />} />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute
              element={() => <CalendarPage onBack={() => window.history.back()} />}
              allowedRoles={[
                "STUDENT",
                "EVENT_ORGANIZER",
                "CLUB_PRESIDENT",
                "SYSTEM_ADMIN",
              ]}
            />
          }
        />

        <Route
          path="/explore-sports"
          element={
            <ProtectedRoute
              element={SportsList}
              allowedRoles={["STUDENT", "SYSTEM_ADMIN", "CLUB_PRESIDENT"]}
            />
          }
        />
        <Route
          path="/study/materials"
          element={
            <ProtectedRoute
              element={StudyMaterials}
              allowedRoles={["STUDENT", "SYSTEM_ADMIN", "CLUB_PRESIDENT"]}
            />
          }
        />

        <Route
          path="/admin/sports"
          element={
            <ProtectedRoute element={SportsManagement} allowedRoles={["SYSTEM_ADMIN"]} />
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute element={StudentManagement} allowedRoles={["SYSTEM_ADMIN"]} />
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute element={UserManagement} allowedRoles={["SYSTEM_ADMIN"]} />
          }
        />
        <Route
          path="/admin/group-links"
          element={
            <ProtectedRoute
              element={GroupLinksManagement}
              allowedRoles={["SYSTEM_ADMIN"]}
            />
          }
        />
        <Route
          path="/admin/roles"
          element={
            <ProtectedRoute element={RoleManagement} allowedRoles={["SYSTEM_ADMIN"]} />
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute
              element={UserManagement}
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
          path="/governance/vendors"
          element={
            <ProtectedRoute
              element={GovernanceVendorManagement}
              allowedRoles={["SYSTEM_ADMIN", "CLUB_PRESIDENT"]}
            />
          }
        />
        <Route
          path="/governance/sponsorships"
          element={
            <ProtectedRoute
              element={SponsorshipManagement}
              allowedRoles={["SYSTEM_ADMIN", "CLUB_PRESIDENT"]}
            />
          }
        />
        <Route
          path="/governance/stalls"
          element={
            <ProtectedRoute
              element={StallAllocation}
              allowedRoles={["SYSTEM_ADMIN", "CLUB_PRESIDENT"]}
            />
          }
        />
        <Route
          path="/governance/finance"
          element={
            <ProtectedRoute
              element={PresidentFinanceDashboard}
              allowedRoles={["SYSTEM_ADMIN", "CLUB_PRESIDENT"]}
            />
          }
        />
        <Route
          path="/governance/finance/entries"
          element={
            <ProtectedRoute
              element={FinanceEntryManagement}
              allowedRoles={["SYSTEM_ADMIN", "CLUB_PRESIDENT"]}
            />
          }
        />
        <Route
          path="/governance/club-onboarding"
          element={
            <ProtectedRoute
              element={ClubOnboarding}
              allowedRoles={["SYSTEM_ADMIN", "CLUB_PRESIDENT"]}
            />
          }
        />
        <Route
          path="/governance/event-approval"
          element={
            <ProtectedRoute
              element={EventApproval}
              allowedRoles={["SYSTEM_ADMIN", "CLUB_PRESIDENT"]}
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
          path="/governance/president-registration"
          element={
            <ProtectedRoute
              element={PresidentRegistrationForm}
              allowedRoles={["CLUB_PRESIDENT"]}
            />
          }
        />
        <Route
          path="/governance/notifications"
          element={
            <ProtectedRoute
              element={StudentNotifications}
              allowedRoles={["STUDENT", "SYSTEM_ADMIN"]}
            />
          }
        />

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
          path="/operations/organizations"
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

        <Route
          path="/logistics"
          element={<LogisticsEntry />}
        />
        <Route
          path="/logistics/admin"
          element={
            <ProtectedRoute
              element={LogisticsDashboard}
              allowedRoles={["SYSTEM_ADMIN", "CLUB_PRESIDENT"]}
            />
          }
        />
        <Route
          path="/logistics/assets"
          element={
            <ProtectedRoute
              element={AssetManagement}
              allowedRoles={["SYSTEM_ADMIN", "CLUB_PRESIDENT"]}
            />
          }
        />
        <Route
          path="/logistics/browse"
          element={
            <ProtectedRoute
              element={BrowseResources}
              allowedRoles={["STUDENT", "EVENT_ORGANIZER", "CLUB_PRESIDENT"]}
            />
          }
        />
        <Route
          path="/logistics/request"
          element={
            <ProtectedRoute
              element={ResourceRequest}
              allowedRoles={["STUDENT", "EVENT_ORGANIZER", "CLUB_PRESIDENT"]}
            />
          }
        />
        <Route
          path="/logistics/availability"
          element={
            <ProtectedRoute
              element={ResourceAvailabilityEngine}
              allowedRoles={["STUDENT", "EVENT_ORGANIZER", "CLUB_PRESIDENT"]}
            />
          }
        />
        <Route
          path="/logistics/checkout-return"
          element={
            <ProtectedRoute
              element={CheckoutReturnTracking}
              allowedRoles={["SYSTEM_ADMIN", "CLUB_PRESIDENT"]}
            />
          }
        />
        <Route
          path="/logistics/checkout"
          element={
            <ProtectedRoute
              element={CheckoutReturnTracking}
              allowedRoles={[
                "EVENT_ORGANIZER",
                "SYSTEM_ADMIN",
                "CLUB_PRESIDENT",
              ]}
            />
          }
        />

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
        <Route
          path="/clubs"
          element={<ClubsModule />}
        />
      </Routes>
    </div>
  );
}

export default App;
