import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, FONT } from '../../constants/colors';
import { Icon } from '../common/Icon';
import OrganizerShell from './OrganizerShell';
import { useTheme } from '../../context/ThemeContext';
import { eventRequestAPI } from '../../services/api';

const getStatusMeta = (isDarkMode) =>
  isDarkMode
    ? {
        pending: {
          label: 'Approval Pending',
          color: '#fbbf24',
          bg: 'rgba(251,191,36,.16)',
          border: 'rgba(251,191,36,.35)',
          dot: '#fbbf24',
        },
        approved: {
          label: 'Approved',
          color: '#60a5fa',
          bg: 'rgba(96,165,250,.16)',
          border: 'rgba(96,165,250,.35)',
          dot: '#60a5fa',
        },
        published: {
          label: 'Published',
          color: '#4ade80',
          bg: 'rgba(74,222,128,.16)',
          border: 'rgba(74,222,128,.35)',
          dot: '#4ade80',
        },
        rejected: {
          label: 'Rejected',
          color: '#f87171',
          bg: 'rgba(248,113,113,.16)',
          border: 'rgba(248,113,113,.35)',
          dot: '#f87171',
        },
        revision_requested: {
          label: 'Revision Requested',
          color: '#f97316',
          bg: 'rgba(249,115,22,.16)',
          border: 'rgba(249,115,22,.35)',
          dot: '#f97316',
        },
      }
    : {
        pending: { label: 'Approval Pending', color: C.warning, bg: C.warningLight, border: 'rgba(196,127,0,.2)', dot: C.warning },
        approved: { label: 'Approved', color: C.primary, bg: C.approvedBg, border: 'rgba(5,54,104,.15)', dot: C.primary },
        published: { label: 'Published', color: C.success, bg: C.successLight, border: 'rgba(27,127,75,.15)', dot: C.success },
        rejected: { label: 'Rejected', color: C.error, bg: '#FFEBEE', border: 'rgba(198,40,40,.2)', dot: C.error },
        revision_requested: { label: 'Revision Requested', color: C.secondary, bg: '#FFF3E0', border: 'rgba(245,124,0,.2)', dot: C.secondary },
      };

const getTypeColors = (isDarkMode) =>
  isDarkMode
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

function normalizeStatus(status) {
  if (!status) return 'pending';
  const normalized = String(status).toLowerCase();
  if (normalized === 'revision_requested') return 'revision_requested';
  if (['pending', 'approved', 'published', 'rejected'].includes(normalized)) {
    return normalized;
  }
  return 'pending';
}

function formatEventDate(dateString) {
  if (!dateString) return 'TBD';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return 'TBD';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

function splitDateParts(dateString) {
  const parts = (dateString || '').split(' ');
  return {
    month: parts[0] || 'TBD',
    day: (parts[1] || '').replace(',', '') || '--',
    year: parts[2] || '',
  };
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

function StatusBadge({ status, meta }) {
  const m = meta[status] || meta.pending;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '10px', fontWeight: '700', fontFamily: FONT, padding: '3px 10px', borderRadius: '100px', background: m.bg, color: m.color, border: `1px solid ${m.border}`, whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: m.dot, display: 'block', flexShrink: 0 }} />
      {m.label}
    </span>
  );
}

function TypeBadge({ type, colors }) {
  const col = colors[type] || { bg: C.primaryLight, text: C.primary };
  return <span style={{ fontSize: '10px', fontWeight: '600', fontFamily: FONT, padding: '3px 9px', borderRadius: '100px', background: col.bg, color: col.text, whiteSpace: 'nowrap' }}>{type}</span>;
}

