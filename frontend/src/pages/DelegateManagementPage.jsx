import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { C, FONT } from '../constants/colors';
import { Icon } from '../components/common/Icon';
import OrganizerShell from '../components/dashboard/OrganizerShell';
import { useTheme } from '../context/ThemeContext';
import { eventRequestAPI, authAPI } from '../services/api';
import { FeedbackToast } from '../components/common/FeedbackUI';

function DelegateCard({ delegate, onRemove, palette }) {
  return (
    <div style={{ 
      background: palette.surface, 
      border: `1px solid ${palette.border}`, 
      borderRadius: '12px', 
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '50%', 
          background: C.primaryLight, 
          color: C.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: '700'
        }}>
          {delegate.delegateName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: palette.text }}>{delegate.delegateName}</h4>
          <p style={{ margin: 0, fontSize: '12px', color: palette.textMuted }}>{delegate.delegateEmail}</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ 
          fontSize: '10px', 
          fontWeight: '700', 
          padding: '4px 10px', 
          borderRadius: '100px', 
          background: palette.surfaceAlt, 
          color: C.primary,
          border: `1px solid ${palette.border}`,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {delegate.role}
        </span>
        <button 
          onClick={() => onRemove(delegate.id)}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#ef4444', 
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Icon.X size={18} />
        </button>
      </div>
    </div>
  );
}

