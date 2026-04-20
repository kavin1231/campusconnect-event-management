import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { C, FONT } from '../../constants/colors';
import { Icon } from '../common/Icon';
import OrganizerShell from './OrganizerShell';
import { useTheme } from '../../context/ThemeContext';
import { eventRequestAPI, resolveImageUrl } from '../../services/api';

function StatusBadge() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: '700', padding: '5px 12px', borderRadius: '100px', background: 'rgba(74,222,128,.16)', color: '#4ade80', border: '1px solid rgba(74,222,128,.3)', whiteSpace: 'nowrap', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'block', flexShrink: 0 }} />
      Published
    </span>
  );
}

function Card({ children, style = {}, pad = '20px', palette, isDarkMode }) {
  const surface = palette?.surface ?? C.white;
  const border = palette?.border ?? C.border;
  const shadow = isDarkMode ? 'none' : '0 2px 12px rgba(5,54,104,.04)';
  return <div style={{ background: surface, borderRadius: '14px', border: `1px solid ${border}`, boxShadow: shadow, padding: pad, ...style }}>{children}</div>;
}

function SectionHead({ label, palette }) {
  const text = palette?.text ?? C.text;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
      <h3 style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: text, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</h3>
    </div>
  );
}

function TypeBadge({ type, isDarkMode }) {
  const map = isDarkMode
    ? {
        Conference: { bg: '#0F172A', text: '#93C5FD' },
        Workshop: { bg: '#0F1A16', text: '#86EFAC' },
        Concert: { bg: '#1B1632', text: '#C4B5FD' },
        Hackathon: { bg: '#0F172A', text: '#93C5FD' },
        Seminar: { bg: '#0B1E2D', text: '#7DD3FC' },
      }
    : {
        Conference: { bg: '#EBF1F9', text: C.primary },
        Workshop: { bg: '#E8F5EF', text: C.success },
        Concert: { bg: '#FDF2F8', text: '#7E22CE' },
        Hackathon: { bg: '#EBF1F9', text: C.primary },
        Seminar: { bg: '#F0F9FF', text: '#0369A1' },
      };
  const col = map[type] || { bg: C.primaryLight, text: C.primary };
  return <span style={{ fontSize: '10px', fontWeight: '600', padding: '3px 9px', borderRadius: '100px', background: col.bg, color: col.text, whiteSpace: 'nowrap' }}>{type}</span>;
}

