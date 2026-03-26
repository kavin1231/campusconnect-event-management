import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, FONT } from '../../constants/colors';
import { Navbar, NotificationPanel } from '../common/Navbar';
import Sidebar from '../common/Sidebar';

export default function OrganizerShell({ page = 'events', children }) {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);

  const onNavigate = (key) => {
    setNotifOpen(false);
    if (key === 'dashboard') return navigate('/organizer-dashboard');
    if (key === 'events') return navigate('/my-events');
    if (key === 'create') return navigate('/create-event');
    if (key === 'calendar') return navigate('/calendar');
    return navigate('/organizer-dashboard');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', fontFamily: FONT, background: C.neutral }}>
      <Navbar page={page} onNavigate={onNavigate} notifOpen={notifOpen} setNotifOpen={setNotifOpen} />
      <NotificationPanel open={notifOpen} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Sidebar page={page} onNavigate={onNavigate} />
        <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
      </div>
    </div>
  );
}