export default function DelegateManagementPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  const [delegates, setDelegates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [eventTitle, setEventTitle] = useState('Event');

  // Form state
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('MANAGER');
  const [isAdding, setIsAdding] = useState(false);

  const palette = isDarkMode
    ? {
        pageBg: '#0B1324',
        surface: '#111A2E',
        surfaceAlt: '#0F172A',
        border: '#22304A',
        text: '#E2E8F0',
        textMuted: '#B6C2D4',
      }
    : {
        pageBg: C.neutral,
        surface: C.white,
        surfaceAlt: C.neutral,
        border: C.border,
        text: C.text,
        textMuted: C.textMuted,
      };

  const fetchDelegates = async () => {
    try {
      setLoading(true);
      const response = await eventRequestAPI.getDelegates(id);
      if (response.success) {
        setDelegates(response.delegates || []);
      }
    } catch (err) {
      console.error('Error fetching delegates:', err);
      setError('Failed to load delegates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await eventRequestAPI.getEventRequestById(id);
        if (response.success) {
          setEventTitle(response.data?.title || 'Event');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
      }
    };

    if (id) {
      fetchEventData();
      fetchDelegates();
    }
  }, [id]);

  const handleAddDelegate = async (e) => {
    e.preventDefault();
    if (!searchEmail) return;

    try {
      setIsAdding(true);
      
      // First, find the user by email
      const usersResponse = await authAPI.getAllUsers();
      const user = usersResponse.users?.find(u => u.email.toLowerCase() === searchEmail.toLowerCase());

      if (!user) {
        setToast({ message: 'User not found with this email.', type: 'error' });
        return;
      }

      const response = await eventRequestAPI.addDelegate(id, {
        delegateUserId: user.id,
        role: selectedRole,
        reason: 'Added by organizer'
      });

      if (response.success) {
        setToast({ message: 'Delegate added successfully!', type: 'success' });
        setSearchEmail('');
        fetchDelegates();
      } else {
        setToast({ message: response.message || 'Failed to add delegate.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'An error occurred.', type: 'error' });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveDelegate = async (delegateId) => {
    if (!window.confirm('Are you sure you want to remove this delegate?')) return;

    try {
      const response = await eventRequestAPI.removeDelegate(id, delegateId);
      if (response.success) {
        setToast({ message: 'Delegate removed.', type: 'success' });
        fetchDelegates();
      } else {
        setToast({ message: 'Failed to remove delegate.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'An error occurred.', type: 'error' });
    }
  };

  return (
    <OrganizerShell page="events">
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '32px 36px', 
        background: palette.pageBg, 
        fontFamily: FONT,
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <FeedbackToast toast={toast} onClose={() => setToast(null)} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <button 
              onClick={() => navigate(-1)} 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                color: C.primary, 
                fontSize: '13px', 
                fontWeight: '700',
                padding: 0,
                marginBottom: '8px'
              }}
            >
              <Icon.ArrowLeft size={16} /> Back to Event
            </button>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: palette.text }}>Manage Delegates</h1>
            <p style={{ margin: '4px 0 0', fontSize: '14px', color: palette.textMuted }}>Assign permissions to other users for <strong style={{ color: C.primary }}>{eventTitle}</strong></p>
          </div>
          <div style={{ 
            background: C.primaryLight, 
            padding: '10px 16px', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            border: `1px solid ${C.border}`
          }}>
            <Icon.Users size={20} color={C.primary} />
            <span style={{ fontSize: '18px', fontWeight: '800', color: C.primary }}>{delegates.length}</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: C.textMuted }}>Total Delegates</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Delegate List */}
          <div style={{ background: palette.surface, borderRadius: '16px', border: `1px solid ${palette.border}`, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Icon.Users size={18} color={C.primary} />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: palette.text }}>Current Delegates</h3>
            </div>

            {loading ? (
              <p style={{ color: palette.textMuted, fontSize: '14px' }}>Loading delegates...</p>
            ) : delegates.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', border: `2px dashed ${palette.border}`, borderRadius: '12px' }}>
                <p style={{ margin: '0 0 12px', fontSize: '14px', color: palette.textMuted }}>No delegates assigned yet.</p>
                <p style={{ margin: 0, fontSize: '12px', color: palette.textDim }}>Add a team member to help manage this event.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {delegates.map(d => (
                  <DelegateCard key={d.id} delegate={d} onRemove={handleRemoveDelegate} palette={palette} />
                ))}
              </div>
            )}
          </div>

          {/* Add Delegate Form */}
          <div style={{ background: palette.surface, borderRadius: '16px', border: `1px solid ${palette.border}`, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Icon.Plus size={18} color={C.primary} />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: palette.text }}>Add New Delegate</h3>
            </div>

            <form onSubmit={handleAddDelegate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: palette.textMuted, marginBottom: '6px', textTransform: 'uppercase' }}>User Email</label>
                <input 
                  type="email" 
                  placeholder="e.g. member@nexora.edu"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    borderRadius: '10px', 
                    background: palette.surfaceAlt, 
                    border: `1px solid ${palette.border}`, 
                    color: palette.text,
                    fontFamily: FONT,
                    fontSize: '14px'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: palette.textMuted, marginBottom: '6px', textTransform: 'uppercase' }}>Assign Role</label>
                <select 
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    borderRadius: '10px', 
                    background: palette.surfaceAlt, 
                    border: `1px solid ${palette.border}`, 
                    color: palette.text,
                    fontFamily: FONT,
                    fontSize: '14px'
                  }}
                >
                  <option value="MANAGER">Manager (Full Access)</option>
                  <option value="CO_ORGANIZER">Co-Organizer</option>
                  <option value="LOGISTICS">Logistics Coordinator</option>
                  <option value="FINANCES">Finance Lead</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={isAdding}
                style={{ 
                  marginTop: '8px',
                  background: C.primary, 
                  color: C.white, 
                  border: 'none', 
                  borderRadius: '10px', 
                  padding: '14px', 
                  fontSize: '14px', 
                  fontWeight: '700', 
                  cursor: isAdding ? 'not-allowed' : 'pointer',
                  opacity: isAdding ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isAdding ? 'Adding...' : <><Icon.Plus size={16} /> Add Delegate</>}
              </button>
            </form>

            <div style={{ marginTop: '24px', padding: '16px', background: isDarkMode ? 'rgba(5,54,104,.2)' : C.primaryLight, borderRadius: '12px', border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Icon.Info size={18} color={C.primary} />
                <p style={{ margin: 0, fontSize: '12px', color: palette.text, lineHeight: 1.6 }}>
                  Delegates will be able to help you manage logistics, merchandise, and track registrations for this specific event.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OrganizerShell>
  );
}
