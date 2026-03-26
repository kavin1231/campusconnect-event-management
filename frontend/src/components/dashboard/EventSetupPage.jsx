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

export default function EventSetupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: 'Annual tech summit featuring industry leaders discussing emerging technologies',
    image: 'tech-summit.jpg',
    capacity: 500,
    category: 'Technology'
  });
  const [products, setProducts] = useState([
    { id: 1, name: 'Basic Ticket', price: 500, inventory: 100 },
    { id: 2, name: 'VIP Pass', price: 1500, inventory: 30 }
  ]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', inventory: '' });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.inventory) {
      setProducts([...products, {
        id: products.length + 1,
        name: newProduct.name,
        price: parseInt(newProduct.price),
        inventory: parseInt(newProduct.inventory)
      }]);
      setNewProduct({ name: '', price: '', inventory: '' });
    }
  };

  const removeProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const isComplete = formData.description && formData.capacity && products.length > 0;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px", background: C.neutral, fontFamily: FONT }}>
      <button 
        onClick={() => navigate('/my-events')}
        style={{
          background: 'none',
          border: 'none',
          color: C.secondary,
          cursor: 'pointer',
          marginBottom: '20px',
          fontSize: '13px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all .2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(-4px)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0)"}
      >
        ← Back
      </button>

      <div style={{ maxWidth: '700px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ margin: "0 0 6px", fontSize: "28px", fontWeight: "800", color: C.text, letterSpacing: "-0.02em" }}>
            Event Setup
          </h1>
          <p style={{ margin: 0, fontSize: "13px", color: C.textMuted }}>
            Configure details before publishing
          </p>
        </div>

        {/* Form Section */}
        <div style={{ background: C.white, borderRadius: "12px", border: `1px solid ${C.border}`, padding: "24px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(5,54,104,.05)" }}>
          <h2 style={{ margin: "0 0 20px", fontSize: "14px", fontWeight: "700", color: C.text, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            A. Event Details
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '20px' }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "11px", fontWeight: "700", color: C.textDim, textTransform: "uppercase", letterSpacing: "0.05em" }}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                style={{ width: '100%', padding: '12px 14px', border: `1.5px solid ${C.border}`, borderRadius: '10px', fontSize: '13px', minHeight: '80px', fontFamily: FONT, background: C.white, color: C.text, transition: 'all .2s', outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => { e.target.style.borderColor = C.secondary; e.target.style.boxShadow = "0 0 0 3px rgba(255,113,0,.08)"; }}
                onBlur={(e) => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "11px", fontWeight: "700", color: C.textDim, textTransform: "uppercase", letterSpacing: "0.05em" }}>Capacity</label>
                <input 
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleFormChange}
                  style={{ width: '100%', padding: '12px 14px', border: `1.5px solid ${C.border}`, borderRadius: '10px', fontSize: '13px', fontFamily: FONT, background: C.white, color: C.text, transition: 'all .2s', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={(e) => { e.target.style.borderColor = C.secondary; e.target.style.boxShadow = "0 0 0 3px rgba(255,113,0,.08)"; }}
                  onBlur={(e) => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "11px", fontWeight: "700", color: C.textDim, textTransform: "uppercase", letterSpacing: "0.05em" }}>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  style={{ width: '100%', padding: '12px 14px', border: `1.5px solid ${C.border}`, borderRadius: '10px', fontSize: '13px', fontFamily: FONT, background: C.white, color: C.text, transition: 'all .2s', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={(e) => { e.target.style.borderColor = C.secondary; e.target.style.boxShadow = "0 0 0 3px rgba(255,113,0,.08)"; }}
                  onBlur={(e) => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
                >
                  <option>Technology</option>
                  <option>Sports</option>
                  <option>Academic</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Merchandise Section */}
        <div style={{ background: C.white, borderRadius: "12px", border: `1px solid ${C.border}`, padding: "24px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(5,54,104,.05)" }}>
          <h2 style={{ margin: "0 0 20px", fontSize: "14px", fontWeight: "700", color: C.text, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            B. Tickets & Merchandise
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px', marginBottom: '16px' }}>
            <input 
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              style={{ padding: '12px 14px', border: `1.5px solid ${C.border}`, borderRadius: '10px', fontSize: '13px', fontFamily: FONT, background: C.white, color: C.text }}
            />
            <input 
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              style={{ padding: '12px 14px', border: `1.5px solid ${C.border}`, borderRadius: '10px', fontSize: '13px', fontFamily: FONT, background: C.white, color: C.text }}
            />
            <input 
              type="number"
              placeholder="Inventory"
              value={newProduct.inventory}
              onChange={(e) => setNewProduct({ ...newProduct, inventory: e.target.value })}
              style={{ padding: '12px 14px', border: `1.5px solid ${C.border}`, borderRadius: '10px', fontSize: '13px', fontFamily: FONT, background: C.white, color: C.text }}
            />
            <button
              onClick={addProduct}
              style={{ background: C.secondary, color: C.white, border: 'none', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', fontFamily: FONT, boxShadow: "0 4px 12px rgba(255,113,0,.25)", transition: 'all .2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#e06200"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = C.secondary; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Add
            </button>
          </div>

          {products.length > 0 && (
            <div style={{ borderRadius: '8px', overflow: 'hidden', border: `1px solid ${C.border}` }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: C.primaryLight }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: C.text }}>Product</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: C.text }}>Price</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: C.text }}>Qty</th>
                    <th style={{ textAlign: 'center', padding: '12px', fontSize: '11px', fontWeight: '700', color: C.text }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} style={{ borderTop: `1px solid ${C.border}` }}>
                      <td style={{ padding: '12px', color: C.text, fontSize: '13px' }}>{p.name}</td>
                      <td style={{ padding: '12px', color: C.textMuted, fontSize: '13px' }}>₹{p.price}</td>
                      <td style={{ padding: '12px', color: C.textMuted, fontSize: '13px' }}>{p.inventory}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button
                          onClick={() => removeProduct(p.id)}
                          style={{ background: "rgba(217,48,37,.1)", color: C.error, border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '700', transition: 'all .2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(217,48,37,.2)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(217,48,37,.1)"}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Publish Button */}
        <button
          onClick={() => navigate('/my-events/1/published')}
          disabled={!isComplete}
          style={{
            width: '100%',
            padding: '14px',
            background: isComplete ? C.secondary : C.border,
            color: isComplete ? C.white : C.textDim,
            border: 'none',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: isComplete ? 'pointer' : 'not-allowed',
            fontFamily: FONT,
            boxShadow: isComplete ? '0 4px 16px rgba(255,113,0,.25)' : 'none',
            transition: 'all .2s',
          }}
          onMouseEnter={(e) => {
            if (isComplete) {
              e.currentTarget.style.background = "#e06200";
              e.currentTarget.style.transform = "translateY(-1px)";
            }
          }}
          onMouseLeave={(e) => {
            if (isComplete) {
              e.currentTarget.style.background = C.secondary;
              e.currentTarget.style.transform = "translateY(0)";
            }
          }}
        >
          🚀 Publish Event
        </button>
      </div>
    </div>
  );
}
