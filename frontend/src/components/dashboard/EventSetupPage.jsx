import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { C, FONT } from '../../constants/colors';
import { Icon } from '../common/Icon';
import OrganizerShell from './OrganizerShell';
import { useTheme } from '../../context/ThemeContext';

const EVENT_MAP = {
  1: {
    id: 1,
    title: 'IEEE Annual Tech Symposium 2026',
    description:
      'A day-long technology symposium bringing together students, faculty, and industry professionals to explore the frontiers of engineering and computing.',
    date: 'Mar 28, 2026',
    venue: 'Main Auditorium',
    type: 'Conference',
    capacity: 320,
    category: 'Technology',
  },
  2: {
    id: 2,
    title: 'Photography Workshop: Light & Composition',
    description:
      'An intensive hands-on workshop exploring natural light, composition theory, and practical shooting techniques for intermediate photographers.',
    date: 'Apr 10, 2026',
    venue: 'Seminar Room A',
    type: 'Workshop',
    capacity: 35,
    category: 'Arts & Culture',
  },
};

function Lbl({ children, required, hint, palette }) {
  const textMuted = palette?.textMuted ?? C.textMuted;
  const textDim = palette?.textDim ?? C.textDim;
  return (
    <div style={{ marginBottom: '7px' }}>
      <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', color: textMuted, fontFamily: FONT }}>
        {children}{required && <span style={{ color: C.secondary, marginLeft: 3 }}>*</span>}
      </label>
      {hint && <p style={{ margin: '3px 0 0', fontSize: '11px', color: textDim, fontFamily: FONT }}>{hint}</p>}
    </div>
  );
}

const getInputBase = (palette) => ({
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  border: `1.5px solid ${palette?.border ?? C.border}`,
  background: palette?.surface ?? C.white,
  color: palette?.text ?? C.text,
  fontSize: '13px',
  fontFamily: FONT,
  outline: 'none',
  boxSizing: 'border-box',
});

function Inp({ style = {}, palette, ...p }) {
  const iBase = getInputBase(palette);
  return <input style={{ ...iBase, ...style }} {...p} />;
}

function Txta({ style = {}, palette, ...p }) {
  const iBase = getInputBase(palette);
  return <textarea style={{ ...iBase, resize: 'vertical', ...style }} {...p} />;
}

function Sel({ children, style = {}, palette, ...p }) {
  const iBase = getInputBase(palette);
  return <select style={{ ...iBase, cursor: 'pointer', ...style }} {...p}>{children}</select>;
}

function Card({ children, style = {}, pad = '20px', palette, isDarkMode }) {
  const surface = palette?.surface ?? C.white;
  const border = palette?.border ?? C.border;
  const shadow = isDarkMode ? 'none' : '0 2px 12px rgba(5,54,104,.04)';
  return <div style={{ background: surface, borderRadius: '14px', border: `1px solid ${border}`, boxShadow: shadow, padding: pad, ...style }}>{children}</div>;
}

function SectionHead({ label, children, palette }) {
  const text = palette?.text ?? C.text;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
      <h3 style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: text, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</h3>
      {children}
    </div>
  );
}

