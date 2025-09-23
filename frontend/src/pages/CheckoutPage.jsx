import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getProductById, createCustomerOrder } from "../services/api";
import { useNavigationBlock } from "../hooks/useNavigationBlock";
import { logout } from "../services/auth";
import "../css/CheckoutPage.css";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { productId } = useParams();

  // Enable navigation blocking for checkout page
  useNavigationBlock(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "IN",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD"); // COD | UPI | CARD
  const [notes, setNotes] = useState("");
  const [placing, setPlacing] = useState(false);

  // Handle force logout from navigation blocking
  useEffect(() => {
    const handleForceLogout = async () => {
      await logout();
      navigate("/login", { replace: true });
    };

    window.addEventListener('forceLogout', handleForceLogout);
    
    return () => {
      window.removeEventListener('forceLogout', handleForceLogout);
    };
  }, [navigate]);

  // Auth gate: redirect to login if not authenticated, and preserve return URL
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      const redirect = encodeURIComponent(`/checkout/${productId}`);
      navigate(`/login?redirect=${redirect}`, { replace: true });
    }
  }, [navigate, productId]);

  // Load product to show summary and price
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getProductById(productId);
        if (mounted) setProduct(data);
      } catch (e) {
        if (mounted) setError(e?.message || "Failed to load product");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (productId) load();
    return () => { mounted = false; };
  }, [productId]);

  const maxQty = useMemo(() => Math.max(0, Number(product?.stock) || 0), [product]);
  const unitPrice = useMemo(() => Number(product?.price) || 0, [product]);
  const totalAmount = useMemo(() => Math.max(1, quantity) * unitPrice, [quantity, unitPrice]);

  const updateAddr = (k, v) => setShippingAddress(prev => ({ ...prev, [k]: v }));

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!product?._id && !product?.id) return;
    if (maxQty < 1) return alert("Out of stock");

    // Basic field checks (Flipkart-like minimal validation)
    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.line1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
      return alert("Please complete the shipping address");
    }

    try {
      setPlacing(true);
      await createCustomerOrder({
        productId: product._id || product.id,
        quantity: Math.min(Math.max(1, Number(quantity) || 1), maxQty || 1),
        shippingAddress,
        notes: notes?.trim() ? notes.trim() : undefined,
        paymentMethod,
      });
      alert("Order placed! Track it under My Orders.");
      navigate("/dashboard");
    } catch (e2) {
      alert(e2?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <Link to="/dashboard" className="back-link">← Back</Link>
        <h2 className="checkout-title">Checkout</h2>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : !product ? (
        <div className="empty">Product not found.</div>
      ) : (
        <div className="checkout-grid">
          {/* Left: Address + Payment */}
          <form onSubmit={placeOrder}>
            <div className="checkout-card">
              <h3 className="section-title">Delivery Address</h3>
              <div className="form-grid">
                <div className="field">
                  <label>Full Name</label>
                  <input value={shippingAddress.fullName} onChange={e => updateAddr("fullName", e.target.value)} required />
                </div>
                <div className="field">
                  <label>Phone</label>
                  <input value={shippingAddress.phone} onChange={e => updateAddr("phone", e.target.value)} required />
                </div>
                <div className="field full">
                  <label>Address Line 1</label>
                  <input value={shippingAddress.line1} onChange={e => updateAddr("line1", e.target.value)} required />
                </div>
                <div className="field full">
                  <label>Address Line 2 (optional)</label>
                  <input value={shippingAddress.line2} onChange={e => updateAddr("line2", e.target.value)} />
                </div>
                <div className="field">
                  <label>City</label>
                  <input value={shippingAddress.city} onChange={e => updateAddr("city", e.target.value)} required />
                </div>
                <div className="field">
                  <label>State</label>
                  <input value={shippingAddress.state} onChange={e => updateAddr("state", e.target.value)} required />
                </div>
                <div className="field">
                  <label>PIN Code</label>
                  <input value={shippingAddress.postalCode} onChange={e => updateAddr("postalCode", e.target.value)} required />
                </div>
                <div className="field">
                  <label>Country</label>
                  <input value={shippingAddress.country} onChange={e => updateAddr("country", e.target.value)} />
                </div>
              </div>
            </div>

            <div className="checkout-card" style={{ marginTop: 16 }}>
              <h3 className="section-title">Payment Options</h3>
              <div className="pm-options">
                <label className={`pm-tile ${paymentMethod === "COD" ? "active" : ""}`}>
                  <input type="radio" name="pm" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} />
                  Cash on Delivery
                </label>
                <label className={`pm-tile ${paymentMethod === "UPI" ? "active" : ""}`}>
                  <input type="radio" name="pm" checked={paymentMethod === "UPI"} onChange={() => setPaymentMethod("UPI")} />
                  UPI (coming soon)
                </label>
                <label className={`pm-tile ${paymentMethod === "CARD" ? "active" : ""}`}>
                  <input type="radio" name="pm" checked={paymentMethod === "CARD"} onChange={() => setPaymentMethod("CARD")} />
                  Card (coming soon)
                </label>
              </div>
            </div>

            <div className="checkout-card" style={{ marginTop: 16 }}>
              <h3 className="section-title">Notes</h3>
              <div className="field">
                <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any delivery instructions?" />
              </div>
            </div>

            <div className="actions" style={{ marginTop: 16 }}>
              <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost">Cancel</button>
              <button disabled={placing || maxQty < 1} type="submit" className="btn btn-primary">
                {placing ? "Placing..." : "Place Order"}
              </button>
            </div>
          </form>

          {/* Right: Order Summary */}
          <div className="checkout-card summary-card">
            <h3 className="section-title">Order Summary</h3>
            <div className="product-line">
              <div className="thumb">
                {product?.image ? (
                  <img src={product.image} alt={product?.name} />
                ) : (
                  <span>📦</span>
                )}
              </div>
              <div className="p-meta">
                <div className="p-name">{product?.name}</div>
                <div className="p-sub">Grade: {product?.grade || "-"}</div>
                <div className="p-price">₹{unitPrice}/kg</div>
              </div>
            </div>

            <div className="qty-row">
              <span>Quantity</span>
              <div className="qty-control">
                <button type="button" onClick={() => setQuantity(q => Math.max(1, (q || 1) - 1))} disabled={quantity <= 1}>-</button>
                <input type="number" min={1} max={maxQty || 1} value={quantity} onChange={(e) => setQuantity(Math.min(Math.max(1, Number(e.target.value) || 1), maxQty || 1))} />
                <button type="button" onClick={() => setQuantity(q => Math.min((q || 1) + 1, maxQty || 1))} disabled={quantity >= (maxQty || 1)}>+</button>
              </div>
            </div>

            <div className={`stock ${maxQty > 0 ? "ok" : "bad"}`}>
              {maxQty > 0 ? `${maxQty} kg in stock` : "Out of stock"}
            </div>

            <div className="hr" />
            <div className="totals">
              <span>Total</span>
              <span>₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="p-sub" style={{ marginTop: 6 }}>
              Inclusive of all taxes
            </div>
          </div>
        </div>
      )}
    </div>
  );
}