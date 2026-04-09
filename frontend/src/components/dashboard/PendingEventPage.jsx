import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { C, FONT } from '../../constants/colors';
import { Icon } from '../common/Icon';
import OrganizerShell from './OrganizerShell';

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

function Card({ children, style = {}, pad = '20px' }) {
  return <div style={{ background: C.white, borderRadius: '14px', border: `1px solid ${C.border}`, boxShadow: '0 2px 12px rgba(5,54,104,.04)', padding: pad, ...style }}>{children}</div>;
}

function SectionHead({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
      <h3 style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: C.text, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</h3>
    </div>
  );
}

function DetailRow({ k, v }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '13px 0', borderBottom: `1px solid ${C.border}` }}>
      <span style={{ fontSize: '11px', fontWeight: '700', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0, minWidth: '130px' }}>{k}</span>
      <span style={{ fontSize: '13px', fontWeight: '600', color: C.text, textAlign: 'right' }}>{v}</span>
    </div>
  );
}

function StatusBadge() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: '700', padding: '5px 12px', borderRadius: '100px', background: C.warningLight, color: C.warning, border: '1px solid rgba(196,127,0,.2)', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: C.warning, display: 'block', flexShrink: 0 }} />
      Approval Pending
    </span>
  );
}

export default function PendingEventPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const event = EVENT_MAP[id] || EVENT_MAP[1];
  const steps = ['Submitted', 'Under Review', 'Decision', 'Published'];
  const currentStep = 1;

  return (
    <OrganizerShell page="events">
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: '24px', background: C.neutral, fontFamily: FONT }}>
      <button onClick={() => navigate('/my-events')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, fontSize: '13px', fontWeight: '600', padding: 0, width: 'fit-content' }}>
        <Icon.ArrowLeft size={15} /> Back to My Events
      </button>

      <div style={{ background: C.warningLight, border: `1.5px solid ${C.warning}30`, borderRadius: '16px', padding: '24px 28px', display: 'flex', alignItems: 'flex-start', gap: '18px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${C.warning}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.warning, flexShrink: 0 }}>
          <Icon.Clock size={22} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: C.text }}>Approval Pending</h2>
            <StatusBadge />
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: C.textMuted, lineHeight: 1.7 }}>This event is currently under review by the university administration. You will receive an email notification once a decision has been made. No changes can be made while the request is being reviewed.</p>
        </div>
      </div>

      <Card>
        <SectionHead label="Review Progress" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, position: 'relative' }}>
          {steps.map((step, i) => {
            const done = i < currentStep;
            const current = i === currentStep;
            return (
              <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                {i < steps.length - 1 && <div style={{ position: 'absolute', top: '18px', left: '50%', width: '100%', height: '2px', background: done ? C.primary : C.border, zIndex: 0 }} />}
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: done ? C.primary : current ? C.white : C.neutral, border: `2px solid ${done ? C.primary : current ? C.primary : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, position: 'relative', boxShadow: current ? `0 0 0 4px ${C.primaryLight}` : 'none' }}>
                  {done ? <span style={{ color: C.white, display: 'flex' }}><Icon.Check size={14} /></span> : current ? <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: C.secondary, display: 'block' }} /> : <span style={{ fontSize: '11px', fontWeight: '700', color: C.textDim }}>{i + 1}</span>}
                </div>
                <span style={{ fontSize: '11px', fontWeight: current ? '700' : '500', color: done || current ? C.text : C.textDim, marginTop: '8px', textAlign: 'center' }}>{step}</span>
                {current && <span style={{ fontSize: '9px', color: C.secondary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>In Progress</span>}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: '20px', background: C.warningLight, border: `1px solid ${C.warning}25`, borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <span style={{ color: C.warning, display: 'flex', marginTop: '1px' }}><Icon.Info size={15} /></span>
          <div>
            <p style={{ margin: '0 0 2px', fontSize: '12px', fontWeight: '700', color: C.warning }}>Estimated review time: 3-5 working days</p>
            <p style={{ margin: 0, fontSize: '11px', color: C.textMuted }}>Submitted on {event.date}. Check your university email for updates from the administration.</p>
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
        <Card>
          <SectionHead label="Submitted Request Details" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <DetailRow k="Event Title" v={event.title} />
            <DetailRow k="Type" v={event.type} />
            <DetailRow k="Date" v={event.date} />
            <DetailRow k="Time" v={event.time} />
            <DetailRow k="Venue" v={event.venue} />
            <DetailRow k="Category" v={event.category} />
            <div style={{ padding: '13px 0' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>Description</span>
              <p style={{ margin: 0, fontSize: '13px', color: C.text, lineHeight: 1.8 }}>{event.description}</p>
            </div>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card style={{ background: C.neutral }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ color: C.textDim, display: 'flex', flexShrink: 0 }}><Icon.AlertCircle size={18} /></span>
              <div>
                <p style={{ margin: '0 0 5px', fontSize: '12px', fontWeight: '700', color: C.text }}>Read-only View</p>
                <p style={{ margin: 0, fontSize: '12px', color: C.textMuted, lineHeight: 1.6 }}>Editing is disabled while your event is under review. Once approved, you will be able to add details, tickets, and merchandise.</p>
              </div>
            </div>
          </Card>

          <Card>
            <p style={{ margin: '0 0 14px', fontSize: '11px', fontWeight: '700', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>What Happens Next</p>
            {[
              { icon: <Icon.Check size={12} />, title: 'Decision Notification', desc: "You'll receive an email when approved or rejected.", color: C.success },
              { icon: <Icon.CheckCircle size={12} />, title: 'Event Setup Unlocked', desc: 'After approval, configure details, tickets, and merch.', color: C.primary },
              { icon: <Icon.BarChart size={12} />, title: 'Publish & Go Live', desc: 'Once setup is complete, publish for attendees.', color: C.secondary },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: i < 2 ? '16px' : '0' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <p style={{ margin: '0 0 3px', fontSize: '12px', fontWeight: '700', color: C.text }}>{item.title}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: C.textMuted, lineHeight: 1.5 }}>{item.desc}</p>
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
