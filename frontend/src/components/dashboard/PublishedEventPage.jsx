import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { C, FONT } from '../../constants/colors';
import { Icon } from '../common/Icon';
import OrganizerShell from './OrganizerShell';

const EVENT_MAP = {
  1: {
    id: 1,
    title: 'IEEE Annual Tech Symposium 2026',
    date: 'Mar 28, 2026',
    time: '9:00 AM - 5:00 PM',
    venue: 'Main Auditorium',
    type: 'Conference',
    category: 'Technology',
    description:
      'A day-long technology symposium bringing together students, faculty, and industry professionals to explore the frontiers of engineering and computing.',
    capacity: 320,
    registered: 287,
    orders: 305,
    revenue: 42300,
    tickets: [
      { name: 'General Admission', price: 0, inventory: 300, sold: 287, enabled: true },
      { name: 'VIP Access', price: 1500, inventory: 20, sold: 18, enabled: true },
    ],
    merch: [
      { name: 'IEEE T-Shirt', price: 750, inventory: 100, sold: 64, enabled: true },
      { name: 'Tote Bag', price: 350, inventory: 80, sold: 51, enabled: false },
    ],
  },
  5: {
    id: 5,
    title: "Freshers' Orientation 2026",
    date: 'Mar 22, 2026',
    time: '9:00 AM - 1:00 PM',
    venue: 'Main Auditorium',
    type: 'Seminar',
    category: 'University Life',
    description:
      'Official welcome event for the new intake of students. Includes department introductions, campus tour briefing, and social activities.',
    capacity: 600,
    registered: 524,
    orders: 524,
    revenue: 0,
    tickets: [{ name: 'New Student Entry', price: 0, inventory: 600, sold: 524, enabled: true }],
    merch: [{ name: 'Welcome Kit', price: 500, inventory: 200, sold: 187, enabled: false }],
  },
};

function StatusBadge() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: '700', padding: '5px 12px', borderRadius: '100px', background: C.successLight, color: C.success, border: '1px solid rgba(27,127,75,.15)', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: C.success, display: 'block', flexShrink: 0 }} />
      Published
    </span>
  );
}

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

function TypeBadge({ type }) {
  const map = {
    Conference: { bg: '#EBF1F9', text: C.primary },
    Workshop: { bg: '#E8F5EF', text: C.success },
    Concert: { bg: '#FDF2F8', text: '#7E22CE' },
    Hackathon: { bg: '#EBF1F9', text: C.primary },
    Seminar: { bg: '#F0F9FF', text: '#0369A1' },
  };
  const col = map[type] || { bg: C.primaryLight, text: C.primary };
  return <span style={{ fontSize: '10px', fontWeight: '600', padding: '3px 9px', borderRadius: '100px', background: col.bg, color: col.text, whiteSpace: 'nowrap' }}>{type}</span>;
}

