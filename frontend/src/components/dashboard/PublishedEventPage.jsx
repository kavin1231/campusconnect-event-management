import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const C = {
  primary: "#053668",
  secondary: "#FF7100",
  tertiary: "#F7ECB5",
  neutral: "#F9FAFB",
  white: "#FFFFFF",
  primaryLight: "#EBF1F9",
  border: "#D1DCE8",
  text: "#0D1F33",
  textMuted: "#5A7494",
  textDim: "#A3B8CC",
  success: "#1B7F4B",
  error: "#D93025",
};

const FONT = "'Montserrat', sans-serif";

const StatCard = ({ icon, label, value, subtext }) => (
  <div style={{
    background: C.white,
    border: `1px solid ${C.border}`,
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(5,54,104,.05)",
    transition: "all .3s",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.boxShadow = "0 6px 24px rgba(5,54,104,.12)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 2px 8px rgba(5,54,104,.05)";
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
      <span style={{ fontSize: "20px" }}>{icon}</span>
      <p style={{
        margin: 0,
        fontSize: "11px",
        fontWeight: "700",
        color: C.textDim,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        fontFamily: FONT,
      }}>
        {label}
      </p>
    </div>
    <p style={{
      margin: "0 0 6px",
      fontSize: "28px",
      fontWeight: "800",
      color: C.text,
      fontFamily: FONT,
    }}>
      {value}
    </p>
    {subtext && <p style={{
      margin: 0,
      fontSize: "12px",
      color: C.textMuted,
      fontFamily: FONT,
    }}>
      {subtext}
    </p>}
  </div>
);

export default function PublishedEventPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('merchandise');

  return (
    <div style={{ padding: '40px', background: '#f8fafc', minHeight: '100vh' }}>
      <button 
        onClick={() => navigate('/my-events')}
        style={{
          background: 'none',
          border: 'none',
          color: '#FF7100',
          cursor: 'pointer',
          marginBottom: '30px',
          fontSize: '16px',
          fontWeight: '600'
        }}
      >
        ← Back to My Events
      </button>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <div>
            <h1 style={{ color: '#053668', fontSize: '32px', fontWeight: '700', margin: '0 0 10px 0' }}>
              Tech Summit 2026
            </h1>
            <p style={{ color: '#64748b', margin: '0' }}>Live • Published on 25 Mar 2026</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{
              background: 'white',
              color: '#053668',
              border: '1px solid #053668',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              View Details
            </button>
            <button style={{
              background: '#FF7100',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              Manage Orders
            </button>
            <button style={{
              background: '#053668',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              View Analytics
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {[
            { label: 'Registered Delegates', value: '127/150', color: '#1B7F4B' },
            { label: 'Total Orders', value: '45', color: '#FF7100' },
            { label: 'Avg Revenue/Product', value: '₹7,500', color: '#053668' }
          ].map((stat, idx) => (
            <div key={idx} style={{
              background: 'white',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}>
              <p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 10px 0', fontWeight: '500' }}>
                {stat.label}
              </p>
              <p style={{ color: stat.color, fontSize: '28px', fontWeight: '700', margin: '0' }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #e2e8f0',
            background: '#f9fafb'
          }}>
            {['merchandise', 'orders'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: activeTab === tab ? 'white' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab ? '3px solid #FF7100' : 'none',
                  color: activeTab === tab ? '#053668' : '#94a3b8',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                {tab === 'merchandise' ? 'Merchandise Performance' : 'Recent Orders'}
              </button>
            ))}
          </div>

          {/* Tab Content: Merchandise */}
          {activeTab === 'merchandise' && (
            <div style={{ padding: '20px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#334155', fontWeight: '600', fontSize: '14px' }}>Product</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#334155', fontWeight: '600', fontSize: '14px' }}>Price</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#334155', fontWeight: '600', fontSize: '14px' }}>Sold</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#334155', fontWeight: '600', fontSize: '14px' }}>Stock Left</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { product: 'Basic Ticket', price: '₹500', sold: 85, stock: 15 },
                    { product: 'VIP Pass', price: '₹1,500', sold: 28, stock: 2 },
                    { product: 'Merchandise Bundle', price: '₹2,000', sold: 12, stock: 38 }
                  ].map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px', color: '#1e293b' }}>{item.product}</td>
                      <td style={{ padding: '12px', color: '#475569' }}>{item.price}</td>
                      <td style={{ padding: '12px', color: '#1B7F4B', fontWeight: '600' }}>{item.sold}</td>
                      <td style={{ padding: '12px', color: item.stock > 10 ? '#053668' : '#D93025' }}>
                        {item.stock}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab Content: Orders */}
          {activeTab === 'orders' && (
            <div style={{ padding: '20px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#334155', fontWeight: '600', fontSize: '14px' }}>Order ID</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#334155', fontWeight: '600', fontSize: '14px' }}>Delegate</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#334155', fontWeight: '600', fontSize: '14px' }}>Product</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#334155', fontWeight: '600', fontSize: '14px' }}>Qty</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#334155', fontWeight: '600', fontSize: '14px' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: '#ORD001', delegate: 'John Doe', product: 'Basic Ticket', qty: 2, date: '26 Mar 2026' },
                    { id: '#ORD002', delegate: 'Jane Smith', product: 'VIP Pass', qty: 1, date: '26 Mar 2026' },
                    { id: '#ORD003', delegate: 'Mike Johnson', product: 'Merchandise Bundle', qty: 3, date: '25 Mar 2026' },
                    { id: '#ORD004', delegate: 'Sarah Williams', product: 'Basic Ticket', qty: 1, date: '25 Mar 2026' },
                    { id: '#ORD005', delegate: 'Alex Brown', product: 'VIP Pass + Merch', qty: 2, date: '24 Mar 2026' }
                  ].map((order, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px', color: '#053668', fontWeight: '600' }}>{order.id}</td>
                      <td style={{ padding: '12px', color: '#1e293b' }}>{order.delegate}</td>
                      <td style={{ padding: '12px', color: '#475569' }}>{order.product}</td>
                      <td style={{ padding: '12px', color: '#475569' }}>{order.qty}</td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
