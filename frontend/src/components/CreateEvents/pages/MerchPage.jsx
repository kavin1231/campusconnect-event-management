import { useState } from "react";
import { C, FONT, Icon, Inp, Sel, Txta, Lbl } from "../designSystem";
import { MERCH_PRODUCTS_INIT, MERCH_ORDERS_INIT } from "../data";

export default function MerchPage() {
  const [products, setProducts] = useState(MERCH_PRODUCTS_INIT);
  const [orders, setOrders] = useState(MERCH_ORDERS_INIT);
  const [activeTab, setActiveTab] = useState("products");
  const [orderFilter, setOrderFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", inventory: "", category: "Apparel", desc: "" });

  const toggleEnabled = (id) => setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
  const markCollected = (ordId) => setOrders((os) => os.map((o) => (o.id === ordId ? { ...o, fulfillStatus: "collected" } : o)));

  const filteredOrders = orderFilter === "All" ? orders : orders.filter((o) => {
    if (orderFilter === "Pending") return o.fulfillStatus === "pending";
    if (orderFilter === "Paid") return o.payStatus === "paid" && o.fulfillStatus !== "collected";
    if (orderFilter === "Collected") return o.fulfillStatus === "collected";
    return true;
  });

  const totalRevenue = orders.reduce((sum, o) => {
    const p = products.find((pr) => pr.name === o.item);
    return sum + (p ? p.price : 0);
  }, 0);
  const totalOrders = orders.length;
  const collectedCount = orders.filter((o) => o.fulfillStatus === "collected").length;
  const pendingCount = orders.filter((o) => o.fulfillStatus === "pending").length;

  const payColor = (s) => s === "paid" ? { bg: "#E8F5EF", text: "#1B7F4B" } : s === "collected" ? { bg: "#EBF1F9", text: "#053668" } : { bg: "#FFFBEB", text: "#C47F00" };
  const fulfillColor = (s) => s === "collected" ? { bg: "#E8F5EF", text: "#1B7F4B", label: "Collected" } : s === "pickedup" ? { bg: "#EBF1F9", text: "#053668", label: "Picked Up" } : { bg: "#FFFBEB", text: "#C47F00", label: "Pending" };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px", display: "flex", flexDirection: "column", gap: "22px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: "700", color: C.secondary, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: FONT }}>LOGISTICS PORTAL</p>
          <h1 style={{ margin: "0 0 5px", fontSize: "26px", fontWeight: "800", color: C.text, fontFamily: FONT, letterSpacing: "-0.03em" }}>Merchandise Store & Orders</h1>
          <p style={{ margin: 0, fontSize: "13px", color: C.textMuted, fontFamily: FONT }}>Control inventory for event apparel and monitor student fulfillment status.</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 18px", background: C.secondary, color: C.white, border: "none", borderRadius: "9px", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: FONT, boxShadow: "0 4px 14px rgba(255,113,0,.3)" }}><Icon.QrCode size={14} /> Scan QR to Collect</button>
          <button onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 18px", background: C.white, color: C.primary, border: `1.5px solid ${C.border}`, borderRadius: "9px", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: FONT }}><Icon.Plus size={14} /> Add New Product</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
        {[
          { label: "Total Orders", value: totalOrders, color: C.primary, bg: C.primaryLight, icon: <Icon.Package size={16} /> },
          { label: "Revenue (LKR)", value: `${(totalRevenue / 1000).toFixed(0)}k`, color: C.secondary, bg: "#FFF4EC", icon: <Icon.TrendingUp size={16} /> },
          { label: "Collected", value: collectedCount, color: C.success, bg: C.successLight, icon: <Icon.CheckCircle size={16} /> },
          { label: "Awaiting Pickup", value: pendingCount, color: C.warning, bg: C.warningLight, icon: <Icon.Clock size={16} /> },
        ].map((s) => (
          <div key={s.label} style={{ background: C.white, borderRadius: "12px", padding: "16px", border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(5,54,104,.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}><div style={{ width: "32px", height: "32px", borderRadius: "8px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>{s.icon}</div></div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: C.text, fontFamily: FONT, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: "11px", fontWeight: "600", color: C.textMuted, fontFamily: FONT, marginTop: "3px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "2px", borderBottom: `2px solid ${C.border}` }}>
        {[["products", "Product Listings"], ["orders", "Order Tracking"], ["insights", "Sales Insights"]].map(([k, l]) => (
          <button key={k} onClick={() => setActiveTab(k)} style={{ padding: "9px 20px", border: "none", background: "transparent", cursor: "pointer", fontFamily: FONT, fontSize: "13px", fontWeight: activeTab === k ? "700" : "500", color: activeTab === k ? C.primary : C.textMuted, borderBottom: `2px solid ${activeTab === k ? C.secondary : "transparent"}`, marginBottom: "-2px", transition: "all .15s", display: "flex", alignItems: "center", gap: "6px" }}>{k === "products" && <Icon.ShoppingBag size={13} />}{k === "orders" && <Icon.Package size={13} />}{k === "insights" && <Icon.BarChart size={13} />}{l}</button>
        ))}
      </div>

      {activeTab === "products" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: "16px" }}>
          {products.map((p) => (
            <div key={p.id} style={{ background: C.white, borderRadius: "14px", border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: "0 2px 8px rgba(5,54,104,.05)" }}>
              <div style={{ height: "140px", background: p.image === "👕" ? "linear-gradient(135deg,#1a1a2e,#16213e)" : p.image === "🧥" ? "linear-gradient(135deg,#c8c8c8,#a0a0a0)" : "linear-gradient(135deg,#e8e0d0,#d4c9b5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "56px", position: "relative" }}>
                {p.image}
                <span style={{ position: "absolute", top: "10px", right: "10px", fontSize: "9px", fontWeight: "800", padding: "3px 8px", borderRadius: "100px", background: p.status === "instock" ? "#22c55e" : p.status === "lowstock" ? "#FF7100" : "#ef4444", color: C.white, letterSpacing: "0.06em" }}>{p.status === "instock" ? "IN STOCK" : p.status === "lowstock" ? "LOW STOCK" : "OUT OF STOCK"}</span>
              </div>
              <div style={{ padding: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}><h4 style={{ margin: 0, fontSize: "13px", fontWeight: "800", color: C.text, fontFamily: FONT }}>{p.name}</h4><span style={{ fontSize: "14px", fontWeight: "800", color: C.secondary, fontFamily: FONT }}>LKR {p.price.toLocaleString()}</span></div>
                <p style={{ margin: "0 0 10px", fontSize: "11px", color: C.textMuted, fontFamily: FONT, lineHeight: 1.5 }}>{p.desc}</p>
                <div style={{ marginBottom: "10px" }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}><span style={{ fontSize: "10px", color: C.textMuted, fontFamily: FONT }}>{p.sold}/{p.inventory} sold</span><span style={{ fontSize: "10px", color: C.primary, fontWeight: "700", fontFamily: FONT }}>{Math.round((p.sold / p.inventory) * 100)}%</span></div><div style={{ background: C.border, borderRadius: "100px", height: "4px", overflow: "hidden" }}><div style={{ height: "100%", width: `${(p.sold / p.inventory) * 100}%`, background: p.status === "lowstock" ? C.secondary : C.primary, borderRadius: "100px" }} /></div></div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button type="button" onClick={() => toggleEnabled(p.id)} style={{ position: "relative", width: "36px", height: "20px", borderRadius: "100px", background: p.enabled ? C.primary : C.borderDark, border: "none", cursor: "pointer" }}><span style={{ position: "absolute", top: "2px", left: p.enabled ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", background: C.white, boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} /></button>
                    <span style={{ fontSize: "11px", color: C.textMuted, fontFamily: FONT }}>Public visibility</span>
                  </div>
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted, display: "flex", padding: "4px" }}><Icon.Pencil size={13} /></button>
                </div>
              </div>
            </div>
          ))}

          <div onClick={() => setShowAddModal(true)} style={{ background: C.white, borderRadius: "14px", border: `1.5px dashed ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", minHeight: "260px", cursor: "pointer" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: C.neutral, display: "flex", alignItems: "center", justifyContent: "center", color: C.textDim }}><Icon.Plus size={20} /></div>
            <span style={{ fontSize: "13px", fontWeight: "700", color: C.textMuted, fontFamily: FONT }}>Create New Listing</span>
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ background: C.white, borderRadius: "14px", border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: "0 2px 8px rgba(5,54,104,.05)" }}>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "800", color: C.text, fontFamily: FONT }}>Fulfillment Dashboard</h3>
              <div style={{ display: "flex", gap: "6px" }}>{["All", "Pending", "Paid", "Collected"].map((f) => <button key={f} onClick={() => setOrderFilter(f)} style={{ padding: "5px 12px", borderRadius: "6px", fontSize: "11px", fontFamily: FONT, cursor: "pointer", fontWeight: orderFilter === f ? "700" : "500", border: `1.5px solid ${orderFilter === f ? C.primary : C.border}`, background: orderFilter === f ? C.primaryLight : C.white, color: orderFilter === f ? C.primary : C.textMuted }}>{f}</button>)}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 0.8fr 1.2fr 1.2fr 1.5fr", padding: "9px 20px", background: C.neutral, borderBottom: `1px solid ${C.border}` }}>{["Student Name", "Item Ordered", "Size", "Order Date", "Flow Status", "Fulfillment"].map((h) => <span key={h} style={{ fontSize: "10px", fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: FONT }}>{h}</span>)}</div>
            {filteredOrders.map((o, i) => {
              const pc = payColor(o.payStatus);
              const fc = fulfillColor(o.fulfillStatus);
              return (
                <div key={o.id} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 0.8fr 1.2fr 1.2fr 1.5fr", padding: "12px 20px", borderBottom: i < filteredOrders.length - 1 ? `1px solid ${C.border}` : "none", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: C.text, fontFamily: FONT }}>{o.student}</span>
                  <span style={{ fontSize: "12px", color: C.textMuted, fontFamily: FONT }}>{o.item}</span>
                  <span style={{ fontSize: "12px", color: C.text, fontFamily: FONT, fontWeight: "600" }}>{o.size}</span>
                  <span style={{ fontSize: "12px", color: C.textMuted, fontFamily: FONT }}>{o.date}</span>
                  <span style={{ fontSize: "10px", fontWeight: "700", background: pc.bg, color: pc.text, padding: "3px 9px", borderRadius: "100px", fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.04em", display: "inline-block" }}>{o.payStatus}</span>
                  {o.fulfillStatus === "collected" ? (
                    <span style={{ fontSize: "10px", fontWeight: "700", color: C.success, fontFamily: FONT, display: "flex", alignItems: "center", gap: "5px" }}><Icon.Check size={11} />{fc.label}</span>
                  ) : o.fulfillStatus === "pickedup" ? (
                    <span style={{ fontSize: "10px", fontWeight: "700", color: C.primary, fontFamily: FONT }}>{fc.label}</span>
                  ) : (
                    <div style={{ display: "flex", gap: "6px" }}>
                      {o.payStatus === "paid" ? <button onClick={() => markCollected(o.id)} style={{ padding: "5px 12px", background: C.secondary, color: C.white, border: "none", borderRadius: "6px", fontSize: "10px", fontWeight: "800", cursor: "pointer", fontFamily: FONT, whiteSpace: "nowrap" }}>Mark Collected</button> : <button style={{ padding: "5px 12px", background: C.primaryLight, color: C.primary, border: `1px solid ${C.border}`, borderRadius: "6px", fontSize: "10px", fontWeight: "700", cursor: "pointer", fontFamily: FONT, whiteSpace: "nowrap" }}>Process Payment</button>}
                    </div>
                  )}
                </div>
              );
            })}
            <div style={{ padding: "10px 20px", borderTop: `1px solid ${C.border}`, background: C.neutral }}><span style={{ fontSize: "11px", color: C.textMuted, fontFamily: FONT }}>Showing {filteredOrders.length} of {orders.length} orders</span></div>
          </div>
        </div>
      )}

      {activeTab === "insights" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          {[{ label: "Total Revenue", value: `LKR ${totalRevenue.toLocaleString()}`, sub: "Across all products", color: C.secondary, chart: [40, 55, 60, 72, 68, 80, 95] }, { label: "Orders This Month", value: totalOrders, sub: "8 orders total", color: C.primary, chart: [2, 3, 5, 6, 4, 7, 8] }, { label: "Collection Rate", value: `${Math.round((collectedCount / totalOrders) * 100)}%`, sub: "Of paid orders collected", color: C.success, chart: [60, 65, 70, 75, 72, 80, (collectedCount / totalOrders) * 100] }].map((s) => (
            <div key={s.label} style={{ background: C.white, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "18px", boxShadow: "0 2px 8px rgba(5,54,104,.04)" }}><p style={{ margin: "0 0 3px", fontSize: "11px", fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: FONT }}>{s.label}</p><p style={{ margin: "0 0 2px", fontSize: "24px", fontWeight: "800", color: C.text, fontFamily: FONT, lineHeight: 1 }}>{s.value}</p><p style={{ margin: "0 0 14px", fontSize: "11px", color: s.color, fontWeight: "600", fontFamily: FONT }}>{s.sub}</p><div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "40px" }}>{s.chart.map((v, i) => { const mx = Math.max(...s.chart); return <div key={i} style={{ flex: 1, background: i === s.chart.length - 1 ? s.color : s.color + "30", borderRadius: "3px 3px 0 0", height: `${(v / mx) * 100}%` }} />; })}</div></div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(5,28,68,.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowAddModal(false)}>
          <div style={{ background: C.white, borderRadius: "16px", padding: "28px", width: "440px", boxShadow: "0 20px 60px rgba(5,54,104,.25)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}><h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: C.text, fontFamily: FONT }}>Add New Product</h3><button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textDim, fontSize: "20px", lineHeight: 1 }}>×</button></div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div><Lbl required>Product Name</Lbl><Inp placeholder="e.g. Annual Gala T-Shirt" value={newProduct.name} onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}><div><Lbl required>Price (LKR)</Lbl><Inp type="number" placeholder="e.g. 1900" value={newProduct.price} onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))} /></div><div><Lbl required>Inventory</Lbl><Inp type="number" placeholder="e.g. 80" value={newProduct.inventory} onChange={(e) => setNewProduct((p) => ({ ...p, inventory: e.target.value }))} /></div></div>
              <div><Lbl required>Category</Lbl><Sel value={newProduct.category} onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value }))}>{["Apparel", "Accessories", "Stationery", "Food & Beverage", "Other"].map((c) => <option key={c} value={c}>{c}</option>)}</Sel></div>
              <div><Lbl>Description</Lbl><Txta rows={2} placeholder="Brief product description..." value={newProduct.desc} onChange={(e) => setNewProduct((p) => ({ ...p, desc: e.target.value }))} /></div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button onClick={() => {
                if (newProduct.name && newProduct.price && newProduct.inventory) {
                  setProducts((ps) => [...ps, { id: `m${Date.now()}`, name: newProduct.name, price: parseInt(newProduct.price, 10), inventory: parseInt(newProduct.inventory, 10), sold: 0, enabled: true, status: "instock", category: newProduct.category, event: "General", image: "📦", desc: newProduct.desc || "New product listing." }]);
                  setNewProduct({ name: "", price: "", inventory: "", category: "Apparel", desc: "" });
                  setShowAddModal(false);
                }
              }} style={{ flex: 1, padding: "11px", background: C.primary, color: C.white, border: "none", borderRadius: "9px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: FONT, boxShadow: "0 4px 12px rgba(5,54,104,.2)" }}>Add Product</button>
              <button onClick={() => setShowAddModal(false)} style={{ padding: "11px 20px", background: C.white, color: C.primary, border: `1.5px solid ${C.border}`, borderRadius: "9px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: FONT }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
