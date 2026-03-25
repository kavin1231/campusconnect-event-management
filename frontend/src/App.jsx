import { Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Landing from './components/home/Landing';
import StudentProfile from './components/profile/StudentProfile';
import StudentDashboard from './components/dashboard/StudentDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import EventPermissionForm from './components/governance/EventPermissionForm';
import EventApproval from './components/governance/EventApproval';
import GovernanceDashboard from './components/governance/GovernanceDashboard';
import ClubOnboarding from './components/governance/ClubOnboarding';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/governance" element={<GovernanceDashboard />} />
        <Route path="/governance/club-onboarding" element={<ClubOnboarding />} />
        <Route path="/governance/event-approval" element={<EventApproval />} />
        <Route path="/governance/event-permission" element={<EventPermissionForm />} />
      </Routes>
    </div>
  );
}

export default App;