function ToggleSwitch({ value, onChange, label, palette }) {
  const offBg = palette?.border ?? C.borderDark;
  const knob = palette?.surface ?? C.white;
  const textMuted = palette?.textMuted ?? C.textMuted;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <button type="button" onClick={() => onChange(!value)} style={{ position: 'relative', width: '40px', height: '22px', borderRadius: '100px', background: value ? C.primary : offBg, border: 'none', cursor: 'pointer', flexShrink: 0 }}>
        <span style={{ position: 'absolute', top: '3px', left: value ? '20px' : '3px', width: '16px', height: '16px', borderRadius: '50%', background: knob, boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
      </button>
      {label && <span style={{ fontSize: '12px', color: textMuted, fontFamily: FONT }}>{label}</span>}
    </div>
  );
}

export default function EventSetupPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isDarkMode } = useTheme();
  const event = EVENT_MAP[id] || EVENT_MAP[2];

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

  const [details, setDetails] = useState({
    title: event.title,
    description: event.description,
    capacity: event.capacity,
    category: event.category,
  });
  const [tickets, setTickets] = useState([{ id: 1, name: 'General Admission', price: '', inventory: '', enabled: true }]);
  const [merch, setMerch] = useState([]);
  const [activeTab, setActiveTab] = useState('details');

  const addTicket = () => setTickets((t) => [...t, { id: Date.now(), name: '', price: '', inventory: '', enabled: true }]);
  const removeTicket = (ticketId) => setTickets((t) => t.filter((x) => x.id !== ticketId));
  const updateTicket = (ticketId, field, val) => setTickets((t) => t.map((x) => (x.id === ticketId ? { ...x, [field]: val } : x)));

  const addMerch = () => setMerch((m) => [...m, { id: Date.now(), name: '', price: '', inventory: '', enabled: true }]);
  const removeMerch = (itemId) => setMerch((m) => m.filter((x) => x.id !== itemId));
  const updateMerch = (itemId, field, val) => setMerch((m) => m.map((x) => (x.id === itemId ? { ...x, [field]: val } : x)));

  const checks = [
    { label: 'Event title filled', done: !!details.title },
    { label: 'Description added', done: details.description.length > 30 },
    { label: 'Capacity set', done: !!details.capacity && details.capacity > 0 },
    { label: 'Category selected', done: !!details.category },
    { label: 'At least one ticket', done: tickets.length > 0 && tickets.some((t) => t.name && t.inventory) },
  ];
  const allDone = checks.every((c) => c.done);
  const doneCount = checks.filter((c) => c.done).length;

  const tabs = [
    { key: 'details', label: 'Event Details', icon: <Icon.FileText size={14} /> },
    { key: 'tickets', label: 'Tickets & Merch', icon: <Icon.Ticket size={14} /> },
    { key: 'review', label: 'Review & Publish', icon: <Icon.CheckCircle size={14} /> },
  ];

  return (
    <OrganizerShell page="events">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: FONT }}>
        <div style={{ background: `linear-gradient(135deg, ${C.primary} 0%, #0a4f96 100%)`, padding: '24px 36px', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,.04)' }} />
          <button onClick={() => navigate('/my-events')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)', cursor: 'pointer', color: 'rgba(255,255,255,.8)', fontSize: '12px', fontWeight: '600', padding: '6px 12px', borderRadius: '8px', marginBottom: '14px' }}>
            <Icon.ArrowLeft size={14} /> My Events
          </button>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(74,222,128,.16)', border: '1px solid rgba(74,222,128,.3)', borderRadius: '100px', padding: '4px 12px', marginBottom: '10px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'block' }} />
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#4ade80', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Approved - Setup Required</span>
              </div>
              <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '800', color: C.white, letterSpacing: '-0.02em' }}>{event.title}</h1>
              <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,.6)' }}>{event.date} - {event.venue}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '12px', padding: '14px 20px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: allDone ? '#4ade80' : C.white, lineHeight: 1 }}>{doneCount}/{checks.length}</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '4px 0 8px' }}>Setup Done</div>
              <div style={{ background: 'rgba(255,255,255,.15)', borderRadius: '100px', height: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(doneCount / checks.length) * 100}%`, background: allDone ? '#4ade80' : C.secondary, borderRadius: '100px' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2px', marginTop: '20px' }}>
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 18px', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: activeTab === tab.key ? '700' : '500', background: activeTab === tab.key ? palette.surface : 'rgba(255,255,255,.08)', color: activeTab === tab.key ? C.primary : 'rgba(255,255,255,.6)' }}>
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 36px', display: 'flex', flexDirection: 'column', gap: '20px', background: palette.pageBg }}>
          {activeTab === 'details' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Card palette={palette} isDarkMode={isDarkMode}>
                  <SectionHead label="Event Details" palette={palette} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                      <Lbl required palette={palette}>Event Title</Lbl>
                      <Inp palette={palette} value={details.title} onChange={(e) => setDetails((d) => ({ ...d, title: e.target.value }))} placeholder="Enter event title..." />
                    </div>
                    <div>
                      <Lbl required hint="Min. 30 characters for a complete description." palette={palette}>Full Description</Lbl>
                      <Txta palette={palette} rows={5} value={details.description} onChange={(e) => setDetails((d) => ({ ...d, description: e.target.value }))} placeholder="Describe the event in detail..." />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <Lbl required palette={palette}>Capacity</Lbl>
                        <Inp palette={palette} type="number" value={details.capacity} onChange={(e) => setDetails((d) => ({ ...d, capacity: e.target.value }))} placeholder="e.g. 250" />
                      </div>
                      <div>
                        <Lbl required palette={palette}>Category</Lbl>
                        <Sel palette={palette} value={details.category} onChange={(e) => setDetails((d) => ({ ...d, category: e.target.value }))}>
                          <option value="">Select category...</option>
                          {['Technology', 'Arts & Culture', 'Sports', 'University Life', 'Professional Development', 'Social'].map((c) => <option key={c} value={c}>{c}</option>)}
                        </Sel>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card palette={palette} isDarkMode={isDarkMode}>
                  <SectionHead label="Event Banner" palette={palette} />
                  <div style={{ border: `2px dashed ${palette.border}`, borderRadius: '10px', padding: '40px 24px', textAlign: 'center', background: palette.surfaceAlt, cursor: 'pointer' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: C.primary }}><Icon.Image size={22} /></div>
                    <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '700', color: palette.text }}>Upload Banner Image</p>
                    <p style={{ margin: '0 0 14px', fontSize: '11px', color: palette.textMuted }}>Recommended: 1200x628px, JPG or PNG, max 4MB</p>
                    <button style={{ padding: '8px 20px', background: C.primary, color: C.white, border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Choose File</button>
                  </div>
                </Card>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <Card style={{ background: isDarkMode ? 'rgba(74,222,128,.16)' : C.successLight, border: `1px solid ${isDarkMode ? 'rgba(74,222,128,.3)' : 'rgba(27,127,75,.2)'}` }} palette={palette} isDarkMode={isDarkMode}>
                  <p style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: '800', color: C.success }}>Event Approved</p>
                  <p style={{ margin: 0, fontSize: '12px', color: `${C.success}cc`, lineHeight: 1.6 }}>Your event has been approved by the university. Complete setup to publish it for attendees.</p>
                </Card>
                <Card palette={palette} isDarkMode={isDarkMode}>
                  <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: '700', color: palette.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Writing Tips</p>
                  {['Keep your title clear and specific', 'Add a detailed agenda in the description', 'Set accurate capacity to avoid overbooked venues', 'Upload a high-quality banner to attract attendees'].map((tip, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: i < 3 ? '10px' : '0' }}>
                      <span style={{ color: C.secondary, display: 'flex', marginTop: '1px' }}><Icon.Check size={11} /></span>
                      <span style={{ fontSize: '11px', color: palette.textMuted, lineHeight: 1.5 }}>{tip}</span>
                    </div>
                  ))}
                </Card>
                <button onClick={() => setActiveTab('tickets')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '11px', background: C.primary, color: C.white, border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(5,54,104,.2)' }}>
                  Next: Tickets & Merch <Icon.ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <Card palette={palette} isDarkMode={isDarkMode}>
                <SectionHead label="Tickets" palette={palette}>
                  <button onClick={addTicket} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: isDarkMode ? 'rgba(96,165,250,.16)' : C.primaryLight, color: palette.text, border: `1px solid ${isDarkMode ? 'rgba(96,165,250,.35)' : `${C.primary}30`}`, borderRadius: '7px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                    <Icon.Plus size={12} /> Add Ticket
                  </button>
                </SectionHead>
                {tickets.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px 16px', border: `1.5px dashed ${palette.border}`, borderRadius: '10px' }}>
                    <Icon.Ticket size={24} style={{ margin: '0 auto 10px', color: palette.textDim }} />
                    <p style={{ margin: 0, fontSize: '12px', color: palette.textMuted }}>No tickets yet. Add one to get started.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {tickets.map((ticket) => (
                      <div key={ticket.id} style={{ background: palette.surfaceAlt, borderRadius: '10px', padding: '14px 16px', border: `1px solid ${palette.border}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <ToggleSwitch value={ticket.enabled} onChange={(v) => updateTicket(ticket.id, 'enabled', v)} label={ticket.enabled ? 'Enabled' : 'Disabled'} palette={palette} />
                          <button onClick={() => removeTicket(ticket.id)} style={{ background: 'none', border: 'none', color: palette.textDim, cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}>x</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div><Lbl required palette={palette}>Ticket Name</Lbl><Inp palette={palette} value={ticket.name} onChange={(e) => updateTicket(ticket.id, 'name', e.target.value)} placeholder="e.g. General Admission" /></div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div><Lbl palette={palette}>Price (LKR)</Lbl><Inp palette={palette} type="number" value={ticket.price} onChange={(e) => updateTicket(ticket.id, 'price', e.target.value)} placeholder="0 = Free" /></div>
                            <div><Lbl required palette={palette}>Inventory</Lbl><Inp palette={palette} type="number" value={ticket.inventory} onChange={(e) => updateTicket(ticket.id, 'inventory', e.target.value)} placeholder="e.g. 200" /></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card palette={palette} isDarkMode={isDarkMode}>
                <SectionHead label="Merchandise" palette={palette}>
                  <button onClick={addMerch} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: isDarkMode ? 'rgba(96,165,250,.16)' : C.primaryLight, color: palette.text, border: `1px solid ${isDarkMode ? 'rgba(96,165,250,.35)' : `${C.primary}30`}`, borderRadius: '7px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                    <Icon.Plus size={12} /> Add Item
                  </button>
                </SectionHead>
                {merch.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px 16px', border: `1.5px dashed ${palette.border}`, borderRadius: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', color: palette.textDim }}><Icon.Package size={24} /></div>
                    <p style={{ margin: 0, fontSize: '12px', color: palette.textMuted }}>No merchandise yet. Add items to sell at your event.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {merch.map((item) => (
                      <div key={item.id} style={{ background: palette.surfaceAlt, borderRadius: '10px', padding: '14px 16px', border: `1px solid ${palette.border}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <ToggleSwitch value={item.enabled} onChange={(v) => updateMerch(item.id, 'enabled', v)} label={item.enabled ? 'Available' : 'Unavailable'} palette={palette} />
                          <button onClick={() => removeMerch(item.id)} style={{ background: 'none', border: 'none', color: palette.textDim, cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}>x</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div><Lbl required palette={palette}>Item Name</Lbl><Inp palette={palette} value={item.name} onChange={(e) => updateMerch(item.id, 'name', e.target.value)} placeholder="e.g. Event T-Shirt" /></div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div><Lbl required palette={palette}>Price (LKR)</Lbl><Inp palette={palette} type="number" value={item.price} onChange={(e) => updateMerch(item.id, 'price', e.target.value)} placeholder="e.g. 750" /></div>
                            <div><Lbl required palette={palette}>Inventory</Lbl><Inp palette={palette} type="number" value={item.inventory} onChange={(e) => updateMerch(item.id, 'inventory', e.target.value)} placeholder="e.g. 50" /></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          {activeTab === 'review' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px', alignItems: 'start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Card palette={palette} isDarkMode={isDarkMode}>
                  <SectionHead label="Validation Checklist" palette={palette} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {checks.map((c, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '8px', background: c.done ? (isDarkMode ? 'rgba(74,222,128,.16)' : C.successLight) : palette.surfaceAlt, border: `1px solid ${c.done ? (isDarkMode ? 'rgba(74,222,128,.3)' : 'rgba(27,127,75,.15)') : palette.border}` }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: c.done ? C.success : palette.border, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {c.done ? <span style={{ color: C.white, display: 'flex' }}><Icon.Check size={11} /></span> : <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: palette.textDim, display: 'block' }} />}
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: c.done ? palette.text : palette.textMuted }}>{c.label}</span>
                        {!c.done && <span style={{ marginLeft: 'auto', fontSize: '10px', color: C.warning, fontWeight: '700', background: isDarkMode ? 'rgba(251,191,36,.16)' : C.warningLight, padding: '2px 8px', borderRadius: '100px' }}>Required</span>}
                      </div>
                    ))}
                  </div>
                </Card>

                <Card palette={palette} isDarkMode={isDarkMode}>
                  <SectionHead label="Event Summary Preview" palette={palette} />
                  <div style={{ border: `1px solid ${palette.border}`, borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ height: '100px', background: `linear-gradient(135deg, ${isDarkMode ? '#1F2937' : C.primaryLight} 0%, ${isDarkMode ? '#0B1324' : C.border} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: palette.textDim, display: 'flex' }}><Icon.Image size={28} /></span>
                    </div>
                    <div style={{ padding: '16px' }}>
                      <h4 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: '800', color: palette.text }}>{details.title || 'Event Title'}</h4>
                      <p style={{ margin: '0 0 12px', fontSize: '12px', color: palette.textMuted, lineHeight: 1.6 }}>{details.description ? `${details.description.slice(0, 120)}...` : 'No description added yet.'}</p>
                      <div style={{ display: 'flex', gap: '14px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: palette.textMuted }}><Icon.Calendar size={11} /> {event.date}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: palette.textMuted }}><Icon.MapPin size={11} /> {event.venue}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: palette.textMuted }}><Icon.Users size={11} /> {details.capacity || '-'} capacity</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Card style={{ background: allDone ? `linear-gradient(135deg, ${C.primary} 0%, #0a4f96 100%)` : palette.surfaceAlt, border: allDone ? 'none' : `1px solid ${palette.border}` }} palette={palette} isDarkMode={isDarkMode}>
                  <div style={{ textAlign: 'center', padding: '8px 0' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: allDone ? 'rgba(255,255,255,.15)' : palette.border, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: allDone ? C.white : palette.textDim }}>
                      <Icon.CheckCircle size={24} />
                    </div>
                    <p style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: '800', color: allDone ? C.white : palette.text }}>{allDone ? 'Ready to Publish!' : 'Setup Incomplete'}</p>
                    <p style={{ margin: '0 0 20px', fontSize: '12px', color: allDone ? 'rgba(255,255,255,.65)' : palette.textMuted, lineHeight: 1.6 }}>{allDone ? 'All requirements met. Click publish to make your event live for students.' : `Complete ${checks.length - doneCount} remaining item${checks.length - doneCount !== 1 ? 's' : ''} to enable publishing.`}</p>
                    <button onClick={() => allDone && navigate(`/my-events/${event.id}/published`)} disabled={!allDone} style={{ width: '100%', padding: '13px', background: allDone ? C.secondary : palette.border, color: allDone ? C.white : palette.textDim, border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '800', cursor: allDone ? 'pointer' : 'not-allowed', boxShadow: allDone ? '0 6px 20px rgba(255,113,0,.4)' : 'none', letterSpacing: '0.02em' }}>
                      {allDone ? 'Publish Event' : `Complete Setup (${doneCount}/${checks.length})`}
                    </button>
                  </div>
                </Card>

                <Card palette={palette} isDarkMode={isDarkMode}>
                  <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: '700', color: palette.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Quick Navigation</p>
                  {[['details', 'Event Details', <Icon.FileText size={14} />], ['tickets', 'Tickets & Merch', <Icon.Ticket size={14} />]].map(([key, label, icon]) => (
                    <button key={key} onClick={() => setActiveTab(key)} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', background: palette.surfaceAlt, border: `1px solid ${palette.border}`, borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', color: palette.text, textAlign: 'left' }}>
                      <span style={{ color: C.primary, display: 'flex' }}>{icon}</span>{label}<span style={{ marginLeft: 'auto', color: palette.textDim, display: 'flex' }}><Icon.ChevronRight size={12} /></span>
                    </button>
                  ))}
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </OrganizerShell>
  );
}
