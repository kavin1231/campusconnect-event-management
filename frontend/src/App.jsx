import { Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Landing from "./components/home/Landing";
import StudentProfile from "./components/profile/StudentProfile";
import StudentDashboard from "./components/dashboard/StudentDashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";

// Governance Components
import {
  GovernanceDashboard,
  ClubOnboarding,
  EventApproval,
  PresidentApplicationManagement,
} from "./components/governance";

// Logistics Components
import {
  LogisticsDashboard,
  AssetManagement,
  ResourceRequest,
  ResourceAvailabilityEngine,
  CheckoutReturnTracking,
} from "./components/logistics";

import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Routes>
        {/* Auth & Landing */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Profile & Dashboards */}
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Governance Routes */}
        <Route path="/governance" element={<GovernanceDashboard />} />
        <Route path="/governance/dashboard" element={<GovernanceDashboard />} />
        <Route
          path="/governance/club-onboarding"
          element={<ClubOnboarding />}
        />
        <Route path="/governance/event-approval" element={<EventApproval />} />
        <Route
          path="/governance/president-applications"
          element={<PresidentApplicationManagement />}
        />

        {/* Logistics Routes */}
        <Route path="/logistics" element={<LogisticsDashboard />} />
        <Route path="/logistics/dashboard" element={<LogisticsDashboard />} />
        <Route path="/logistics/assets" element={<AssetManagement />} />
        <Route path="/logistics/requests" element={<ResourceRequest />} />
        <Route
          path="/logistics/availability"
          element={<ResourceAvailabilityEngine />}
        />
        <Route
          path="/logistics/checkout"
          element={<CheckoutReturnTracking />}
        />
      </Routes>
    </div>
  );
}

export default App;