export default function PublishedEventPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const event = EVENT_MAP[id] || EVENT_MAP[1];

  const [activeTab, setActiveTab] = useState('overview');
  const registrationPct = Math.round((event.registered / event.capacity) * 100);

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'orders', label: 'Orders' },
    { key: 'analytics', label: 'Analytics' },
  ];

  const mockOrders = [
    { id: 'ORD-001', name: 'Ashan Fernando', item: 'General Admission', qty: 2, amount: 0, status: 'confirmed', date: 'Mar 10' },
    { id: 'ORD-002', name: 'Dilani Perera', item: 'VIP Access', qty: 1, amount: 1500, status: 'confirmed', date: 'Mar 11' },
    { id: 'ORD-003', name: 'Kavinda Rajapaksa', item: 'IEEE T-Shirt', qty: 1, amount: 750, status: 'confirmed', date: 'Mar 12' },
    { id: 'ORD-004', name: 'Nadeesha Silva', item: 'General Admission', qty: 1, amount: 0, status: 'confirmed', date: 'Mar 13' },
    { id: 'ORD-005', name: 'Thisara Bandara', item: 'General Admission', qty: 3, amount: 0, status: 'confirmed', date: 'Mar 14' },
  ];

  return (
    <OrganizerShell page="events">
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: '24px', background: C.neutral, fontFamily: FONT }}>
        <button onClick={() => navigate('/my-events')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, fontSize: '13px', fontWeight: '600', padding: 0, width: 'fit-content' }}>
          <Icon.ArrowLeft size={15} /> Back to My Events
        </button>

        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '24px 28px', display: 'flex', alignItems: 'flex-start', gap: '20px', boxShadow: '0 2px 12px rgba(5,54,104,.05)' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '14px', background: C.successLight, border: '1.5px solid rgba(27,127,75,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '32px' }}>🎓</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: C.text, letterSpacing: '-0.02em' }}>{event.title}</h1>
              <StatusBadge />
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: C.textMuted }}><Icon.Calendar size={12} />{event.date}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: C.textMuted }}><Icon.Clock size={12} />{event.time}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: C.textMuted }}><Icon.MapPin size={12} />{event.venue}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', background: C.neutral, color: C.primary, border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
              <Icon.Eye size={14} /> Preview
            </button>
            <button onClick={() => navigate(`/my-events/${event.id}/merchandise`)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', background: C.secondary, color: C.white, border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
              <Icon.Package size={14} /> Merchandise
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', background: C.primary, color: C.white, border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
              <Icon.ExternalLink size={12} /> View Live
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {[
            { label: 'Registered', value: event.registered, sub: `of ${event.capacity} capacity`, color: C.primary, icon: <Icon.Users size={16} />, bg: C.primaryLight },
            { label: 'Registration', value: `${registrationPct}%`, sub: 'capacity filled', color: C.success, icon: <Icon.BarChart size={16} />, bg: C.successLight },
            { label: 'Total Orders', value: event.orders, sub: 'across all items', color: C.primary, icon: <Icon.Package size={16} />, bg: C.primaryLight },
            { label: 'Revenue (LKR)', value: event.revenue.toLocaleString(), sub: 'total collected', color: C.warning, icon: <Icon.Tag size={16} />, bg: C.warningLight },
          ].map((s) => (
            <div key={s.label} style={{ background: C.white, borderRadius: '12px', padding: '18px', border: `1px solid ${C.border}`, boxShadow: '0 2px 8px rgba(5,54,104,.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: C.text, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: C.text, marginTop: '4px' }}>{s.label}</div>
              <div style={{ fontSize: '11px', color: C.textMuted }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '2px', borderBottom: `2px solid ${C.border}` }}>
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: '9px 20px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px', fontWeight: activeTab === tab.key ? '700' : '500', color: activeTab === tab.key ? C.primary : C.textMuted, borderBottom: `2px solid ${activeTab === tab.key ? C.secondary : 'transparent'}`, marginBottom: '-2px' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <Card>
              <SectionHead label="Ticket Performance" />
              {event.tickets.map((t, i) => (
                <div key={i} style={{ marginBottom: i < event.tickets.length - 1 ? '16px' : '0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div>
                      <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '700', color: C.text }}>{t.name}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: C.textMuted }}>{t.price === 0 ? 'Free' : `LKR ${t.price.toLocaleString()}`}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '700', color: C.text }}>{t.sold} / {t.inventory}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: C.success, fontWeight: '600' }}>{Math.round((t.sold / t.inventory) * 100)}% sold</p>
                    </div>
                  </div>
                  <div style={{ background: C.border, borderRadius: '100px', height: '5px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(t.sold / t.inventory) * 100}%`, background: t.price === 0 ? C.primary : C.secondary, borderRadius: '100px' }} />
                  </div>
                </div>
              ))}
            </Card>

            <Card>
              <SectionHead label="Merchandise" />
              {event.merch.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: C.textDim }}>
                  <p style={{ margin: 0, fontSize: '13px' }}>No merchandise for this event.</p>
                </div>
              ) : event.merch.map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: i < event.merch.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primary, flexShrink: 0 }}><Icon.Package size={14} /></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 2px', fontSize: '12px', fontWeight: '700', color: C.text }}>{m.name}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: C.textMuted }}>LKR {m.price.toLocaleString()} - {m.sold} sold</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 2px', fontSize: '12px', fontWeight: '700', color: C.success }}>LKR {(m.price * m.sold).toLocaleString()}</p>
                    <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: m.enabled ? C.successLight : C.neutral, color: m.enabled ? C.success : C.textMuted, fontWeight: '600' }}>{m.enabled ? 'Active' : 'Paused'}</span>
                  </div>
                </div>
              ))}
            </Card>

            <Card>
              <SectionHead label="Attendance" />
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0 }}>
                  <svg width="90" height="90" viewBox="0 0 90 90">
                    <circle cx="45" cy="45" r="38" fill="none" stroke={C.border} strokeWidth="8" />
                    <circle cx="45" cy="45" r="38" fill="none" stroke={C.success} strokeWidth="8" strokeDasharray={`${2 * Math.PI * 38}`} strokeDashoffset={`${2 * Math.PI * 38 * (1 - registrationPct / 100)}`} strokeLinecap="round" transform="rotate(-90 45 45)" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '16px', fontWeight: '800', color: C.text, lineHeight: 1 }}>{registrationPct}%</span>
                    <span style={{ fontSize: '9px', color: C.textMuted }}>filled</span>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  {[['Registered', event.registered, C.success], ['Remaining', event.capacity - event.registered, C.textMuted]].map(([label, val, col]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
                      <span style={{ fontSize: '12px', color: C.textMuted }}>{label}</span>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: col }}>{val}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span style={{ fontSize: '12px', color: C.textMuted }}>Total Capacity</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: C.text }}>{event.capacity}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <SectionHead label="Event Details" />
              <p style={{ margin: '0 0 14px', fontSize: '13px', color: C.textMuted, lineHeight: 1.8 }}>{event.description}</p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <TypeBadge type={event.type} />
                <span style={{ fontSize: '10px', padding: '3px 9px', borderRadius: '100px', background: C.primaryLight, color: C.primary, fontWeight: '600' }}>{event.category}</span>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'orders' && (
          <Card pad="0">
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: C.text, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recent Orders</h3>
              <span style={{ fontSize: '12px', color: C.textMuted }}>{mockOrders.length} orders shown</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 0.8fr 1fr 1fr', padding: '10px 20px', background: C.neutral, borderBottom: `1px solid ${C.border}` }}>
              {['Attendee', 'Item', 'Qty', 'Amount', 'Date'].map((h) => <span key={h} style={{ fontSize: '10px', fontWeight: '700', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</span>)}
            </div>
            {mockOrders.map((o, i) => (
              <div key={o.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 0.8fr 1fr 1fr', padding: '13px 20px', borderBottom: i < mockOrders.length - 1 ? `1px solid ${C.border}` : 'none', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600', color: C.text }}>{o.name}</p>
                  <p style={{ margin: 0, fontSize: '10px', color: C.textDim }}>{o.id}</p>
                </div>
                <span style={{ fontSize: '12px', color: C.textMuted }}>{o.item}</span>
                <span style={{ fontSize: '12px', color: C.text, fontWeight: '600' }}>x{o.qty}</span>
                <span style={{ fontSize: '12px', color: C.text, fontWeight: '700' }}>{o.amount === 0 ? 'Free' : `LKR ${o.amount.toLocaleString()}`}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', background: C.successLight, color: C.success, padding: '2px 8px', borderRadius: '100px' }}>{o.status}</span>
                </div>
              </div>
            ))}
          </Card>
        )}

        {activeTab === 'analytics' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            {[
              { label: 'Registrations this week', value: 47, sub: '+12% vs last week', color: C.success, chart: [20, 35, 28, 47, 40, 47, 47] },
              { label: 'Page Views', value: '1,284', sub: 'Since published', color: C.primary, chart: [180, 220, 290, 310, 280, 340, 400] },
              { label: 'Conversion Rate', value: '22.3%', sub: 'Views -> Registrations', color: C.secondary, chart: [18, 20, 22, 19, 23, 21, 22] },
            ].map((s) => (
              <Card key={s.label}>
                <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: '700', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
                <p style={{ margin: '0 0 2px', fontSize: '28px', fontWeight: '800', color: C.text, lineHeight: 1 }}>{s.value}</p>
                <p style={{ margin: '0 0 16px', fontSize: '11px', color: s.color, fontWeight: '600' }}>{s.sub}</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '48px' }}>
                  {s.chart.map((v, i) => {
                    const max = Math.max(...s.chart);
                    return <div key={i} style={{ flex: 1, background: i === s.chart.length - 1 ? s.color : `${s.color}30`, borderRadius: '3px 3px 0 0', height: `${(v / max) * 100}%` }} />;
                  })}
                </div>
              </Card>
            ))}
            <Card style={{ gridColumn: 'span 3' }}>
              <SectionHead label="Revenue Breakdown" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
                {[
                  { label: 'Ticket Revenue', value: event.tickets.reduce((a, t) => a + t.price * t.sold, 0), color: C.primary },
                  { label: 'Merch Revenue', value: event.merch.reduce((a, m) => a + m.price * m.sold, 0), color: C.secondary },
                  { label: 'Total Revenue', value: event.revenue, color: C.success },
                  { label: 'Avg. Order Value', value: event.orders > 0 ? Math.round(event.revenue / event.orders) : 0, color: C.warning },
                ].map((s) => (
                  <div key={s.label} style={{ background: C.neutral, borderRadius: '10px', padding: '16px', border: `1px solid ${C.border}` }}>
                    <p style={{ margin: '0 0 6px', fontSize: '11px', color: C.textMuted, fontWeight: '600' }}>{s.label}</p>
                    <p style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: s.color }}>LKR {s.value.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </OrganizerShell>
  );
}
