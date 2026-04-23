import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { C, FONT } from '../../constants/colors';
import { Icon } from '../common/Icon';
import OrganizerShell from './OrganizerShell';
import { merchandiseAPI, resolveImageUrl } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

const resolveProductImageUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") return null;

  const cleaned = imageUrl.trim();
  if (!cleaned) return null;

  if (/^(https?:|data:|blob:)/i.test(cleaned)) return cleaned;

  if (cleaned.startsWith("/")) return `${API_ORIGIN}${cleaned}`;

  return `${API_ORIGIN}/${cleaned}`;
};

const normalizeOrderStatus = (status) => {
  const value = String(status || "pending").toLowerCase();
  if (value.includes("collect")) return "collected";
  if (value.includes("paid") || value.includes("verify")) return "paid";
  return "pending";
};

const formatOrderDate = (value) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const SLIIT_DISTRIBUTION_POINTS = [
  "Main Campus - Student Center Counter",
  "Main Campus - Library Lobby Desk",
  "Main Campus - New Building Ground Floor",
  "Main Campus - Engineering Block Reception",
  "Business School - Admin Office Counter",
  "Weekend Collection - Auditorium Entrance",
];

function Tab({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: "none",
        background: "none",
        fontSize: "12px",
        fontWeight: "700",
        color: active ? C.primary : C.textMuted,
        padding: "0 0 10px",
        cursor: "pointer",
        borderBottom: active ? `2px solid ${C.secondary}` : "2px solid transparent",
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
    collected: { bg: C.successLight, color: C.success, border: "#A7D7BE" },
  };
  const s = map[type] || map.pending;
  return (
    <span
      style={{
        fontSize: "9px",
        fontWeight: "700",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        padding: "3px 8px",
        borderRadius: "999px",
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

function ProductCard({ title, price, desc, soldOut, image, onClick, palette }) {
  const safePalette = palette || {
    surface: C.white,
    surfaceAlt: C.neutral,
    border: C.border,
    text: C.text,
    textMuted: C.textMuted,
    textDim: C.textDim,
  };
  return (
    <div
      onClick={onClick}
      style={{
        background: safePalette.surface,
        border: `1px solid ${safePalette.border}`,
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(5,54,104,.05)",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          height: "108px",
          background: image
            ? `linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.35)), url(${resolveImageUrl(image)}) center/cover no-repeat`
            : soldOut
              ? "linear-gradient(135deg,#dce6f5,#f2f5fb)"
              : "linear-gradient(135deg,#1b232f,#334155)",
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            fontSize: "9px",
            fontWeight: "700",
            color: C.white,
            background: soldOut ? C.secondary : C.success,
            borderRadius: "999px",
            padding: "2px 7px",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            fontFamily: FONT,
          }}
        >
          {soldOut ? "Low Stock" : "In Stock"}
        </span>
      </div>
      <div style={{ padding: "12px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            marginBottom: "6px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              fontWeight: "700",
              color: safePalette.text,
              fontFamily: FONT,
            }}
          >
            {title}
          </p>
          <span
            style={{
              fontSize: "11px",
              fontWeight: "800",
              color: C.secondary,
              fontFamily: FONT,
            }}
          >
            {price}
          </span>
        </div>
        <p
          style={{
            margin: "0 0 9px",
            fontSize: "10px",
            color: safePalette.textMuted,
            lineHeight: 1.5,
            fontFamily: FONT,
          }}
        >
          {desc}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              color: safePalette.textDim,
              fontFamily: FONT,
            }}
          >
            Public visibility
          </span>
          <button
            style={{
              width: "30px",
              height: "16px",
              borderRadius: "999px",
              border: "none",
              background: C.secondary,
              position: "relative",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: C.white,
                position: "absolute",
                right: "2px",
                top: "2px",
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MerchandiseOrdersPage() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const fileRef = useRef(null);

  const palette = isDarkMode
    ? {
        pageBg: "#0B1324",
        surface: "#111A2E",
        surfaceAlt: "#0F172A",
        border: "#22304A",
        text: "#E2E8F0",
        textMuted: "#94A3B8",
        textDim: "#64748B",
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

  const [page, setPage] = useState("merchandise");
  const [context, setContext] = useState(null);
  const [filter, setFilter] = useState("all");
  const [preview, setPreview] = useState(null);
  const [visible, setVisible] = useState(true);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [productImageFile, setProductImageFile] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Hoodie",
    description: "",
    price: "",
    inventory: "",
    imageUrl: "",
  });

  const go = (nextPage, ctx = null) => {
    setContext(ctx);
    setPage(nextPage);
  };

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderActionMessage, setOrderActionMessage] = useState(null);
  const [orderActionError, setOrderActionError] = useState(null);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
  const [productOrders, setProductOrders] = useState([]);
  const [productOrdersLoading, setProductOrdersLoading] = useState(false);
  const [productPanelMessage, setProductPanelMessage] = useState(null);
  const [productPanelError, setProductPanelError] = useState(null);
  const [distributionLocation, setDistributionLocation] = useState("");
  const [isDistributing, setIsDistributing] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    sku: "",
    price: "",
    inventory: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await merchandiseAPI.getProducts();
        if (response.success) {
          setProducts(response.products);
        } else {
          console.error("Failed to fetch products:", response.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsSaving(false);
      }
    };

    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await merchandiseAPI.getOrders();
      if (response?.success && Array.isArray(response.orders)) {
        setOrders(response.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreateProduct = async () => {
    setFormError(null);
    setFormSuccess(null);

    if (!newProduct.name.trim()) {
      setFormError("Product name is required.");
      return;
    }

    const parsedPrice = Number(newProduct.price);
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setFormError("Enter a valid product price.");
      return;
    }

    const parsedInventory = Number(newProduct.inventory);
    if (!Number.isFinite(parsedInventory) || parsedInventory < 0) {
      setFormError("Enter a valid inventory value.");
      return;
    }

    setIsSaving(true);
    try {
      let resolvedImageUrl = newProduct.imageUrl?.trim() || null;

      if (productImageFile) {
        const uploadResponse = await merchandiseAPI.uploadProductImage(productImageFile);
        if (!uploadResponse?.success || !uploadResponse?.imageUrl) {
          setFormError(uploadResponse?.message || "Failed to upload product image.");
          return;
        }
        resolvedImageUrl = uploadResponse.imageUrl;
      }

      const payload = {
        name: newProduct.name.trim(),
        description: newProduct.description?.trim() || null,
        price: parsedPrice,
        inventory: parsedInventory,
        imageUrl: resolvedImageUrl,
        isActive: visible,
      };

      const response = await merchandiseAPI.createProduct(payload);
      if (!response?.success || !response?.product) {
        setFormError(response?.message || "Unable to create product.");
        return;
      }

      setProducts((prev) => [response.product, ...prev]);
      setFormSuccess("Product created successfully.");
      setNewProduct({
        name: "",
        category: "Hoodie",
        description: "",
        price: "",
        inventory: "",
        imageUrl: "",
      });
      setProductImageFile(null);
      setPreview(null);
      go("merchandise");
    } catch (error) {
      setFormError("Unable to create product. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const orderRows = orders.map((order) => {
    const firstItem = Array.isArray(order.items) && order.items.length ? order.items[0] : null;
    const status = normalizeOrderStatus(order.status);

    return {
      id: order.id,
      delegate: order.buyerName || "Unknown Student",
      item: firstItem?.product?.name || "N/A",
      size: firstItem?.size || "-",
      date: formatOrderDate(order.createdAt),
      status,
      action: status === "collected" ? "Picked Up" : status === "paid" ? "Mark Collected" : "Process Payment",
      totalAmount: Number(order.totalAmount || 0),
      buyerEmail: order.buyerEmail || "-",
      buyerPhone: order.buyerPhone || "-",
      quantity: (order.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0),
      paymentSlipUrl: order.paymentSlipUrl || null,
    };
  });

  const filteredRows = filter === "all" ? orderRows : orderRows.filter((r) => r.status === filter);

  const stockRows = products.length
    ? products.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category || "Merchandise",
        stock: Number.isFinite(p.inventory) ? p.inventory : Number(p.inventory || 0),
        sold: p.sold || 0,
        status:
          p.inventory <= 0
            ? "out_stock"
            : p.inventory < 20
              ? "low_stock"
              : "in_stock",
        sku: p.sku,
        description: p.description,
        price: p.price,
        image: p.imageUrl,
        isActive: typeof p.isActive === "boolean" ? p.isActive : true,
      }))
    : [];

  const slotRows = [
    { id: "slot-1", label: "Morning Collection", date: "Mon, Apr 21", time: "9:00 AM - 11:00 AM", loc: "Student Union", assigned: 48, total: 60, hot: true },
    { id: "slot-2", label: "Noon Collection", date: "Mon, Apr 21", time: "12:00 PM - 2:00 PM", loc: "Main Hall", assigned: 22, total: 60, hot: false },
    { id: "slot-3", label: "Evening Collection", date: "Tue, Apr 22", time: "4:00 PM - 6:00 PM", loc: "North Foyer", assigned: 10, total: 40, hot: false },
  ];

  const selectedOrder = context || filteredRows[0] || { id: 0, delegate: "N/A", item: "N/A", size: "-", date: "-", status: "pending" };
  const selectedProduct = context || stockRows[0] || { id: null, name: "N/A", sku: "N/A", price: 0, stock: 0, description: "", isActive: true };

  useEffect(() => {
    setOrderActionMessage(null);
    setOrderActionError(null);
  }, [selectedOrder?.id]);

  const getSlipUrl = (slipPath) => {
    if (!slipPath || typeof slipPath !== "string") return null;
    if (/^(https?:|data:|blob:)/i.test(slipPath)) return slipPath;
    return `${API_ORIGIN}${slipPath.startsWith("/") ? "" : "/"}${slipPath}`;
  };

  const fetchOrdersByProduct = async (productId) => {
    if (!productId) {
      setProductOrders([]);
      return;
    }

    setProductOrdersLoading(true);
    setProductPanelError(null);
    try {
      const response = await merchandiseAPI.getOrdersByProduct(productId);
      if (response?.success && Array.isArray(response.orders)) {
        setProductOrders(response.orders);
        return;
      }

      // Fallback for environments running an older backend route set.
      const fallback = await merchandiseAPI.getOrders({ productId: String(productId) });
      if (fallback?.success && Array.isArray(fallback.orders)) {
        setProductOrders(fallback.orders);
        return;
      }

      setProductOrders([]);
      setProductPanelError(response?.message || fallback?.message || "Unable to load product orders.");
    } catch (error) {
      setProductOrders([]);
      setProductPanelError("Unable to load product orders. Please ensure backend is restarted with the latest routes.");
    } finally {
      setProductOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (page !== "product_detail" || !selectedProduct?.id) return;

    setProductForm({
      name: selectedProduct.name || "",
      sku: selectedProduct.sku || "",
      price: selectedProduct.price ?? "",
      inventory: selectedProduct.stock ?? selectedProduct.inventory ?? 0,
      description: selectedProduct.description || "",
      isActive: typeof selectedProduct.isActive === "boolean" ? selectedProduct.isActive : true,
    });
    setDistributionLocation("");
    setProductPanelMessage(null);
    setProductPanelError(null);
    fetchOrdersByProduct(selectedProduct.id);
  }, [page, selectedProduct?.id]);

  const handleSaveProductChanges = async () => {
    if (!selectedProduct?.id) return;

    const parsedPrice = Number(productForm.price);
    const parsedInventory = Number(productForm.inventory);
    if (!productForm.name.trim()) {
      setProductPanelError("Product name is required.");
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setProductPanelError("Enter a valid price.");
      return;
    }
    if (!Number.isFinite(parsedInventory) || parsedInventory < 0) {
      setProductPanelError("Enter a valid inventory value.");
      return;
    }

    setIsSavingProduct(true);
    setProductPanelError(null);
    setProductPanelMessage(null);
    try {
      const response = await merchandiseAPI.updateProduct(selectedProduct.id, {
        name: productForm.name.trim(),
        description: productForm.description?.trim() || null,
        price: parsedPrice,
        inventory: parsedInventory,
        isActive: Boolean(productForm.isActive),
      });

      if (!response?.success || !response?.product) {
        setProductPanelError(response?.message || "Unable to save product changes.");
        return;
      }

      setProducts((prev) => prev.map((p) => (Number(p.id) === Number(selectedProduct.id) ? { ...p, ...response.product } : p)));
      setContext((prev) => (prev && Number(prev.id) === Number(selectedProduct.id) ? { ...prev, ...response.product } : prev));
      setProductPanelMessage("Product updated successfully.");
    } catch (error) {
      setProductPanelError("Unable to save product changes.");
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct?.id) return;
    const confirmed = window.confirm("Delete this product? This cannot be undone.");
    if (!confirmed) return;

    setIsDeletingProduct(true);
    setProductPanelError(null);
    setProductPanelMessage(null);
    try {
      const response = await merchandiseAPI.deleteProduct(selectedProduct.id);
      if (!response?.success) {
        setProductPanelError(response?.message || "Unable to delete product.");
        return;
      }

      setProducts((prev) => prev.filter((p) => Number(p.id) !== Number(selectedProduct.id)));
      setProductPanelMessage("Product deleted.");
      go("merchandise");
    } catch (error) {
      setProductPanelError("Unable to delete product.");
    } finally {
      setIsDeletingProduct(false);
    }
  };

  const handleStartDistribution = async () => {
    if (!selectedProduct?.id) return;
    const location = distributionLocation.trim();
    if (!location) {
      setProductPanelError("Select a pickup location to start distribution.");
      return;
    }

    setIsDistributing(true);
    setProductPanelError(null);
    setProductPanelMessage(null);
    try {
      const response = await merchandiseAPI.distributeProductOrders(selectedProduct.id, {
        pickupLocation: location,
      });

      if (!response?.success) {
        setProductPanelError(response?.message || "Unable to start distribution.");
        return;
      }

      setProductPanelMessage(response?.message || "Distribution started.");
      await fetchOrdersByProduct(selectedProduct.id);
      await fetchOrders();
    } catch (error) {
      setProductPanelError("Unable to start distribution.");
    } finally {
      setIsDistributing(false);
    }
  };

  const applyOrderUpdate = async (payload, successMessage) => {
    if (!selectedOrder?.id) return;

    setIsUpdatingOrder(true);
    setOrderActionMessage(null);
    setOrderActionError(null);

    try {
      const response = await merchandiseAPI.updateOrder(selectedOrder.id, payload);
      if (!response?.success || !response?.order) {
        setOrderActionError(response?.message || "Unable to update order.");
        return;
      }

      setOrders((prev) =>
        prev.map((order) =>
          Number(order.id) === Number(response.order.id) ? response.order : order,
        ),
      );
      setContext((prev) => {
        if (!prev || Number(prev.id) !== Number(response.order.id)) return prev;
        return {
          ...prev,
          status: normalizeOrderStatus(response.order.status),
          paymentSlipUrl: response.order.paymentSlipUrl || prev.paymentSlipUrl || null,
        };
      });
      setOrderActionMessage(successMessage);
      await fetchOrders();
    } catch (error) {
      setOrderActionError("Unable to update order right now.");
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  const handlePaymentValid = async () => {
    await applyOrderUpdate(
      { status: "PAID" },
      "Payment verified successfully.",
    );
  };

  const handlePaymentRejected = async () => {
    await applyOrderUpdate(
      { status: "PAYMENT_REJECTED" },
      "Payment marked as rejected.",
    );
  };

  const handleMarkCollected = async () => {
    await applyOrderUpdate(
      { status: "COLLECTED" },
      "Order marked as collected.",
    );
  };

  const renderMerchandisePage = () => (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: "28px", lineHeight: 1.1, color: C.primary, fontWeight: "800", letterSpacing: "-0.03em", fontFamily: FONT }}>Merchandise Store & Orders</h1>
          <p style={{ margin: 0, fontSize: "12px", color: palette.textMuted, fontFamily: FONT }}>Control inventory for event apparel and monitor student fulfillment status.</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "10px 18px",
              background: C.secondary,
              color: C.white,
              border: "none",
              borderRadius: "9px",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: FONT,
              boxShadow: "0 4px 14px rgba(255,113,0,.3)",
            }}
          >
            <Icon.Ticket size={14} /> Scan QR to Collect
          </button>
          <button
            onClick={() => go("create_product")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "10px 18px",
              background: C.white,
              color: C.primary,
              border: `1.5px solid ${C.border}`,
              borderRadius: "9px",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            <Icon.Plus size={14} /> New Product
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "14px" }}>
        <Tab active>Product Listings</Tab>
        <Tab onClick={() => go("reports")}>Sales Insights</Tab>
        <Tab onClick={() => go("inventory")}>Stock Control</Tab>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px", marginBottom: "14px" }}>
        {products.map((p) => (
          <ProductCard
            key={p.id}
            title={p.name}
            price={typeof p.price === "number" ? `$${p.price.toFixed(2)}` : "$0.00"}
            desc={p.description || "No description available."}
            soldOut={p.status === "LOW_STOCK" || p.status === "OUT_OF_STOCK"}
            image={resolveProductImageUrl(p.imageUrl)}
            onClick={() => go("product_detail", p)}
            palette={palette}
          />
        ))}
      </div>

      <section style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: "10px", overflow: "hidden" }}>
        <div
          style={{
            padding: "10px 12px",
            borderBottom: `1px solid ${palette.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ margin: 0, fontSize: "12px", fontWeight: "800", color: C.primary, fontFamily: FONT }}>Fulfillment Dashboard</p>
          <div style={{ display: "flex", gap: "6px" }}>
            {[["all", "All"], ["pending", "Pending"], ["paid", "Paid"], ["collected", "Collected"]].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                style={{
                  border: `1px solid ${filter === key ? C.primary : palette.border}`,
                  borderRadius: "999px",
                  background: filter === key ? C.primaryLight : palette.surface,
                  color: filter === key ? C.primary : palette.textMuted,
                  fontSize: "9px",
                  fontWeight: "700",
                  padding: "3px 8px",
                  cursor: "pointer",
                  fontFamily: FONT,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1.3fr .5fr .9fr .8fr 1fr",
            gap: "8px",
            padding: "8px 12px",
            borderBottom: `1px solid ${palette.border}`,
            background: palette.surfaceAlt,
          }}
        >
          {["Student Name", "Item Ordered", "Size", "Order Date", "Flow Status", "Fulfillment"].map((h) => (
            <span key={h} style={{
              fontSize: "9px",
              color: palette.textDim,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontWeight: "700",
              fontFamily: FONT,
            }}>
              {h}
            </span>
          ))}
        </div>

        {filteredRows.map((r, idx) => (
          <div
            key={r.id}
            onClick={() => go("order_detail", r)}
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1.3fr .5fr .9fr .8fr 1fr",
              gap: "8px",
              padding: "9px 12px",
              borderBottom: idx === filteredRows.length - 1 ? "none" : `1px solid ${palette.border}`,
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <span style={{
              fontSize: "11px",
              color: palette.text,
              fontWeight: "600",
              fontFamily: FONT,
            }}>
              {r.delegate}
            </span>
            <span style={{
              fontSize: "11px",
              color: palette.textMuted,
              fontFamily: FONT,
            }}>
              {r.item}
            </span>
            <span style={{
              fontSize: "11px",
              color: palette.textMuted,
              fontFamily: FONT,
            }}>
              {r.size}
            </span>
            <span style={{
              fontSize: "11px",
              color: palette.textMuted,
              fontFamily: FONT,
            }}>
              {r.date}
            </span>
            <StatusPill type={r.status}>{r.status}</StatusPill>
            <button
              onClick={(e) => e.stopPropagation()}
              style={{
                justifySelf: "start",
                border: "none",
                borderRadius: "6px",
                background:
                  r.action === "Picked Up"
                    ? C.successLight
                    : r.action === "Process Payment"
                    ? palette.surfaceAlt
                    : C.secondary,
                color:
                  r.action === "Picked Up"
                    ? C.success
                    : r.action === "Process Payment"
                    ? palette.textMuted
                    : C.white,
                borderColor: palette.border,
                fontSize: "9px",
                fontWeight: "700",
                padding: "5px 8px",
                cursor: "pointer",
                fontFamily: FONT,
              }}
            >
              {r.action}
            </button>
          </div>
        ))}

        {!filteredRows.length && (
          <div
            style={{
              padding: "20px 12px",
              textAlign: "center",
              color: palette.textMuted,
              fontSize: "12px",
              fontFamily: FONT,
            }}
          >
            No orders found.
          </div>
        )}

        <div
          style={{
            padding: "8px 12px",
            borderTop: `1px solid ${palette.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{
            fontSize: "9px",
            color: palette.textDim,
            fontFamily: FONT,
          }}>
            Showing {filteredRows.length} of {orderRows.length} orders
          </span>
          <div style={{
            display: "flex",
            gap: "4px",
          }}>
            <button
              style={{
                width: "18px",
                height: "18px",
                border: `1px solid ${palette.border}`,
                background: palette.surface,
                color: palette.text,
                borderRadius: "4px",
                fontSize: "10px",
                cursor: "pointer",
              }}
            >
              <>
                {"<"}
              </>
            </button>
            <button
              style={{
                width: "18px",
                height: "18px",
                border: `1px solid ${palette.border}`,
                background: palette.surface,
                color: palette.text,
                borderRadius: "4px",
                fontSize: "10px",
                cursor: "pointer",
              }}
            >
              <>
                {"<"}
              </>
            </button>
          </div>
        </div>
      </section>
    </>
  );

  const renderInventoryPage = () => (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: "26px", color: palette.text, fontWeight: "800" }}>Central Stock Control</h1>
          <p style={{ margin: 0, fontSize: "12px", color: palette.textMuted }}>Monitor turnover rates and manage procurement with real-time stock updates.</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            style={{
              border: `1px solid ${palette.border}`,
              borderRadius: "8px",
              background: palette.surface,
              color: palette.textMuted,
              fontSize: "11px",
              fontWeight: "700",
              padding: "9px 14px",
              cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            Export
          </button>
          <button
            onClick={() => go("create_product")}
            style={{
              border: "none",
              borderRadius: "8px",
              background: C.primary,
              color: C.white,
              fontSize: "11px",
              fontWeight: "700",
              padding: "9px 14px",
              cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            Add Product
          </button>
        </div>
      </div>

      <div
        style={{
          background: palette.surface,
          borderRadius: "14px",
          border: `1px solid ${palette.border}`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
            padding: "10px 16px",
            background: palette.surfaceAlt,
            borderBottom: `1px solid ${palette.border}`,
          }}
        >
          {["Product", "Category", "Stock", "Sold (30d)", "Status"].map((h) => (
            <span key={h} style={{
              fontSize: "10px",
              fontWeight: "700",
              color: palette.textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
            }}>
              {h}
            </span>
          ))}
        </div>
        {stockRows.map((s, i) => {
          const statusMeta = s.status === "out_stock"
            ? { label: "Out Stock", bg: C.errorLight, color: C.error }
            : s.status === "low_stock"
              ? { label: "Low Stock", bg: C.warningLight, color: C.warning }
              : { label: "In Stock", bg: C.successLight, color: C.success };
          return (
            <div
              key={s.id}
              onClick={() => go("product_detail", s)}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
                padding: "12px 16px",
                borderBottom: i === stockRows.length - 1 ? "none" : `1px solid ${palette.border}`,
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <span style={{
                fontSize: "12px",
                fontWeight: "700",
                color: palette.text,
              }}>
                {s.name}
              </span>
              <span style={{
                fontSize: "12px",
                color: palette.textMuted,
              }}>
                {s.category}
              </span>
              <span style={{
                fontSize: "12px",
                fontWeight: "700",
                color: s.stock < 20 ? C.warning : palette.text,
              }}>
                {s.stock}
              </span>
              <span style={{
                fontSize: "12px",
                color: palette.textMuted,
              }}>
                {s.sold}
              </span>
              <span
                style={{
                  width: "fit-content",
                  fontSize: "10px",
                  fontWeight: "700",
                  padding: "3px 9px",
                  borderRadius: "100px",
                  background: statusMeta.bg,
                  color: statusMeta.color,
                }}
              >
                {statusMeta.label}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: "12px", marginTop: "14px" }}>
        <button
          onClick={() => go("reports")}
          style={{
            border: `1px solid ${palette.border}`,
            borderRadius: "8px",
            background: palette.surface,
            color: C.primary,
            fontSize: "12px",
            fontWeight: "700",
            padding: "9px 14px",
            cursor: "pointer",
            fontFamily: FONT,
          }}
        >
          Open Reports
        </button>
        <button
          onClick={() => go("pickup_slots")}
          style={{
            border: "none",
            borderRadius: "8px",
            background: C.secondary,
            color: C.white,
            fontSize: "12px",
            fontWeight: "700",
            padding: "9px 14px",
            cursor: "pointer",
            fontFamily: FONT,
          }}
        >
          Manage Pickup Slots
        </button>
      </div>
    </>
  );

  const renderReportsPage = () => (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: "26px", color: palette.text, fontWeight: "800" }}>Sales Insights & Revenue Growth</h1>
          <p style={{ margin: 0, fontSize: "12px", color: palette.textMuted }}>Track revenue performance and identify top-demand products.</p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "12px",
          marginBottom: "14px",
        }}
      >
        {[
          ["Total Revenue", "$428,190", "+12.4%"],
          ["New Customers", "1,842", "Q3 peak"],
          ["Annual Target", "82%", "$100k goal"],
        ].map(([k, v, sub], idx) => (
          <div key={k} style={{
            background: idx === 1 ? C.primary : palette.surface,
            border: idx === 2 ? `1px solid ${C.terDark}` : `1px solid ${palette.border}`,
            borderRadius: "12px",
            padding: "16px",
          }}>
            <p style={{
              margin: "0 0 6px",
              fontSize: "10px",
              fontWeight: "700",
              color: idx === 1 ? "rgba(255,255,255,.6)" : palette.textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}>
              {k}
            </p>
            <p style={{
              margin: "0 0 4px",
              fontSize: "30px",
              fontWeight: "800",
              color: idx === 1 ? C.white : palette.text,
            }}>
              {v}
            </p>
            <p style={{
              margin: 0,
              fontSize: "11px",
              color: idx === 1 ? "rgba(255,255,255,.6)" : palette.textMuted,
            }}>
              {sub}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderRadius: "12px",
          padding: "16px",
        }}
      >
        <p style={{
          margin: "0 0 8px",
          fontSize: "14px",
          fontWeight: "700",
          color: palette.text,
        }}>
          High Demand Products
        </p>
        {[
          ["Signature Tech-Tee", 2410],
          ["Urban Commuter Pack", 1890],
          ["Slate Glass Tumbler", 1460],
          ["Bamboo Notebook", 920],
        ].map(([name, sold]) => (
          <div key={name} style={{
            marginBottom: "10px",
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "4px",
            }}>
              <span style={{
                fontSize: "12px",
                color: palette.text,
                fontWeight: "600",
              }}>
                {name}
              </span>
              <span style={{
                fontSize: "11px",
                color: palette.textMuted,
              }}>
                {sold.toLocaleString()} Sold
              </span>
            </div>
            <div
              style={{
                background: palette.surfaceAlt,
                borderRadius: "100px",
                height: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(sold / 2410) * 100}%`,
                  background: C.secondary,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderOrderDetailPage = () => (
    <>
      <button
        onClick={() => go("merchandise")}
        style={{
          border: "none",
          background: "none",
          color: palette.textMuted,
          fontSize: "11px",
          fontWeight: "700",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          cursor: "pointer",
          marginBottom: "8px",
          fontFamily: FONT,
        }}
      >
        {"<"}
        Back to Orders
      </button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: "24px", color: palette.text, fontWeight: "800" }}>Order #{String(selectedOrder.id).padStart(4, "0")}</h1>
          <p style={{ margin: 0, fontSize: "12px", color: palette.textMuted }}>Review student details and update fulfillment status.</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={handlePaymentValid}
            disabled={isUpdatingOrder}
            style={{
              border: "none",
              borderRadius: "8px",
              background: C.secondary,
              color: C.white,
              fontSize: "11px",
              fontWeight: "700",
              padding: "9px 14px",
              cursor: isUpdatingOrder ? "not-allowed" : "pointer",
              opacity: isUpdatingOrder ? 0.7 : 1,
              fontFamily: FONT,
            }}
          >
            Payment Valid
          </button>
          <button
            onClick={handlePaymentRejected}
            disabled={isUpdatingOrder}
            style={{
              border: `1px solid ${C.error}`,
              borderRadius: "8px",
              background: C.errorLight,
              color: C.error,
              fontSize: "11px",
              fontWeight: "700",
              padding: "9px 14px",
              cursor: isUpdatingOrder ? "not-allowed" : "pointer",
              opacity: isUpdatingOrder ? 0.7 : 1,
              fontFamily: FONT,
            }}
          >
            Payment Rejected
          </button>
          <button
            onClick={handleMarkCollected}
            disabled={isUpdatingOrder}
            style={{
              border: "none",
              borderRadius: "8px",
              background: C.primary,
              color: C.white,
              fontSize: "11px",
              fontWeight: "700",
              padding: "9px 14px",
              cursor: isUpdatingOrder ? "not-allowed" : "pointer",
              opacity: isUpdatingOrder ? 0.7 : 1,
              fontFamily: FONT,
            }}
          >
            Mark Collected
          </button>
        </div>
      </div>

      {orderActionError && (
        <div
          style={{
            marginBottom: "10px",
            padding: "10px 12px",
            borderRadius: "8px",
            background: C.errorLight,
            border: `1px solid ${C.error}`,
            color: C.error,
            fontSize: "12px",
            fontWeight: "700",
            fontFamily: FONT,
          }}
        >
          {orderActionError}
        </div>
      )}
      {orderActionMessage && (
        <div
          style={{
            marginBottom: "10px",
            padding: "10px 12px",
            borderRadius: "8px",
            background: C.successLight,
            border: `1px solid ${C.success}`,
            color: C.success,
            fontSize: "12px",
            fontWeight: "700",
            fontFamily: FONT,
          }}
        >
          {orderActionMessage}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "14px" }}>
        <div
          style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderRadius: "12px",
            padding: "16px",
          }}
        >
          <p style={{
            margin: "0 0 10px",
            fontSize: "13px",
            fontWeight: "700",
            color: palette.text,
          }}>
            Student Profile
          </p>
          <p style={{
            margin: "0 0 2px",
            fontSize: "15px",
            fontWeight: "800",
            color: palette.text,
          }}>
            {selectedOrder.delegate}
          </p>
          <p style={{
            margin: "0 0 12px",
            fontSize: "11px",
            color: palette.textMuted,
          }}>
            ID: 2024-{String(selectedOrder.id).padStart(4, "0")}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: `1px solid ${palette.border}`,
            }}
          >
            <span style={{
              fontSize: "11px",
              color: palette.textMuted,
            }}>
              Payment
            </span>
            <StatusPill type={selectedOrder.status}>{selectedOrder.status}</StatusPill>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
            }}
          >
            <span style={{
              fontSize: "11px",
              color: palette.textMuted,
            }}>
              Pickup
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: "700",
                background: selectedOrder.status === "collected" ? C.successLight : C.errorLight,
                color: selectedOrder.status === "collected" ? C.success : C.error,
                padding: "3px 8px",
                borderRadius: "100px",
              }}
            >
              {selectedOrder.status === "collected" ? "Collected" : "Not Collected"}
            </span>
          </div>
        </div>

        <div
          style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderRadius: "12px",
            padding: "16px",
          }}
        >
          <p style={{
            margin: "0 0 12px",
            fontSize: "13px",
            fontWeight: "700",
            color: palette.text,
          }}>
            Ordered Item
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: "10px",
              borderBottom: `1px solid ${palette.border}`,
            }}
          >
            <div>
              <p style={{
                margin: "0 0 2px",
                fontSize: "13px",
                fontWeight: "700",
                color: palette.text,
              }}>
                {selectedOrder.item}
              </p>
              <p style={{
                margin: 0,
                fontSize: "11px",
                color: palette.textMuted,
              }}>
                Size {selectedOrder.size} • {selectedOrder.date}
              </p>
            </div>
            <p style={{
              margin: 0,
              fontSize: "16px",
              fontWeight: "800",
              color: palette.text,
            }}>
              ${Number(selectedOrder.totalAmount || 0).toFixed(2)}
            </p>
          </div>
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{
              fontSize: "12px",
              color: palette.textMuted,
            }}>
              Total Amount
            </span>
            <span style={{
              fontSize: "14px",
              color: palette.text,
              fontWeight: "800",
            }}>
              ${Number(selectedOrder.totalAmount || 0).toFixed(2)}
            </span>
          </div>
          <div style={{ marginTop: "10px", display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ fontSize: "11px", color: palette.textMuted, fontFamily: FONT }}>Payment Slip</span>
            {getSlipUrl(selectedOrder.paymentSlipUrl) ? (
              <a
                href={getSlipUrl(selectedOrder.paymentSlipUrl)}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  color: C.primary,
                  textDecoration: "underline",
                  fontFamily: FONT,
                }}
              >
                Open Slip
              </a>
            ) : (
              <span style={{ fontSize: "11px", color: palette.textMuted, fontFamily: FONT }}>Not attached</span>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const renderProductDetailPage = () => (
    <>
      <button
        onClick={() => go("inventory")}
        style={{
          border: "none",
          background: "none",
          color: palette.textMuted,
          fontSize: "11px",
          fontWeight: "700",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          cursor: "pointer",
          marginBottom: "8px",
          fontFamily: FONT,
        }}
      >
        {"<"}
        Back to Catalog
      </button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: "24px", color: palette.text, fontWeight: "800" }}>{selectedProduct.name || "Product Detail"}</h1>
          <p style={{ margin: 0, fontSize: "12px", color: palette.textMuted }}>Manage this product, monitor all related orders, and start distribution in one place.</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={handleDeleteProduct}
            disabled={isDeletingProduct || isSavingProduct}
            style={{
              border: `1px solid ${C.error}`,
              borderRadius: "8px",
              background: C.errorLight,
              color: C.error,
              fontSize: "11px",
              fontWeight: "700",
              padding: "9px 14px",
              cursor: isDeletingProduct || isSavingProduct ? "not-allowed" : "pointer",
              opacity: isDeletingProduct || isSavingProduct ? 0.7 : 1,
              fontFamily: FONT,
            }}
          >
            {isDeletingProduct ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={handleSaveProductChanges}
            disabled={isSavingProduct || isDeletingProduct}
            style={{
              border: "none",
              borderRadius: "8px",
              background: C.primary,
              color: C.white,
              fontSize: "11px",
              fontWeight: "700",
              padding: "9px 14px",
              cursor: isSavingProduct || isDeletingProduct ? "not-allowed" : "pointer",
              opacity: isSavingProduct || isDeletingProduct ? 0.7 : 1,
              fontFamily: FONT,
            }}
          >
            {isSavingProduct ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {productPanelError && (
        <div style={{ marginBottom: "10px", border: `1px solid ${C.error}`, background: C.errorLight, color: C.error, borderRadius: "8px", padding: "10px 12px", fontSize: "12px", fontWeight: "700", fontFamily: FONT }}>
          {productPanelError}
        </div>
      )}
      {productPanelMessage && (
        <div style={{ marginBottom: "10px", border: `1px solid ${C.success}`, background: C.successLight, color: C.success, borderRadius: "8px", padding: "10px 12px", fontSize: "12px", fontWeight: "700", fontFamily: FONT }}>
          {productPanelMessage}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "14px" }}>
        <div
          style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderRadius: "12px",
            padding: "16px",
          }}
        >
          <p style={{
            margin: "0 0 8px",
            fontSize: "11px",
            color: palette.textMuted,
            fontWeight: "700",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>
            Availability
          </p>
          <p style={{
            margin: "0 0 8px",
            fontSize: "12px",
            color: Number(productForm.inventory || 0) > 0 ? C.success : C.error,
            fontWeight: "700",
          }}>
            {Number(productForm.inventory || 0) > 0 ? "In Stock" : "Out of Stock"}
          </p>
          <p style={{ margin: "0 0 10px", fontSize: "11px", color: palette.textMuted, fontFamily: FONT }}>
            Total Orders: <strong style={{ color: palette.text }}>{productOrders.length}</strong>
          </p>
          <p style={{ margin: "0 0 10px", fontSize: "11px", color: palette.textMuted, fontFamily: FONT }}>
            Paid Pending Distribution: <strong style={{ color: palette.text }}>{productOrders.filter((o) => String(o.status || "").toUpperCase().includes("PAID") || String(o.status || "").toUpperCase().includes("CONFIRM") || String(o.status || "").toUpperCase().includes("APPROV")).length}</strong>
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{
              fontSize: "12px",
              color: palette.textMuted,
            }}>
              Visible in Store
            </span>
            <button
              onClick={() => setProductForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
              style={{
                width: "36px",
                height: "20px",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                background: productForm.isActive ? C.secondary : C.border,
                position: "relative",
              }}
            >
              <span
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  background: C.white,
                  position: "absolute",
                  top: "3px",
                  left: productForm.isActive ? "19px" : "3px",
                }}
              />
            </button>
          </div>

          <div style={{ marginTop: "12px" }}>
            <span style={{ display: "block", fontSize: "11px", color: palette.textMuted, marginBottom: "6px", fontFamily: FONT }}>
              Distribution Pickup Point
            </span>
            <select
              value={distributionLocation}
              onChange={(e) => setDistributionLocation(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: "8px",
                border: `1px solid ${palette.border}`,
                background: palette.surfaceAlt,
                color: palette.text,
                fontFamily: FONT,
                fontSize: "12px",
              }}
            >
              <option value="">Choose location for verified orders</option>
              {SLIIT_DISTRIBUTION_POINTS.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            <button
              onClick={handleStartDistribution}
              disabled={isDistributing}
              style={{
                marginTop: "8px",
                width: "100%",
                border: "none",
                borderRadius: "8px",
                background: C.secondary,
                color: C.white,
                fontSize: "11px",
                fontWeight: "700",
                padding: "9px 12px",
                cursor: isDistributing ? "not-allowed" : "pointer",
                opacity: isDistributing ? 0.7 : 1,
                fontFamily: FONT,
              }}
            >
              {isDistributing ? "Starting..." : "Start Distributing"}
            </button>
          </div>
        </div>

        <div
          style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderRadius: "12px",
            padding: "16px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <input
              value={productForm.name}
              onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: `1px solid ${palette.border}`,
                background: palette.surfaceAlt,
                color: palette.text,
                fontFamily: FONT,
                fontSize: "12px",
              }}
            />
            <input
              value={productForm.sku || "NXR-001"}
              readOnly
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: `1px solid ${palette.border}`,
                background: palette.surfaceAlt,
                color: palette.text,
                fontFamily: FONT,
                fontSize: "12px",
              }}
            />
            <input
              value={productForm.price}
              onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: `1px solid ${palette.border}`,
                background: palette.surfaceAlt,
                color: palette.text,
                fontFamily: FONT,
                fontSize: "12px",
              }}
            />
            <input
              value={productForm.inventory}
              onChange={(e) => setProductForm((prev) => ({ ...prev, inventory: e.target.value }))}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: `1px solid ${palette.border}`,
                background: palette.surfaceAlt,
                color: palette.text,
                fontFamily: FONT,
                fontSize: "12px",
              }}
            />
          </div>
          <textarea
            value={productForm.description}
            onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
            rows={4}
            style={{
              width: "100%",
              marginTop: "10px",
              padding: "9px 12px",
              borderRadius: "8px",
              border: `1px solid ${palette.border}`,
              background: palette.surfaceAlt,
              color: palette.text,
              fontFamily: FONT,
              fontSize: "12px",
              resize: "vertical",
            }}
          />

          <div style={{ marginTop: "12px", borderTop: `1px solid ${palette.border}`, paddingTop: "10px" }}>
            <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: "700", color: palette.text, fontFamily: FONT }}>
              Orders for this Product
            </p>
            {productOrdersLoading ? (
              <p style={{ margin: 0, fontSize: "12px", color: palette.textMuted, fontFamily: FONT }}>Loading orders...</p>
            ) : productOrders.length === 0 ? (
              <p style={{ margin: 0, fontSize: "12px", color: palette.textMuted, fontFamily: FONT }}>No orders found for this product yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "260px", overflowY: "auto", paddingRight: "4px" }}>
                {productOrders.map((order) => (
                  <div key={order.id} style={{ border: `1px solid ${palette.border}`, borderRadius: "10px", padding: "10px", background: palette.surfaceAlt }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "start" }}>
                      <div>
                        <p style={{ margin: "0 0 2px", fontSize: "12px", fontWeight: "700", color: palette.text, fontFamily: FONT }}>
                          {order.buyerName || "Student"} • Order #{order.id}
                        </p>
                        <p style={{ margin: 0, fontSize: "11px", color: palette.textMuted, fontFamily: FONT }}>
                          {formatOrderDate(order.createdAt)} • Qty {(order.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0)}
                        </p>
                      </div>
                      <span style={{ fontSize: "10px", fontWeight: "700", padding: "3px 8px", borderRadius: "999px", background: palette.surface, border: `1px solid ${palette.border}`, color: palette.textMuted, fontFamily: FONT }}>
                        {String(order.status || "PENDING").replaceAll("_", " ")}
                      </span>
                    </div>
                    <div style={{ marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "11px", color: palette.text, fontWeight: "700", fontFamily: FONT }}>
                        ${Number(order.totalAmount || 0).toFixed(2)}
                      </span>
                      {getSlipUrl(order.paymentSlipUrl) ? (
                        <a href={getSlipUrl(order.paymentSlipUrl)} target="_blank" rel="noreferrer" style={{ fontSize: "11px", fontWeight: "700", color: C.primary, textDecoration: "underline", fontFamily: FONT }}>
                          Open Slip
                        </a>
                      ) : (
                        <span style={{ fontSize: "11px", color: palette.textMuted, fontFamily: FONT }}>No Slip</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const renderPickupSlotsPage = () => (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: "24px", color: palette.text, fontWeight: "800" }}>Pickup Slot Management</h1>
          <p style={{ margin: 0, fontSize: "12px", color: palette.textMuted }}>Schedule and monitor merch pickup windows across campus.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "14px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {slotRows.map((slot) => {
            const pct = Math.round((slot.assigned / slot.total) * 100);
            return (
              <div
                key={slot.id}
                style={{
                  background: palette.surface,
                  border: `1px solid ${palette.border}`,
                  borderRadius: "12px",
                  padding: "14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <p style={{
                    margin: 0,
                    fontSize: "13px",
                    fontWeight: "700",
                    color: palette.text,
                  }}>
                    {slot.label}
                  </p>
                  {slot.hot && (
                    <span
                      style={{
                        fontSize: "10px",
                        color: C.white,
                        background: C.error,
                        borderRadius: "100px",
                        padding: "2px 8px",
                        fontWeight: "700",
                      }}
                    >
                      HOT
                    </span>
                  )}
                </div>
                <p style={{
                  margin: "0 0 6px",
                  fontSize: "11px",
                  color: palette.textMuted,
                }}>
                  {slot.date} • {slot.time} • {slot.loc}
                </p>
                <div
                  style={{
                    background: palette.surfaceAlt,
                    borderRadius: "100px",
                    height: "5px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: pct > 90 ? C.error : pct > 60 ? C.secondary : C.success,
                    }}
                  />
                </div>
                <p style={{
                  margin: "6px 0 0",
                  fontSize: "10px",
                  color: palette.textDim,
                }}>
                  Orders Assigned {slot.assigned}/{slot.total}
                </p>
              </div>
            );
          })}
        </div>

        <div
          style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderRadius: "12px",
            padding: "14px",
            alignSelf: "start",
          }}
        >
          <p style={{
            margin: "0 0 12px",
            fontSize: "13px",
            fontWeight: "700",
            color: palette.text,
          }}>
            Create New Slot
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <input type="date" style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: "8px",
              border: `1px solid ${palette.border}`,
              background: palette.surfaceAlt,
              color: palette.text,
              fontFamily: FONT,
              fontSize: "12px",
            }}
          />
          <input type="time" style={{
            width: "100%",
            padding: "8px 10px",
            borderRadius: "8px",
            border: `1px solid ${palette.border}`,
            background: palette.surfaceAlt,
            color: palette.text,
            fontFamily: FONT,
            fontSize: "12px",
          }}
          />
          <input
            placeholder="Location"
            defaultValue="Main Student Union - East Wing"
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: "8px",
              border: `1px solid ${palette.border}`,
              background: palette.surfaceAlt,
              color: palette.text,
              fontFamily: FONT,
              fontSize: "12px",
            }}
          />
          <button
            style={{
              border: "none",
              borderRadius: "8px",
              background: C.primary,
              color: C.white,
              fontSize: "11px",
              fontWeight: "700",
              padding: "9px 14px",
              cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            Schedule Slot
          </button>
        </div>
      </div>
      </div>
    </>
  );

  const renderCreateProductPage = () => (
    <>
      <button
        onClick={() => go("merchandise")}
        style={{
          border: "none",
          background: "none",
          color: palette.textMuted,
          fontSize: "11px",
          fontWeight: "700",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          cursor: "pointer",
          marginBottom: "8px",
          fontFamily: FONT,
        }}
      >
        {"<"}
        Back to Merchandise
      </button>
      {formError && (
        <div
          style={{
            background: C.errorLight,
            color: C.errorDark,
            padding: "8px",
            borderRadius: "4px",
            marginTop: "8px",
            fontFamily: FONT,
            fontSize: "12px",
          }}
        >
          {formError}
        </div>
      )}
      {formSuccess && (
        <div
          style={{
            background: C.successLight,
            border: `1px solid ${C.success}`,
            borderRadius: "10px",
            padding: "10px 12px",
            fontSize: "12px",
            color: C.success,
            fontWeight: "700",
            marginBottom: "10px",
            fontFamily: FONT,
          }}
        >
          {formSuccess}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: "24px", color: palette.text, fontWeight: "800" }}>Create New Product</h1>
          <p style={{ margin: 0, fontSize: "12px", color: palette.textMuted }}>Define variants, pricing, media, and visibility.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "14px" }}>
        <div
          style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderRadius: "12px",
            padding: "16px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <input
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: `1px solid ${palette.border}`,
                background: palette.surfaceAlt,
                color: palette.text,
                fontFamily: FONT,
                fontSize: "12px",
              }}
            />
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct((prev) => ({ ...prev, category: e.target.value }))}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: `1px solid ${palette.border}`,
                background: palette.surfaceAlt,
                color: palette.text,
                fontFamily: FONT,
                fontSize: "12px",
              }}
            >
              {["Hoodie", "T-Shirt", "Accessories", "Stationery", "Lifestyle"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <textarea
            rows={4}
            placeholder="Product description"
            value={newProduct.description}
            onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: "8px",
              border: `1px solid ${palette.border}`,
              background: palette.surfaceAlt,
              color: palette.text,
              fontFamily: FONT,
              fontSize: "12px",
              resize: "vertical",
              marginBottom: "10px",
            }}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <input
              type="number"
              placeholder="Stock"
              value={newProduct.inventory}
              onChange={(e) => setNewProduct((prev) => ({ ...prev, inventory: e.target.value }))}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: `1px solid ${palette.border}`,
                background: palette.surfaceAlt,
                color: palette.text,
                fontFamily: FONT,
                fontSize: "12px",
              }}
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: `1px solid ${palette.border}`,
                background: palette.surfaceAlt,
                color: palette.text,
                fontFamily: FONT,
                fontSize: "12px",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div
            style={{
              background: palette.surface,
              border: `1px solid ${palette.border}`,
              borderRadius: "12px",
              padding: "16px",
            }}
        >
            <input ref={fileRef} type="file" accept="image/*" style={{
              display: "none",
            }} onChange={(e) => {
              const file = e.target.files && e.target.files[0];
              if (file) {
                setProductImageFile(file);
                setPreview(URL.createObjectURL(file));
              }
            }} />
            <div
              onClick={() => fileRef.current && fileRef.current.click()}
              style={{
                border: `2px dashed ${palette.border}`,
                borderRadius: "10px",
                padding: "20px 14px",
                textAlign: "center",
                cursor: "pointer",
                background: palette.surfaceAlt,
              }}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    maxHeight: "180px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <>
                  <p style={{
                    margin: "0 0 6px",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: palette.text,
                  }}>
                    Upload Product Image
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: "10px",
                    color: palette.textDim,
                  }}>
                    JPG, PNG, WEBP • Max 5MB
                  </p>
                </>
              )}
            </div>
            <input
              placeholder="Image URL (optional)"
              value={newProduct.imageUrl}
              onChange={(e) => setNewProduct((prev) => ({ ...prev, imageUrl: e.target.value }))}
              style={{
                width: "100%",
                marginTop: "10px",
                padding: "8px 10px",
                borderRadius: "8px",
                border: `1px solid ${palette.border}`,
                background: palette.surfaceAlt,
                color: palette.text,
                fontFamily: FONT,
                fontSize: "12px",
              }}
            />
          </div>
          <div
            style={{
              background: palette.surface,
              border: `1px solid ${palette.border}`,
              borderRadius: "12px",
              padding: "16px",
            }}
        >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{
                fontSize: "12px",
                color: palette.text,
              }}>Public Visibility</span>
              <button
                onClick={() => setVisible((v) => !v)}
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "999px",
                  border: "none",
                  cursor: "pointer",
                  background: visible ? C.secondary : C.border,
                  position: "relative",
                }}
              >
                <span
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    background: C.white,
                    position: "absolute",
                    top: "3px",
                    left: visible ? "19px" : "3px",
                  }}
                />
              </button>
            </div>
            <button
              onClick={handleCreateProduct}
              disabled={isSaving}
              style={{
                width: "100%",
                marginTop: "10px",
                border: "none",
                borderRadius: "8px",
                background: C.secondary,
                color: C.white,
                fontSize: "11px",
                fontWeight: "700",
                padding: "9px 14px",
                cursor: "pointer",
                fontFamily: FONT,
                opacity: isSaving ? 0.7 : 1,
              }}
            >
              {isSaving ? "Creating..." : "Create Product"}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  const view = (() => {
    if (page === "inventory") return renderInventoryPage();
    if (page === "reports") return renderReportsPage();
    if (page === "order_detail") return renderOrderDetailPage();
    if (page === "product_detail") return renderProductDetailPage();
    if (page === "pickup_slots") return renderPickupSlotsPage();
    if (page === "create_product") return renderCreateProductPage();
    return renderMerchandisePage();
  })();

  return (
    <OrganizerShell page="events">
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 36px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          background: palette.pageBg,
          fontFamily: FONT,
        }}
      >
        <div
          style={{
            background: palette.surface,
            borderRadius: "16px",
            border: `1px solid ${palette.border}`,
            boxShadow: isDarkMode ? "none" : "0 2px 12px rgba(5,54,104,.04)",
            padding: "18px",
          }}
        >
          {view}
        </div>
      </div>
    </OrganizerShell>
  );
}
