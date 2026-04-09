import React, { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { C, FONT } from '../../constants/colors';
import { Icon } from '../common/Icon';
import OrganizerShell from './OrganizerShell';

function Tab({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: 'none',
        background: 'none',
        fontSize: '12px',
        fontWeight: '700',
        color: active ? C.primary : C.textMuted,
        padding: '0 0 10px',
        cursor: 'pointer',
        borderBottom: active ? `2px solid ${C.secondary}` : '2px solid transparent',
        fontFamily: FONT,
      }}
    >
      {children}
    </button>
  );
}

function StatusPill({ type, children }) {
  const map = {
    pending: { bg: C.warningLight, color: C.warning, border: C.warning },
    paid: { bg: C.primaryLight, color: C.primary, border: C.border },
    collected: { bg: C.successLight, color: C.success, border: '#A7D7BE' },
  };
  const s = map[type] || map.pending;
  return (
    <span
      style={{
        fontSize: '9px',
        fontWeight: '700',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        padding: '3px 8px',
        borderRadius: '999px',
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        fontFamily: FONT,
      }}
    >
      {children}
    </span>
  );
}

function ProductCard({ title, price, desc, soldOut, onClick }) {
  return (
    <div onClick={onClick} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(5,54,104,.05)', cursor: 'pointer' }}>
      <div style={{ height: '108px', background: soldOut ? 'linear-gradient(135deg,#dce6f5,#f2f5fb)' : 'linear-gradient(135deg,#1b232f,#334155)', position: 'relative' }}>
        <span style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '9px', fontWeight: '700', color: C.white, background: soldOut ? C.secondary : C.success, borderRadius: '999px', padding: '2px 7px', letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: FONT }}>{soldOut ? 'Low Stock' : 'In Stock'}</span>
      </div>
      <div style={{ padding: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '6px' }}>
          <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: C.text, fontFamily: FONT }}>{title}</p>
          <span style={{ fontSize: '11px', fontWeight: '800', color: C.secondary, fontFamily: FONT }}>{price}</span>
        </div>
        <p style={{ margin: '0 0 9px', fontSize: '10px', color: C.textMuted, lineHeight: 1.5, fontFamily: FONT }}>{desc}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', color: C.textDim, fontFamily: FONT }}>Public visibility</span>
          <button style={{ width: '30px', height: '16px', borderRadius: '999px', border: 'none', background: C.secondary, position: 'relative', cursor: 'pointer' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: C.white, position: 'absolute', right: '2px', top: '2px' }} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MerchandiseOrdersPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileRef = useRef(null);

  const [page, setPage] = useState('merchandise');
  const [context, setContext] = useState(null);
  const [filter, setFilter] = useState('all');
  const [preview, setPreview] = useState(null);
  const [visible, setVisible] = useState(true);

  const go = (nextPage, ctx = null) => {
    setContext(ctx);
    setPage(nextPage);
  };

  const products = [
    { id: 1, name: 'Annual Gala T-Shirt', price: '$18.00', desc: 'Premium 100% cotton, unisex fit with modern cut.', soldOut: false },
    { id: 2, name: 'NEXORA Elite Hoodie', price: '$45.00', desc: 'Heavyweight fleece with embroidered logo on chest.', soldOut: true },
  ];

  const rows = [
    { id: 1, delegate: 'Alex Thompson', item: 'Annual Gala T-Shirt', size: 'M', date: 'Oct 12, 2023', status: 'paid', action: 'Mark Collected' },
    { id: 2, delegate: 'Sarah Chen', item: 'NEXORA Elite Hoodie', size: 'L', date: 'Oct 11, 2023', status: 'collected', action: 'Picked Up' },
    { id: 3, delegate: 'Marcus Johnson', item: 'Annual Gala T-Shirt', size: 'XL', date: 'Oct 10, 2023', status: 'pending', action: 'Process Payment' },
    { id: 4, delegate: 'Elena Rodriguez', item: 'NEXORA Elite Hoodie', size: 'S', date: 'Oct 09, 2023', status: 'paid', action: 'Mark Collected' },
  ];

  const filteredRows = rows.filter((r) => (filter === 'all' ? true : r.status === filter));

  const stockRows = [
    { id: 11, name: 'Nexora Heavy Hoodie', category: 'Apparel', stock: 242, sold: 158, status: 'in_stock' },
    { id: 12, name: 'Steel Water Bottle', category: 'Lifestyle', stock: 12, sold: 89, status: 'low_stock' },
    { id: 13, name: 'Canvas Tote Bag', category: 'Accessories', stock: 0, sold: 312, status: 'out_stock' },
  ];

  const slotRows = [
    { id: 21, date: 'Oct 12', label: 'Morning Rush Window', time: '09:00 AM - 11:30 AM', loc: 'Student Union', assigned: 40, total: 40, hot: true },
    { id: 22, date: 'Oct 12', label: 'Afternoon Distributed', time: '01:00 PM - 04:00 PM', loc: 'Student Union', assigned: 12, total: 30, hot: false },
    { id: 23, date: 'Oct 13', label: 'North Campus Session', time: '10:00 AM - 02:00 PM', loc: 'Library Hub', assigned: 0, total: 30, hot: false },
  ];

  const selectedOrder = context || rows[0];
  const selectedProduct = context || { name: 'Academic Excellence Hoodie', sku: 'NXR-HD-NAVY-001', description: 'Premium heavyweight fleece with university-grade embroidery.', price: '65.00', stock: '142' };

  const renderMerchandisePage = () => (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '28px', lineHeight: 1.1, color: C.primary, fontWeight: '800', letterSpacing: '-0.03em', fontFamily: FONT }}>Merchandise Store & Orders</h1>
          <p style={{ margin: 0, fontSize: '12px', color: C.textMuted, fontFamily: FONT }}>Control inventory for event apparel and monitor student fulfillment status.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ border: 'none', borderRadius: '8px', background: C.secondary, color: C.white, fontSize: '11px', fontWeight: '700', padding: '9px 14px', cursor: 'pointer', fontFamily: FONT }}>Scan QR to Collect</button>
          <button onClick={() => go('create_product')} style={{ border: `1px solid ${C.secondary}66`, borderRadius: '8px', background: C.white, color: C.secondary, fontSize: '11px', fontWeight: '700', padding: '9px 14px', cursor: 'pointer', fontFamily: FONT }}>+ Add New Product</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '14px' }}>
        <Tab active>Product Listings</Tab>
        <Tab onClick={() => go('reports')}>Sales Insights</Tab>
        <Tab onClick={() => go('inventory')}>Stock Control</Tab>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '14px' }}>
        {products.map((p) => (
          <ProductCard key={p.id} title={p.name} price={p.price} desc={p.desc} soldOut={p.soldOut} onClick={() => go('product_detail', p)} />
        ))}
        <div onClick={() => go('create_product')} style={{ border: `1px dashed ${C.border}`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '203px', background: '#FAFCFF', cursor: 'pointer' }}>
          <button style={{ border: 'none', background: 'none', color: C.textDim, fontSize: '11px', fontWeight: '700', cursor: 'pointer', fontFamily: FONT }}>Create New Listing</button>
        </div>
      </div>

      <section style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ margin: 0, fontSize: '12px', fontWeight: '800', color: C.primary, fontFamily: FONT }}>Fulfillment Dashboard</p>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[['all', 'All'], ['pending', 'Pending'], ['paid', 'Paid'], ['collected', 'Collected']].map(([key, label]) => (
              <button key={key} onClick={() => setFilter(key)} style={{ border: `1px solid ${filter === key ? C.primary : C.border}`, borderRadius: '999px', background: filter === key ? C.primaryLight : C.white, color: filter === key ? C.primary : C.textMuted, fontSize: '9px', fontWeight: '700', padding: '3px 8px', cursor: 'pointer', fontFamily: FONT }}>{label}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.3fr .5fr .9fr .8fr 1fr', gap: '8px', padding: '8px 12px', borderBottom: `1px solid ${C.border}`, background: '#F9FBFE' }}>
          {['Student Name', 'Item Ordered', 'Size', 'Order Date', 'Flow Status', 'Fulfillment'].map((h) => (
            <span key={h} style={{ fontSize: '9px', color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700', fontFamily: FONT }}>{h}</span>
          ))}
        </div>

        {filteredRows.map((r, idx) => (
          <div key={r.id} onClick={() => go('order_detail', r)} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.3fr .5fr .9fr .8fr 1fr', gap: '8px', padding: '9px 12px', borderBottom: idx === filteredRows.length - 1 ? 'none' : `1px solid ${C.border}`, alignItems: 'center', cursor: 'pointer' }}>
            <span style={{ fontSize: '11px', color: C.text, fontWeight: '600', fontFamily: FONT }}>{r.delegate}</span>
            <span style={{ fontSize: '11px', color: C.textMuted, fontFamily: FONT }}>{r.item}</span>
            <span style={{ fontSize: '11px', color: C.textMuted, fontFamily: FONT }}>{r.size}</span>
            <span style={{ fontSize: '11px', color: C.textMuted, fontFamily: FONT }}>{r.date}</span>
            <StatusPill type={r.status}>{r.status}</StatusPill>
            <button onClick={(e) => e.stopPropagation()} style={{ justifySelf: 'start', border: 'none', borderRadius: '6px', background: r.action === 'Picked Up' ? C.successLight : r.action === 'Process Payment' ? C.neutral : C.secondary, color: r.action === 'Picked Up' ? C.success : r.action === 'Process Payment' ? C.textMuted : C.white, borderColor: C.border, fontSize: '9px', fontWeight: '700', padding: '5px 8px', cursor: 'pointer', fontFamily: FONT }}>{r.action}</button>
          </div>
        ))}

        <div style={{ padding: '8px 12px', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '9px', color: C.textDim, fontFamily: FONT }}>Showing {filteredRows.length} of 128 orders</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button style={{ width: '18px', height: '18px', border: `1px solid ${C.border}`, background: C.white, borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}>{'<'}</button>
            <button style={{ width: '18px', height: '18px', border: `1px solid ${C.border}`, background: C.white, borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}>{'>'}</button>
          </div>
        </div>
      </section>
    </>
  );

  const renderInventoryPage = () => (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '26px', color: C.text, fontWeight: '800' }}>Central Stock Control</h1>
          <p style={{ margin: 0, fontSize: '12px', color: C.textMuted }}>Monitor turnover rates and manage procurement with real-time stock updates.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ border: `1px solid ${C.border}`, borderRadius: '8px', background: C.white, color: C.textMuted, fontSize: '11px', fontWeight: '700', padding: '9px 14px', cursor: 'pointer', fontFamily: FONT }}>Export</button>
          <button onClick={() => go('create_product')} style={{ border: 'none', borderRadius: '8px', background: C.primary, color: C.white, fontSize: '11px', fontWeight: '700', padding: '9px 14px', cursor: 'pointer', fontFamily: FONT }}>Add Product</button>
        </div>
      </div>

      <div style={{ background: C.white, borderRadius: '14px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '10px 16px', background: C.neutral, borderBottom: `1px solid ${C.border}` }}>
          {['Product', 'Category', 'Stock', 'Sold (30d)', 'Status'].map((h) => <span key={h} style={{ fontSize: '10px', fontWeight: '700', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</span>)}
        </div>
        {stockRows.map((s, i) => {
          const statusMeta = s.status === 'out_stock'
            ? { label: 'Out Stock', bg: C.errorLight, color: C.error }
            : s.status === 'low_stock'
              ? { label: 'Low Stock', bg: C.warningLight, color: C.warning }
              : { label: 'In Stock', bg: C.successLight, color: C.success };
          return (
            <div key={s.id} onClick={() => go('product_detail', s)} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '12px 16px', borderBottom: i === stockRows.length - 1 ? 'none' : `1px solid ${C.border}`, alignItems: 'center', cursor: 'pointer' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: C.text }}>{s.name}</span>
              <span style={{ fontSize: '12px', color: C.textMuted }}>{s.category}</span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: s.stock < 20 ? C.warning : C.text }}>{s.stock}</span>
              <span style={{ fontSize: '12px', color: C.textMuted }}>{s.sold}</span>
              <span style={{ width: 'fit-content', fontSize: '10px', fontWeight: '700', padding: '3px 9px', borderRadius: '100px', background: statusMeta.bg, color: statusMeta.color }}>{statusMeta.label}</span>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '14px' }}>
        <button onClick={() => go('reports')} style={{ border: `1px solid ${C.border}`, borderRadius: '8px', background: C.white, color: C.primary, fontSize: '12px', fontWeight: '700', padding: '9px 14px', cursor: 'pointer', fontFamily: FONT }}>Open Reports</button>
        <button onClick={() => go('pickup_slots')} style={{ border: 'none', borderRadius: '8px', background: C.secondary, color: C.white, fontSize: '12px', fontWeight: '700', padding: '9px 14px', cursor: 'pointer', fontFamily: FONT }}>Manage Pickup Slots</button>
      </div>
    </>
  );

  const renderReportsPage = () => (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '26px', color: C.text, fontWeight: '800' }}>Sales Insights & Revenue Growth</h1>
          <p style={{ margin: 0, fontSize: '12px', color: C.textMuted }}>Track revenue performance and identify top-demand products.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '14px' }}>
        {[
          ['Total Revenue', '$428,190', '+12.4%'],
          ['New Customers', '1,842', 'Q3 peak'],
          ['Annual Target', '82%', '$100k goal'],
        ].map(([k, v, sub], idx) => (
          <div key={k} style={{ background: idx === 1 ? C.primary : C.white, border: idx === 2 ? `1px solid ${C.terDark}` : `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
            <p style={{ margin: '0 0 6px', fontSize: '10px', fontWeight: '700', color: idx === 1 ? 'rgba(255,255,255,.6)' : C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{k}</p>
            <p style={{ margin: '0 0 4px', fontSize: '30px', fontWeight: '800', color: idx === 1 ? C.white : C.text }}>{v}</p>
            <p style={{ margin: 0, fontSize: '11px', color: idx === 1 ? 'rgba(255,255,255,.6)' : C.textMuted }}>{sub}</p>
          </div>
        ))}
      </div>

      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
        <p style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: '700', color: C.text }}>High Demand Products</p>
        {[
          ['Signature Tech-Tee', 2410],
          ['Urban Commuter Pack', 1890],
          ['Slate Glass Tumbler', 1460],
          ['Bamboo Notebook', 920],
        ].map(([name, sold]) => (
          <div key={name} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', color: C.text, fontWeight: '600' }}>{name}</span>
              <span style={{ fontSize: '11px', color: C.textMuted }}>{sold.toLocaleString()} Sold</span>
            </div>
            <div style={{ background: C.neutral, borderRadius: '100px', height: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(sold / 2410) * 100}%`, background: C.secondary }} />
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderOrderDetailPage = () => (
    <>
      <button onClick={() => go('merchandise')} style={{ border: 'none', background: 'none', color: C.textMuted, fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', marginBottom: '8px', fontFamily: FONT }}>
        {'<'} Back to Orders
      </button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '24px', color: C.text, fontWeight: '800' }}>Order #{String(selectedOrder.id).padStart(4, '0')}</h1>
          <p style={{ margin: 0, fontSize: '12px', color: C.textMuted }}>Review student details and update fulfillment status.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ border: 'none', borderRadius: '8px', background: C.secondary, color: C.white, fontSize: '11px', fontWeight: '700', padding: '9px 14px', cursor: 'pointer', fontFamily: FONT }}>Mark as Paid</button>
          <button style={{ border: 'none', borderRadius: '8px', background: C.primary, color: C.white, fontSize: '11px', fontWeight: '700', padding: '9px 14px', cursor: 'pointer', fontFamily: FONT }}>Mark Collected</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '14px' }}>
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
          <p style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: '700', color: C.text }}>Student Profile</p>
          <p style={{ margin: '0 0 2px', fontSize: '15px', fontWeight: '800', color: C.text }}>{selectedOrder.delegate}</p>
          <p style={{ margin: '0 0 12px', fontSize: '11px', color: C.textMuted }}>ID: 2024-{String(selectedOrder.id).padStart(4, '0')}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontSize: '11px', color: C.textMuted }}>Payment</span>
            <StatusPill type={selectedOrder.status}>{selectedOrder.status}</StatusPill>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span style={{ fontSize: '11px', color: C.textMuted }}>Pickup</span>
            <span style={{ fontSize: '10px', fontWeight: '700', background: C.errorLight, color: C.error, padding: '3px 8px', borderRadius: '100px' }}>Not Collected</span>
          </div>
        </div>

        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
          <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '700', color: C.text }}>Ordered Item</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: `1px solid ${C.border}` }}>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '700', color: C.text }}>{selectedOrder.item}</p>
              <p style={{ margin: 0, fontSize: '11px', color: C.textMuted }}>Size {selectedOrder.size} • {selectedOrder.date}</p>
            </div>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: C.text }}>$45.00</p>
          </div>
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: C.textMuted }}>Total Amount</span>
            <span style={{ fontSize: '14px', color: C.text, fontWeight: '800' }}>$45.00</span>
          </div>
          <button onClick={() => go('pickup_slots')} style={{ marginTop: '14px', border: 'none', borderRadius: '8px', background: C.primary, color: C.white, fontSize: '11px', fontWeight: '700', padding: '9px 14px', cursor: 'pointer', fontFamily: FONT }}>Assign Pickup Slot</button>
        </div>
      </div>
    </>
  );

  const renderProductDetailPage = () => (
    <>
      <button onClick={() => go('inventory')} style={{ border: 'none', background: 'none', color: C.textMuted, fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', marginBottom: '8px', fontFamily: FONT }}>
        {'<'} Back to Catalog
      </button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '24px', color: C.text, fontWeight: '800' }}>{selectedProduct.name || 'Product Detail'}</h1>
          <p style={{ margin: 0, fontSize: '12px', color: C.textMuted }}>Edit pricing, stock, and visibility in one place.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ border: `1px solid ${C.error}`, borderRadius: '8px', background: C.errorLight, color: C.error, fontSize: '11px', fontWeight: '700', padding: '9px 14px', cursor: 'pointer', fontFamily: FONT }}>Delete</button>
          <button style={{ border: 'none', borderRadius: '8px', background: C.primary, color: C.white, fontSize: '11px', fontWeight: '700', padding: '9px 14px', cursor: 'pointer', fontFamily: FONT }}>Save Changes</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '14px' }}>
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
          <p style={{ margin: '0 0 8px', fontSize: '11px', color: C.textMuted, fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Availability</p>
          <p style={{ margin: '0 0 8px', fontSize: '12px', color: C.success, fontWeight: '700' }}>In Stock</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: C.textMuted }}>Visible in Store</span>
            <button onClick={() => setVisible((v) => !v)} style={{ width: '36px', height: '20px', borderRadius: '999px', border: 'none', cursor: 'pointer', background: visible ? C.secondary : C.border, position: 'relative' }}>
              <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: C.white, position: 'absolute', top: '3px', left: visible ? '19px' : '3px' }} />
            </button>
          </div>
        </div>

        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input defaultValue={selectedProduct.name} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${C.border}`, fontFamily: FONT, fontSize: '12px' }} />
            <input defaultValue={selectedProduct.sku || 'NXR-001'} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${C.border}`, fontFamily: FONT, fontSize: '12px' }} />
            <input defaultValue={selectedProduct.price || '45.00'} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${C.border}`, fontFamily: FONT, fontSize: '12px' }} />
            <input defaultValue={selectedProduct.stock || '120'} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${C.border}`, fontFamily: FONT, fontSize: '12px' }} />
          </div>
          <textarea defaultValue={selectedProduct.description || 'Premium product description'} rows={4} style={{ width: '100%', marginTop: '10px', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${C.border}`, fontFamily: FONT, fontSize: '12px', resize: 'vertical' }} />
        </div>
      </div>
    </>
  );

  const renderPickupSlotsPage = () => (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '24px', color: C.text, fontWeight: '800' }}>Pickup Slot Management</h1>
          <p style={{ margin: 0, fontSize: '12px', color: C.textMuted }}>Schedule and monitor merch pickup windows across campus.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '14px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {slotRows.map((slot) => {
            const pct = Math.round((slot.assigned / slot.total) * 100);
            return (
              <div key={slot.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: C.text }}>{slot.label}</p>
                  {slot.hot && <span style={{ fontSize: '10px', color: C.white, background: C.error, borderRadius: '100px', padding: '2px 8px', fontWeight: '700' }}>HOT</span>}
                </div>
                <p style={{ margin: '0 0 6px', fontSize: '11px', color: C.textMuted }}>{slot.date} • {slot.time} • {slot.loc}</p>
                <div style={{ background: C.neutral, borderRadius: '100px', height: '5px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: pct > 90 ? C.error : pct > 60 ? C.secondary : C.success }} />
                </div>
                <p style={{ margin: '6px 0 0', fontSize: '10px', color: C.textDim }}>Orders Assigned {slot.assigned}/{slot.total}</p>
              </div>
            );
          })}
        </div>

        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '14px', alignSelf: 'start' }}>
          <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '700', color: C.text }}>Create New Slot</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input type="date" style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: `1px solid ${C.border}`, fontFamily: FONT, fontSize: '12px' }} />
            <input type="time" style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: `1px solid ${C.border}`, fontFamily: FONT, fontSize: '12px' }} />
            <input type="time" style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: `1px solid ${C.border}`, fontFamily: FONT, fontSize: '12px' }} />
            <input placeholder="Location" defaultValue="Main Student Union - East Wing" style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: `1px solid ${C.border}`, fontFamily: FONT, fontSize: '12px' }} />
            <button style={{ border: 'none', borderRadius: '8px', background: C.primary, color: C.white, fontSize: '11px', fontWeight: '700', padding: '9px 14px', cursor: 'pointer', fontFamily: FONT }}>Schedule Slot</button>
          </div>
        </div>
      </div>
    </>
  );

  const renderCreateProductPage = () => (
    <>
      <button onClick={() => go('merchandise')} style={{ border: 'none', background: 'none', color: C.textMuted, fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', marginBottom: '8px', fontFamily: FONT }}>
        {'<'} Back to Merchandise
      </button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '24px', color: C.text, fontWeight: '800' }}>Create New Product</h1>
          <p style={{ margin: 0, fontSize: '12px', color: C.textMuted }}>Define variants, pricing, media, and visibility.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '14px' }}>
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <input placeholder="Product Name" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${C.border}`, fontFamily: FONT, fontSize: '12px' }} />
            <select style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${C.border}`, fontFamily: FONT, fontSize: '12px' }}>
              {['Hoodie', 'T-Shirt', 'Accessories', 'Stationery', 'Lifestyle'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <textarea rows={4} placeholder="Product description" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${C.border}`, fontFamily: FONT, fontSize: '12px', resize: 'vertical', marginBottom: '10px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input type="number" placeholder="Stock" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${C.border}`, fontFamily: FONT, fontSize: '12px' }} />
            <input type="number" placeholder="Price" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${C.border}`, fontFamily: FONT, fontSize: '12px' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
              const file = e.target.files && e.target.files[0];
              if (file) setPreview(URL.createObjectURL(file));
            }} />
            <div onClick={() => fileRef.current && fileRef.current.click()} style={{ border: `2px dashed ${C.border}`, borderRadius: '10px', padding: '20px 14px', textAlign: 'center', cursor: 'pointer', background: C.neutral }}>
              {preview ? (
                <img src={preview} alt="preview" style={{ width: '100%', borderRadius: '8px', maxHeight: '180px', objectFit: 'cover' }} />
              ) : (
                <>
                  <p style={{ margin: '0 0 6px', fontSize: '12px', fontWeight: '700', color: C.text }}>Upload Product Image</p>
                  <p style={{ margin: 0, fontSize: '10px', color: C.textDim }}>JPG, PNG, WEBP • Max 5MB</p>
                </>
              )}
            </div>
          </div>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: C.text }}>Public Visibility</span>
              <button onClick={() => setVisible((v) => !v)} style={{ width: '36px', height: '20px', borderRadius: '999px', border: 'none', cursor: 'pointer', background: visible ? C.secondary : C.border, position: 'relative' }}>
                <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: C.white, position: 'absolute', top: '3px', left: visible ? '19px' : '3px' }} />
              </button>
            </div>
            <button style={{ width: '100%', marginTop: '10px', border: 'none', borderRadius: '8px', background: C.secondary, color: C.white, fontSize: '11px', fontWeight: '700', padding: '9px 14px', cursor: 'pointer', fontFamily: FONT }}>Create Product</button>
          </div>
        </div>
      </div>
    </>
  );

  const view = (() => {
    if (page === 'inventory') return renderInventoryPage();
    if (page === 'reports') return renderReportsPage();
    if (page === 'order_detail') return renderOrderDetailPage();
    if (page === 'product_detail') return renderProductDetailPage();
    if (page === 'pickup_slots') return renderPickupSlotsPage();
    if (page === 'create_product') return renderCreateProductPage();
    return renderMerchandisePage();
  })();

  return (
    <OrganizerShell page="events">
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: '18px', background: C.neutral, fontFamily: FONT }}>
        <button onClick={() => navigate(`/my-events/${id}/published`)} style={{ border: 'none', background: 'none', color: C.secondary, fontSize: '11px', fontWeight: '700', letterSpacing: '0.07em', textTransform: 'uppercase', cursor: 'pointer', width: 'fit-content', fontFamily: FONT }}>
          {'<'} Back to Published Event
        </button>

        <div style={{ background: C.white, borderRadius: '16px', border: `1px solid ${C.border}`, boxShadow: '0 2px 12px rgba(5,54,104,.04)', padding: '18px' }}>
          {view}
        </div>
      </div>
    </OrganizerShell>
  );
}