export default function MyEventsPage() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventRequestAPI.getMyEventRequestsAll();

      if (response.success) {
        const mapped = (response.data || []).map((req) => ({
          id: req.id,
          title: req.title || 'Untitled Event',
          date: formatEventDate(req.eventDate),
          time: formatTimeRange(req.startTime, req.endTime),
          venue: req.venue || 'TBD',
          type: req.eventType || 'Event',
          status: normalizeStatus(req.status),
          registered: 0,
        }));
        setEvents(mapped);
      } else {
        setError(response.message || 'Failed to load your event requests.');
      }
    } catch (err) {
      console.error('Error fetching event requests:', err);
      const fallback = err?.message?.includes('Failed to fetch')
        ? 'Unable to reach the server. Make sure the backend is running.'
        : err.message || 'Failed to load your event requests.';
      setError(fallback);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const palette = isDarkMode
    ? {
        pageBg: '#0B1324',
        surface: '#111A2E',
        surfaceAlt: '#0F172A',
        border: '#22304A',
        text: '#E2E8F0',
        textMuted: '#D5DFEA',
        textDim: '#AFC0D6',
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

  const statusMeta = useMemo(() => getStatusMeta(isDarkMode), [isDarkMode]);
  const typeColors = useMemo(() => getTypeColors(isDarkMode), [isDarkMode]);

  const counts = useMemo(() => ({
    all: events.length,
    pending: events.filter((e) => e.status === 'pending').length,
    approved: events.filter((e) => e.status === 'approved').length,
    published: events.filter((e) => e.status === 'published').length,
  }), [events]);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const matchStatus = filter === 'all' || e.status === filter;
      const q = search.toLowerCase();
      const matchSearch = e.title.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [events, filter, search]);

  return (
    <OrganizerShell page="events">
      <div style={{ background: palette.pageBg, padding: '32px 36px', fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: '24px', minHeight: '100%' }}>
        <div style={{ background: `linear-gradient(135deg, ${C.primary} 0%, #0a4f96 100%)`, borderRadius: '18px', padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,.05)' }} />
          <div>
            <p style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,.82)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Organizer Portal</p>
            <h1 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: '800', color: C.white, letterSpacing: '-0.03em', lineHeight: 1.1 }}>My Events</h1>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,.78)' }}>Track and manage all events you've created and submitted.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {[
              { label: 'Pending', value: counts.pending },
              { label: 'Published', value: counts.published },
            ].map((item) => (
              <div key={item.label} style={{ background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)', borderRadius: '12px', padding: '10px 14px', minWidth: '110px' }}>
                <p style={{ margin: 0, fontSize: '10px', color: 'rgba(255,255,255,.8)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{item.label}</p>
                <p style={{ margin: '3px 0 0', fontSize: '18px', fontWeight: '800', color: C.white }}>{item.value}</p>
              </div>
            ))}
            <button
              onClick={() => navigate('/create-event')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 20px',
                background: C.secondary,
                color: C.white,
                border: 'none',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                fontFamily: FONT,
                boxShadow: '0 6px 18px rgba(255,113,0,.35)',
              }}
            >
              <Icon.Plus size={15} /> New Event Request
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {[
            { key: 'all', label: 'Total Events', value: counts.all, color: C.primary, bg: isDarkMode ? 'rgba(96,165,250,.16)' : C.primaryLight },
            { key: 'pending', label: 'Awaiting Approval', value: counts.pending, color: C.warning, bg: isDarkMode ? 'rgba(251,191,36,.16)' : C.warningLight },
            { key: 'approved', label: 'Approved', value: counts.approved, color: C.primary, bg: isDarkMode ? 'rgba(96,165,250,.16)' : C.primaryLight },
            { key: 'published', label: 'Live & Published', value: counts.published, color: C.success, bg: isDarkMode ? 'rgba(74,222,128,.16)' : C.successLight },
          ].map((s) => (
            <button key={s.key} onClick={() => setFilter(s.key)} style={{ background: filter === s.key ? s.bg : palette.surface, border: `1.5px solid ${filter === s.key ? `${s.color}55` : palette.border}`, borderRadius: '12px', padding: '16px 18px', cursor: 'pointer', textAlign: 'left', transition: 'all .2s', boxShadow: isDarkMode ? 'none' : filter === s.key ? `0 4px 16px ${s.color}18` : '0 1px 4px rgba(5,54,104,.04)' }}>
              <div style={{ fontSize: '26px', fontWeight: '800', color: filter === s.key ? s.color : palette.text, lineHeight: 1, marginBottom: '5px' }}>{s.value}</div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: filter === s.key ? s.color : palette.text }}>{s.label}</div>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: '14px', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: palette.surfaceAlt, border: `1px solid ${palette.border}`, borderRadius: '10px', padding: '8px 12px', flex: 1, maxWidth: '360px' }}>
            <span style={{ color: palette.textDim, display: 'flex' }}><Icon.Search /></span>
            <input placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: '13px', color: palette.text, background: 'transparent', width: '100%', fontFamily: FONT }} />
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[['all', 'All'], ['pending', 'Pending'], ['approved', 'Approved'], ['published', 'Published']].map(([k, l]) => (
              <button key={k} onClick={() => setFilter(k)} style={{ padding: '7px 14px', borderRadius: '999px', fontSize: '12px', cursor: 'pointer', fontWeight: filter === k ? '700' : '500', border: `1.5px solid ${filter === k ? C.primary : palette.border}`, background: filter === k ? (isDarkMode ? 'rgba(96,165,250,.18)' : C.primaryLight) : palette.surface, color: filter === k ? C.primary : palette.text }}>
                {l}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '12px', color: palette.textDim }}>{filtered.length} event{filtered.length !== 1 ? 's' : ''}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {loading ? (
            <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: '14px', padding: '60px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
              <p style={{ fontSize: '14px', color: palette.textMuted, margin: 0 }}>Loading your event requests...</p>
            </div>
          ) : error ? (
            <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: '14px', padding: '24px', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: C.error, margin: '0 0 12px' }}>{error}</p>
              <button onClick={fetchRequests} style={{ padding: '8px 14px', background: C.primary, color: C.white, border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: '14px', padding: '60px 24px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: palette.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: palette.textDim }}><Icon.Events /></div>
              <p style={{ fontSize: '15px', fontWeight: '700', color: palette.text, margin: '0 0 6px' }}>No pending requests found</p>
              <p style={{ fontSize: '13px', color: palette.textMuted, margin: 0 }}>Submit a new request to see it here.</p>
            </div>
          ) : (
            filtered.map((ev, i) => {
              const sm = statusMeta[ev.status];
              const isFirst = i === 0;
              const isLast = i === filtered.length - 1;
              const dateParts = splitDateParts(ev.date);
              const isPending = ev.status === 'pending';
              const isApproved = ev.status === 'approved';
              const isPublished = ev.status === 'published';
              return (
                <div key={ev.id}
                  onClick={() => {
                    if (isPending) navigate(`/my-events/${ev.id}/pending`);
                    if (isApproved) navigate(`/my-events/${ev.id}/setup`);
                    if (isPublished) navigate(`/my-events/${ev.id}/published`);
                  }}
                  style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: isFirst && isLast ? '12px' : isFirst ? '12px 12px 4px 4px' : isLast ? '4px 4px 12px 12px' : '4px', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '18px', transition: 'all .18s', position: 'relative', cursor: isPending || isApproved || isPublished ? 'pointer' : 'default' }}>
                  <div style={{ position: 'absolute', left: 0, top: '12px', bottom: '12px', width: '3px', borderRadius: '0 3px 3px 0', background: sm.dot }} />

                  <div style={{ width: '52px', height: '58px', borderRadius: '10px', background: palette.surfaceAlt, border: `1px solid ${palette.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '9px', fontWeight: '700', color: palette.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{dateParts.month}</span>
                    <span style={{ fontSize: '22px', fontWeight: '800', color: C.primary, lineHeight: 1.1 }}>{dateParts.day}</span>
                    <span style={{ fontSize: '9px', fontWeight: '600', color: palette.textDim }}>{dateParts.year}</span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: palette.text, letterSpacing: '-0.01em' }}>{ev.title}</h3>
                      <TypeBadge type={ev.type} colors={typeColors} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: palette.textMuted }}><Icon.Clock size={12} />{ev.time}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: palette.textMuted }}><Icon.MapPin size={12} />{ev.venue}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
                    <StatusBadge status={ev.status} meta={statusMeta} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div style={{ background: `linear-gradient(135deg, ${C.primary} 0%, #0a4f96 100%)`, borderRadius: '14px', padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,.04)' }} />
          <div>
            <p style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: '800', color: C.white }}>Ready to create your next event?</p>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,.6)' }}>Submit a permission request to the university administration.</p>
          </div>
          <button onClick={() => navigate('/create-event')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 22px', background: C.secondary, color: C.white, border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,113,0,.4)', flexShrink: 0 }}>
            <Icon.Plus size={15} /> Request Permission
          </button>
        </div>
      </div>
    </OrganizerShell>
  );
}
