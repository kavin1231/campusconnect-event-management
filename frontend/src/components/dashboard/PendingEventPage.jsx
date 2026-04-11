import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { C, FONT } from '../../constants/colors';
import { Icon } from '../common/Icon';
import OrganizerShell from './OrganizerShell';
import { useTheme } from '../../context/ThemeContext';

const EVENT_MAP = {
  1: {
    title: 'IEEE Annual Tech Symposium 2026',
    type: 'Conference',
    date: 'Mar 28, 2026',
    time: '9:00 AM - 5:00 PM',
    venue: 'Main Auditorium',
    category: 'Technology',
    description:
      'A day-long technology symposium bringing together students, faculty, and industry professionals to explore the frontiers of engineering and computing.',
  },
  3: {
    title: 'Music Night - Spring Edition',
    type: 'Concert',
    date: 'Apr 20, 2026',
    time: '6:00 PM - 10:00 PM',
    venue: 'Open Air Amphitheatre',
    category: 'Arts & Culture',
    description:
      'An evening of live musical performances by student bands and solo artists, featuring indie, jazz, and classical performances.',
  },
};

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

function DetailRow({ k, v, palette }) {
  const textMuted = palette?.textMuted ?? C.textMuted;
  const text = palette?.text ?? C.text;
  const border = palette?.border ?? C.border;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '13px 0', borderBottom: `1px solid ${border}` }}>
      <span style={{ fontSize: '11px', fontWeight: '700', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0, minWidth: '130px' }}>{k}</span>
      <span style={{ fontSize: '13px', fontWeight: '600', color: text, textAlign: 'right' }}>{v}</span>
    </div>
  );
}

function StatusBadge() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: '700', padding: '5px 12px', borderRadius: '100px', background: 'rgba(251,191,36,.2)', color: '#fbbf24', border: '1px solid rgba(251,191,36,.35)', whiteSpace: 'nowrap', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fbbf24', display: 'block', flexShrink: 0 }} />
      Approval Pending
    </span>
  );
}

