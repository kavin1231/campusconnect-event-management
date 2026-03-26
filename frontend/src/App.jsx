import { Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Landing from './components/home/Landing';
import StudentProfile from './components/profile/StudentProfile';
import StudentDashboard from './components/dashboard/StudentDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import OrganizerDashboard from './components/dashboard/OrganizerDashboard_v2';
import MyEventsPage from './components/dashboard/MyEventsPage';
import PendingEventPage from './components/dashboard/PendingEventPage';
import EventSetupPage from './components/dashboard/EventSetupPage';
import PublishedEventPage from './components/dashboard/PublishedEventPage';
import MerchandiseOrdersPage from './components/dashboard/MerchandiseOrdersPage';
import EventRequestFormPage from './pages/EventRequestFormPage';
import { CalendarPage } from './pages/CalendarPage';
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
        <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
        <Route path="/my-events" element={<MyEventsPage />} />
        <Route path="/my-events/:id/pending" element={<PendingEventPage />} />
        <Route path="/my-events/:id/setup" element={<EventSetupPage />} />
        <Route path="/my-events/:id/published" element={<PublishedEventPage />} />
        <Route path="/my-events/:id/merchandise" element={<MerchandiseOrdersPage />} />
        <Route path="/create-event" element={<EventRequestFormPage onBack={() => window.history.back()} />} />
        <Route path="/calendar" element={<CalendarPage onBack={() => window.history.back()} />} />
      </Routes>
    </div>
  );
}

export default App;
