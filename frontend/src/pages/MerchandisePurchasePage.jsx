import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { merchandiseAPI } from "../services/api";
import { getUser } from "../utils/auth";
import "./MerchandisePurchasePage.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const MerchandisePurchasePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [buyerName, setBuyerName] = useState(user?.name || "");
  const [buyerEmail, setBuyerEmail] = useState(user?.email || "");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [paymentSlipPreview, setPaymentSlipPreview] = useState(null);
  const [step, setStep] = useState("info"); // "info" or "payment"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Bank details
  const bankDetails = {
    bankName: "Premier Bank",
    accountHolder: "Campus Connect Events",
    accountNumber: "1234567890",
    routingNumber: "987654321",
  };

  // Get product from location state
  useEffect(() => {
    const state = location.state;
    if (state?.product) {
      setProduct(state.product);
    } else {
      setError("No product selected. Please select a product from the home page.");
    }
  }, [location.state]);

  const handlePaymentSlipChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!["image/png", "image/jpeg"].includes(file.type)) {
        setError("Please upload a PNG or JPG image only");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      
      setPaymentSlip(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPaymentSlipPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateInfoStep = () => {
    if (!buyerName.trim()) {
      setError("Please enter your name");
      return false;
    }
    if (!buyerEmail.trim()) {
      setError("Please enter your email");
      return false;
    }
    if (!buyerPhone.trim()) {
      setError("Please enter your phone number");
      return false;
    }
    if (!selectedSize.trim()) {
      setError("Please select a size");
      return false;
    }
    if (quantity < 1) {
      setError("Quantity must be at least 1");
      return false;
    }
    return true;
  };

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    if (validateInfoStep()) {
      setStep("payment");
      setError(null);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!paymentSlip) {
      setError("Please upload payment slip");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Upload payment slip first
      const formData = new FormData();
      formData.append("slip", paymentSlip);

      const token = localStorage.getItem("token");
      const uploadResponse = await fetch(
        `${API_BASE_URL}/merchandise/upload-payment-slip`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let uploadData;
      try {
        uploadData = await uploadResponse.json();
      } catch {
        // If response is not JSON, create error response
        uploadData = { success: false, message: "Payment slip upload failed" };
      }

      if (!uploadResponse.ok) {
        // Only show specific allowed error messages
        const allowedMessages = [
          "Only PNG and JPG files are allowed",
          "File size must be less than 5MB",
          "Payment slip file is required",
        ];

        const errorMessage = uploadData?.message || "Upload failed";
        const shouldShowError = allowedMessages.some((msg) => errorMessage.includes(msg));

        if (shouldShowError) {
          throw new Error(errorMessage);
        } else {
          // For any other error, throw generic message without details
          throw new Error("Payment slip upload failed");
        }
      }

      const paymentSlipUrl = uploadData.slipUrl;

      // Create order with payment slip reference
      const response = await merchandiseAPI.createOrder({
        buyerName: buyerName.trim(),
        buyerEmail: buyerEmail.trim(),
        buyerPhone: buyerPhone.trim(),
        paymentSlipUrl,
        items: [
          {
            productId: product.id,
            quantity: parseInt(quantity),
            unitPrice: Number(product.price) || 0,
            size: selectedSize,
          },
        ],
      });

      if (response?.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 2500);
      } else {
        setError(response?.message || "Failed to complete purchase. Please try again.");
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
      console.error("Purchase error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToInfo = () => {
    setStep("info");
    setError(null);
  };

  const totalPrice = product ? (Number(product.price) || 0) * quantity : 0;
  const stock = product ? Number(product.inventory || 0) : 0;

  if (success) {
    return (
      <div className="purchase-container">
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your purchase. A confirmation email will be sent shortly.</p>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="purchase-container">
        <div className="error-section">
          <div className="error-message">
            <h2>Oops!</h2>
            <p>{error}</p>
            <button 
              onClick={() => navigate("/")}
              className="btn-back"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="purchase-container">
      <div className="purchase-header">
        <button 
          onClick={() => navigate("/")}
          className="btn-back-nav"
        >
          ← Back
        </button>
        <h1>Purchase Merchandise</h1>
      </div>

      <div className="purchase-content">
        {/* Product Details */}
        <div className="product-section">
          <div className="product-image">
            <img 
              src={product?.image || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1200"}
              alt={product?.name}
            />
          </div>
          
          <div className="product-details">
            <div className="product-header">
              <h2>{product?.name}</h2>
              <div className="price-tag">${Number(product?.price || 0).toFixed(2)}</div>
            </div>

            <p className="product-description">
              {product?.description || "Limited edition campus merchandise"}
            </p>

            <div className="product-meta">
              <div className="meta-item">
                <span className="meta-label">Stock Available</span>
                <span className={`meta-value ${stock <= 0 ? 'out-of-stock' : stock < 10 ? 'low-stock' : ''}`}>
                  {stock} items
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Category</span>
                <span className="meta-value">Campus Merch</span>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Form */}
        <div className="form-section">
          {/* Step Indicator */}
          <div className="step-indicator">
            <div className={`step ${step === "info" ? "active" : "completed"}`}>
              <div className="step-number">1</div>
              <div className="step-label">Order Info</div>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step === "payment" ? "active" : ""}`}>
              <div className="step-number">2</div>
              <div className="step-label">Payment</div>
            </div>
          </div>

          {error && (
            <div className="error-box">
              <span>⚠</span>
              <p>{error}</p>
            </div>
          )}

          {/* STEP 1: Order Information */}
          {step === "info" && (
            <form onSubmit={handleContinueToPayment}>
              <h3>Order Details</h3>

              {/* Quantity Selector */}
              <div className="form-group">
                <label htmlFor="quantity">Quantity</label>
                <div className="quantity-control">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || stock <= 0}
                    className="qty-btn"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    disabled={stock <= 0}
                    className="qty-input"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                    disabled={quantity >= stock || stock <= 0}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
                <p className="helper-text">Available: {stock} items</p>
              </div>

              <div className="form-group">
                <label>Size</label>
                <div className="size-options">
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`size-btn ${selectedSize === size ? "selected" : ""}`}
                      disabled={stock <= 0}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {selectedSize && <p className="helper-text">Size: {selectedSize}</p>}
              </div>

              {/* Buyer Information */}
              <div className="divider">Your Information</div>

              <div className="form-group">
                <label htmlFor="buyerName">Full Name</label>
                <input
                  type="text"
                  id="buyerName"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Enter your full name"
                  disabled={stock <= 0}
                />
              </div>

              <div className="form-group">
                <label htmlFor="buyerEmail">Email Address</label>
                <input
                  type="email"
                  id="buyerEmail"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={stock <= 0}
                />
              </div>

              <div className="form-group">
                <label htmlFor="buyerPhone">Phone Number</label>
                <input
                  type="tel"
                  id="buyerPhone"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  disabled={stock <= 0}
                />
              </div>

              {/* Order Summary */}
              <div className="order-summary">
                <div className="summary-item">
                  <span>Unit Price</span>
                  <span>${Number(product?.price || 0).toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span>Quantity</span>
                  <span>×{quantity}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-total">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                disabled={stock <= 0}
                className="btn-purchase"
              >
                Continue to Payment
              </button>
            </form>
          )}

          {/* STEP 2: Payment */}
          {step === "payment" && (
            <form onSubmit={handlePlaceOrder}>
              <h3>Payment Details</h3>

              {/* Bank Details */}
              <div className="divider">Bank Transfer Information</div>

              <div className="bank-details">
                <div className="bank-field">
                  <label>Bank Name</label>
                  <div className="bank-info">{bankDetails.bankName}</div>
                </div>
                <div className="bank-field">
                  <label>Account Holder</label>
                  <div className="bank-info">{bankDetails.accountHolder}</div>
                </div>
                <div className="bank-field">
                  <label>Account Number</label>
                  <div className="bank-info">{bankDetails.accountNumber}</div>
                </div>
                <div className="bank-field">
                  <label>Routing Number</label>
                  <div className="bank-info">{bankDetails.routingNumber}</div>
                </div>
              </div>

              {/* Payment Slip Upload */}
              <div className="divider">Upload Payment Slip</div>

              <div className="form-group">
                <label htmlFor="paymentSlip">Payment Slip (PNG or JPG)</label>
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    id="paymentSlip"
                    accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                    onChange={handlePaymentSlipChange}
                    disabled={loading}
                    className="file-input"
                  />
                  <label htmlFor="paymentSlip" className="file-upload-label">
                    <div className="upload-icon">📸</div>
                    <div className="upload-text">
                      {paymentSlip ? (
                        <>
                          <strong>{paymentSlip.name}</strong>
                          <small>Click to change</small>
                        </>
                      ) : (
                        <>
                          <strong>Click to upload</strong>
                          <small>PNG or JPG (max 5MB)</small>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Slip Preview */}
              {paymentSlipPreview && (
                <div className="payment-slip-preview">
                  <img src={paymentSlipPreview} alt="Payment Slip Preview" />
                </div>
              )}

              {/* Order Summary */}
              <div className="order-summary">
                <div className="summary-item">
                  <span>Item Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-total">
                  <span>Amount to Transfer</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleBackToInfo}
                  disabled={loading}
                  className="btn-secondary"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || !paymentSlip}
                  className="btn-purchase"
                >
                  {loading ? "Processing..." : "Place Order"}
                </button>
              </div>

              <p className="disclaimer">
                Please ensure you have transferred the amount shown above to the bank account provided.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default MerchandisePurchasePage;