export default function PendingEventPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isDarkMode } = useTheme();
  const event = EVENT_MAP[id] || EVENT_MAP[1];
  const steps = ['Submitted', 'Under Review', 'Decision', 'Published'];
  const currentStep = 1;

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

  return (
    <OrganizerShell page="events">
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: '24px', background: palette.pageBg, fontFamily: FONT }}>
      <div style={{ background: `linear-gradient(135deg, ${C.warning} 0%, #d97706 100%)`, borderRadius: '18px', padding: '24px 28px', position: 'relative', overflow: 'hidden', color: C.white }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '170px', height: '170px', borderRadius: '50%', background: 'rgba(255,255,255,.08)' }} />
        <button onClick={() => navigate('/my-events')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.25)', cursor: 'pointer', color: 'rgba(255,255,255,.85)', fontSize: '12px', fontWeight: '600', padding: '6px 12px', borderRadius: '8px', marginBottom: '14px' }}>
          <Icon.ArrowLeft size={14} /> Back to My Events
        </button>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div style={{ width: '58px', height: '58px', borderRadius: '14px', background: 'rgba(255,255,255,.18)', border: '1px solid rgba(255,255,255,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon.Clock size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>Approval Pending</h2>
                <StatusBadge />
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,.8)', lineHeight: 1.7 }}>This event is under review by the university administration. You'll receive an email once a decision is made. Editing is disabled during review.</p>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)', borderRadius: '12px', padding: '12px 16px', minWidth: '190px' }}>
            <p style={{ margin: 0, fontSize: '10px', color: 'rgba(255,255,255,.6)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Estimated Review</p>
            <p style={{ margin: '6px 0 0', fontSize: '16px', fontWeight: '800' }}>3-5 working days</p>
            <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'rgba(255,255,255,.7)' }}>Submitted on {event.date}</p>
          </div>
        </div>
      </div>

      <Card palette={palette} isDarkMode={isDarkMode}>
        <SectionHead label="Review Progress" palette={palette} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, position: 'relative' }}>
          {steps.map((step, i) => {
            const done = i < currentStep;
            const current = i === currentStep;
            return (
              <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                {i < steps.length - 1 && <div style={{ position: 'absolute', top: '18px', left: '50%', width: '100%', height: '2px', background: done ? C.primary : palette.border, zIndex: 0 }} />}
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: done ? C.primary : current ? palette.surface : palette.surfaceAlt, border: `2px solid ${done ? C.primary : current ? C.primary : palette.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, position: 'relative', boxShadow: current ? `0 0 0 4px ${isDarkMode ? 'rgba(96,165,250,.2)' : C.primaryLight}` : 'none' }}>
                  {done ? <span style={{ color: C.white, display: 'flex' }}><Icon.Check size={14} /></span> : current ? <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: C.secondary, display: 'block' }} /> : <span style={{ fontSize: '11px', fontWeight: '700', color: palette.textDim }}>{i + 1}</span>}
                </div>
                <span style={{ fontSize: '11px', fontWeight: current ? '700' : '500', color: done || current ? palette.text : palette.textDim, marginTop: '8px', textAlign: 'center' }}>{step}</span>
                {current && <span style={{ fontSize: '9px', color: C.secondary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>In Progress</span>}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: '20px', background: isDarkMode ? 'rgba(251,191,36,.15)' : C.warningLight, border: `1px solid ${isDarkMode ? 'rgba(251,191,36,.3)' : `${C.warning}25`}`, borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <span style={{ color: C.warning, display: 'flex', marginTop: '1px' }}><Icon.Info size={15} /></span>
          <div>
            <p style={{ margin: '0 0 2px', fontSize: '12px', fontWeight: '700', color: C.warning }}>Estimated review time: 3-5 working days</p>
            <p style={{ margin: 0, fontSize: '11px', color: palette.textMuted }}>Submitted on {event.date}. Check your university email for updates from the administration.</p>
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
        <Card palette={palette} isDarkMode={isDarkMode}>
          <SectionHead label="Submitted Request Details" palette={palette} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <DetailRow k="Event Title" v={event.title} palette={palette} />
            <DetailRow k="Type" v={event.type} palette={palette} />
            <DetailRow k="Date" v={event.date} palette={palette} />
            <DetailRow k="Time" v={event.time} palette={palette} />
            <DetailRow k="Venue" v={event.venue} palette={palette} />
            <DetailRow k="Category" v={event.category} palette={palette} />
            <div style={{ padding: '13px 0' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: palette.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>Description</span>
              <p style={{ margin: 0, fontSize: '13px', color: palette.text, lineHeight: 1.8 }}>{event.description}</p>
            </div>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card style={{ background: palette.surfaceAlt }} palette={palette} isDarkMode={isDarkMode}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ color: palette.textDim, display: 'flex', flexShrink: 0 }}><Icon.AlertCircle size={18} /></span>
              <div>
                <p style={{ margin: '0 0 5px', fontSize: '12px', fontWeight: '700', color: palette.text }}>Read-only View</p>
                <p style={{ margin: 0, fontSize: '12px', color: palette.textMuted, lineHeight: 1.6 }}>Editing is disabled while your event is under review. Once approved, you will be able to add details, tickets, and merchandise.</p>
              </div>
            </div>
          </Card>

          <Card palette={palette} isDarkMode={isDarkMode}>
            <p style={{ margin: '0 0 14px', fontSize: '11px', fontWeight: '700', color: palette.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>What Happens Next</p>
            {[
              { icon: <Icon.Check size={12} />, title: 'Decision Notification', desc: "You'll receive an email when approved or rejected.", color: C.success },
              { icon: <Icon.CheckCircle size={12} />, title: 'Event Setup Unlocked', desc: 'After approval, configure details, tickets, and merch.', color: C.primary },
              { icon: <Icon.BarChart size={12} />, title: 'Publish & Go Live', desc: 'Once setup is complete, publish for attendees.', color: C.secondary },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: i < 2 ? '16px' : '0' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <p style={{ margin: '0 0 3px', fontSize: '12px', fontWeight: '700', color: palette.text }}>{item.title}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: palette.textMuted, lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
    </OrganizerShell>
  );
}