function formatDate(dateString) {
  if (!dateString) return 'TBD';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return 'TBD';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

function formatTime(value) {
  if (!value) return '';
  if (/am|pm/i.test(value)) return value;
  const [hourPart, minutePart = '00'] = String(value).split(':');
  const hourNum = Number(hourPart);
  if (Number.isNaN(hourNum)) return value;
  const period = hourNum >= 12 ? 'PM' : 'AM';
  const hour12 = ((hourNum + 11) % 12) + 1;
  const minutes = String(minutePart).padStart(2, '0');
  return `${hour12}:${minutes} ${period}`;
}

function formatTimeRange(startTime, endTime) {
  const start = formatTime(startTime);
  const end = formatTime(endTime);
  if (start && end) return `${start} - ${end}`;
  return start || end || 'Time TBD';
}

export default function PublishedEventPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isDarkMode } = useTheme();
  const [eventRequest, setEventRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const palette = isDarkMode
    ? {
        pageBg: '#0B1324',
        surface: '#111A2E',
        surfaceAlt: '#0F172A',
        border: '#22304A',
        text: '#E2E8F0',
        textMuted: '#B6C2D4',
        textDim: '#8FA3BF',
      }
    : {
        pageBg: C.neutral,
        surface: C.white,
        surfaceAlt: C.neutral,
        border: C.border,
        text: C.text,
        textMuted: C.textMuted,
        textDim: C.textDim,
      };

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await eventRequestAPI.getEventRequestById(id);
        if (response.success) {
          setEventRequest(response.data || null);
        } else {
          setError(response.message || 'Failed to load event request.');
        }
      } catch (err) {
        console.error('Error loading event request:', err);
        setError(err.message || 'Failed to load event request.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRequest();
    } else {
      setLoading(false);
      setError('Missing event request id.');
    }
  }, [id]);

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'orders', label: 'Orders' },
    { key: 'analytics', label: 'Analytics' },
  ];

  const title = eventRequest?.title || 'Event';
  const date = formatDate(eventRequest?.eventDate);
  const time = formatTimeRange(eventRequest?.startTime, eventRequest?.endTime);
  const venue = eventRequest?.venue || 'TBD';
  const type = eventRequest?.eventType || 'Event';
  const category = eventRequest?.purposeTag || 'General';
  const description = eventRequest?.purposeDescription || 'No description provided.';
  const capacity = Number(eventRequest?.expectedAttendance) || 0;
  const registered = 0;
  const orders = 0;
  const revenue = 0;
  const tickets = eventRequest?.tickets || [];
  const merch = eventRequest?.merchandise || [];
  const registrationPct = capacity > 0 ? Math.round((registered / capacity) * 100) : 0;
  const bannerPreview = resolveImageUrl(eventRequest?.bannerUrl || '');

  if (loading) {
    return (
      <OrganizerShell page="events">
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: palette.pageBg, fontFamily: FONT }}>
          <p style={{ margin: 0, fontSize: '14px', color: palette.textMuted }}>Loading event...</p>
        </div>
      </OrganizerShell>
    );
  }

  if (error) {
    return (
      <OrganizerShell page="events">
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: palette.pageBg, fontFamily: FONT, padding: '24px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 12px', fontSize: '14px', color: C.error }}>{error}</p>
            <button onClick={() => navigate('/my-events')} style={{ padding: '8px 14px', background: C.primary, color: C.white, border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Back to My Events</button>
          </div>
        </div>
      </OrganizerShell>
    );
  }

  return (
    <OrganizerShell page="events">
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: '24px', background: palette.pageBg, fontFamily: FONT }}>
        <div style={{ background: `linear-gradient(135deg, ${C.primary} 0%, #0a4f96 100%)`, borderRadius: '18px', padding: '24px 28px', position: 'relative', overflow: 'hidden', color: C.white }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '170px', height: '170px', borderRadius: '50%', background: 'rgba(255,255,255,.05)' }} />
          <button onClick={() => navigate('/my-events')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)', cursor: 'pointer', color: 'rgba(255,255,255,.8)', fontSize: '12px', fontWeight: '600', padding: '6px 12px', borderRadius: '8px', marginBottom: '14px' }}>
            <Icon.ArrowLeft size={14} /> Back to My Events
          </button>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '14px', background: bannerPreview ? `url('${bannerPreview}') center/cover` : 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {!bannerPreview && <span style={{ fontSize: '30px' }}>🎓</span>}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', letterSpacing: '-0.02em' }}>{title}</h1>
                  <StatusBadge />
                </div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', color: 'rgba(255,255,255,.7)', fontSize: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icon.Calendar size={12} />{date}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icon.Clock size={12} />{time}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icon.MapPin size={12} />{venue}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', background: 'rgba(255,255,255,.12)', color: C.white, border: '1px solid rgba(255,255,255,.2)', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                <Icon.Eye size={14} /> Preview
              </button>
              <button onClick={() => navigate(`/my-events/${eventRequest?.id || id}/merchandise`)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', background: C.secondary, color: C.white, border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 6px 18px rgba(255,113,0,.35)' }}>
                <Icon.Package size={14} /> Merchandise
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', background: C.white, color: C.primary, border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                <Icon.ExternalLink size={12} /> View Live
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {[
            { label: 'Registered', value: registered, sub: `of ${capacity || 0} capacity`, color: C.primary, icon: <Icon.Users size={16} />, bg: C.primaryLight },
            { label: 'Registration', value: `${registrationPct}%`, sub: 'capacity filled', color: C.success, icon: <Icon.BarChart size={16} />, bg: C.successLight },
            { label: 'Total Orders', value: orders, sub: 'across all items', color: C.primary, icon: <Icon.Package size={16} />, bg: C.primaryLight },
            { label: 'Revenue (LKR)', value: revenue.toLocaleString(), sub: 'total collected', color: C.warning, icon: <Icon.Tag size={16} />, bg: C.warningLight },
          ].map((s) => (
            <div key={s.label} style={{ background: palette.surface, borderRadius: '12px', padding: '18px', border: `1px solid ${palette.border}`, boxShadow: isDarkMode ? 'none' : '0 2px 8px rgba(5,54,104,.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: palette.text, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: palette.text, marginTop: '4px' }}>{s.label}</div>
              <div style={{ fontSize: '11px', color: palette.textMuted }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '2px', borderBottom: `2px solid ${palette.border}` }}>
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: '9px 20px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px', fontWeight: activeTab === tab.key ? '700' : '500', color: activeTab === tab.key ? C.primary : palette.textMuted, borderBottom: `2px solid ${activeTab === tab.key ? C.secondary : 'transparent'}`, marginBottom: '-2px' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <Card palette={palette} isDarkMode={isDarkMode}>
              <SectionHead label="Ticket Performance" palette={palette} />
              {tickets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: palette.textDim }}>
                  <p style={{ margin: 0, fontSize: '13px' }}>No ticket data available yet.</p>
                </div>
              ) : tickets.map((t, i) => (
                <div key={i} style={{ marginBottom: i < tickets.length - 1 ? '16px' : '0' }}>
                  {(() => {
                    const sold = Number(t.sold || 0);
                    const inventory = Number(t.inventory || 0);
                    const price = Number(t.price || 0);
                    const pct = inventory > 0 ? Math.round((sold / inventory) * 100) : 0;
                    return (
                      <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div>
                      <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '700', color: palette.text }}>{t.name}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: palette.textMuted }}>{price === 0 ? 'Free' : `LKR ${price.toLocaleString()}`}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '700', color: palette.text }}>{sold} / {inventory}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: C.success, fontWeight: '600' }}>{pct}% sold</p>
                    </div>
                  </div>
                  <div style={{ background: palette.border, borderRadius: '100px', height: '5px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: price === 0 ? C.primary : C.secondary, borderRadius: '100px' }} />
                  </div>
                      </>
                    );
                  })()}
                </div>
              ))}
            </Card>

            <Card palette={palette} isDarkMode={isDarkMode}>
              <SectionHead label="Merchandise" palette={palette} />
              {merch.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: palette.textDim }}>
                  <p style={{ margin: 0, fontSize: '13px' }}>No merchandise for this event.</p>
                </div>
              ) : merch.map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: i < merch.length - 1 ? `1px solid ${palette.border}` : 'none' }}>
                  {(() => {
                    const sold = Number(m.sold || 0);
                    const price = Number(m.price || 0);
                    return (
                      <>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primary, flexShrink: 0 }}><Icon.Package size={14} /></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 2px', fontSize: '12px', fontWeight: '700', color: palette.text }}>{m.name}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: palette.textMuted }}>LKR {price.toLocaleString()} - {sold} sold</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 2px', fontSize: '12px', fontWeight: '700', color: C.success }}>LKR {(price * sold).toLocaleString()}</p>
                    <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: m.enabled ? (isDarkMode ? 'rgba(74,222,128,.16)' : C.successLight) : palette.surfaceAlt, color: m.enabled ? C.success : palette.textMuted, fontWeight: '600' }}>{m.enabled ? 'Active' : 'Paused'}</span>
                  </div>
                      </>
                    );
                  })()}
                </div>
              ))}
            </Card>

            <Card palette={palette} isDarkMode={isDarkMode}>
              <SectionHead label="Attendance" palette={palette} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0 }}>
                  <svg width="90" height="90" viewBox="0 0 90 90">
                    <circle cx="45" cy="45" r="38" fill="none" stroke={palette.border} strokeWidth="8" />
                    <circle cx="45" cy="45" r="38" fill="none" stroke={C.success} strokeWidth="8" strokeDasharray={`${2 * Math.PI * 38}`} strokeDashoffset={`${2 * Math.PI * 38 * (1 - registrationPct / 100)}`} strokeLinecap="round" transform="rotate(-90 45 45)" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '16px', fontWeight: '800', color: palette.text, lineHeight: 1 }}>{registrationPct}%</span>
                    <span style={{ fontSize: '9px', color: palette.textMuted }}>filled</span>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  {[['Registered', registered, C.success], ['Remaining', Math.max(capacity - registered, 0), palette.textMuted]].map(([label, val, col]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${palette.border}` }}>
                      <span style={{ fontSize: '12px', color: palette.textMuted }}>{label}</span>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: col }}>{val}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span style={{ fontSize: '12px', color: palette.textMuted }}>Total Capacity</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: palette.text }}>{capacity}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card palette={palette} isDarkMode={isDarkMode}>
              <SectionHead label="Event Details" palette={palette} />
              <p style={{ margin: '0 0 14px', fontSize: '13px', color: palette.textMuted, lineHeight: 1.8 }}>{description}</p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <TypeBadge type={type} isDarkMode={isDarkMode} />
                <span style={{ fontSize: '10px', padding: '3px 9px', borderRadius: '100px', background: isDarkMode ? 'rgba(96,165,250,.16)' : C.primaryLight, color: C.primary, fontWeight: '600' }}>{category}</span>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'orders' && (
          <Card pad="0" palette={palette} isDarkMode={isDarkMode}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${palette.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: palette.text, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recent Orders</h3>
              <span style={{ fontSize: '12px', color: palette.textMuted }}>0 orders</span>
            </div>
            <div style={{ padding: '24px', textAlign: 'center', color: palette.textDim }}>
              <p style={{ margin: 0, fontSize: '13px' }}>No orders available yet.</p>
            </div>
          </Card>
        )}

        {activeTab === 'analytics' && (
          <Card palette={palette} isDarkMode={isDarkMode}>
            <SectionHead label="Analytics" palette={palette} />
            <div style={{ textAlign: 'center', padding: '24px', color: palette.textDim }}>
              <p style={{ margin: 0, fontSize: '13px' }}>Analytics will appear once registrations and orders start coming in.</p>
            </div>
          </Card>
        )}
      </div>
    </OrganizerShell>
  );
}
