import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import "../../../css/FarmerDashboard.css";

// Manage products to sell (persisted in database)
export default function ProductManager() {
  const emptyForm = {
    name: "",
    price: "",
    stock: "",
    grade: "Premium",
    image: "",
    address: "",
    experienceYears: "",
    description: "",
  };

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  // Load current farmer's products
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/farmer/products/mine");
        setProducts(data || []);
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const resetForm = () => setForm(emptyForm);

  const addProduct = async (e) => {
    e.preventDefault();
    setError("");
    setAdding(true);
    try {
      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        grade: form.grade,
        image: form.image?.trim() || undefined,
        address: form.address?.trim() || undefined,
        experienceYears: form.experienceYears ? Number(form.experienceYears) : undefined,
        description: form.description?.trim() || undefined,
      };
      const { data: created } = await api.post("/farmer/products", payload);
      setProducts((list) => [created, ...list]);
      resetForm();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to add product");
    } finally {
      setAdding(false);
    }
  };

  const removeProduct = async (id) => {
    setError("");
    try {
      await api.delete(`/farmer/products/${id}`);
      setProducts((list) => list.filter((p) => (p._id || p.id) !== id));
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to delete");
    }
  };

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h3>Add Product</h3>
      </div>
      <div className="card-content pm-section">
        {/* Decorative and friendly hero */}
        <div className="pm-hero">
          <div>
            <h2 className="pm-hero-title">Add your fresh cardamom for sale</h2>
            <p className="pm-hero-sub">Fill the details below. A live preview will update as you type.</p>
          </div>
        </div>

        <div className="pm-grid">
          {/* Form */}
          <form onSubmit={addProduct} className="pm-form">
            <div className="pm-field">
              <label>Product Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g., Cardamom" required />
            </div>
            <div className="pm-field">
              <label>Price (₹/kg)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} min="0" step="0.01" required />
            </div>
            <div className="pm-field">
              <label>Stock (kg)</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} min="0" step="1" required />
            </div>
            <div className="pm-field">
              <label>Grade</label>
              <select name="grade" value={form.grade} onChange={handleChange}>
                <option>Premium</option>
                <option>Organic</option>
                <option>Regular</option>
              </select>
            </div>
            <div className="pm-field">
              <label>Farmer Address</label>
              <input name="address" value={form.address} onChange={handleChange} placeholder="e.g., Idukki, Kerala" />
            </div>
            <div className="pm-field">
              <label>Years of Experience</label>
              <input type="number" name="experienceYears" value={form.experienceYears} onChange={handleChange} min="0" placeholder="e.g., 5" />
            </div>
            <div className="pm-field pm-col-span-2">
              <label>Image URL</label>
              <input name="image" value={form.image} onChange={handleChange} placeholder="/images/plant12.jpeg" />
            </div>
            <div className="pm-field pm-col-span-2">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your cardamom quality, aroma, harvest details..." />
            </div>
            <div className="pm-actions pm-col-span-2">
              <button className="btn-primary" type="submit" disabled={adding}>{adding ? "Adding..." : "Add Product"}</button>
              <button className="btn-ghost" type="button" onClick={resetForm}>Reset</button>
            </div>
            {error && <div className="pm-col-span-2" style={{ color: '#c62828', fontSize: 13 }}>{error}</div>}
          </form>

          {/* Live preview */}
          <div className="pm-right">
            <h4 className="pm-right-title">Live Preview</h4>
            <div className="pm-preview-card">
              <div className="pm-preview-image">
                {form.image ? (
                  <img src={form.image} alt={form.name || 'Product'} />
                ) : (
                  <div className="empty-img">📦</div>
                )}
              </div>
              <div className="pm-preview-details">
                <h3>{form.name || 'Product Name'}</h3>
                <p className="pm-preview-price">₹{form.price || 0}/kg · {form.stock || 0} kg · {form.grade}</p>
                {(form.address || form.experienceYears) && (
                  <p className="pm-preview-meta">
                    {form.address ? <>📍 {form.address} </> : null}
                    {form.experienceYears ? <> · 👨‍🌾 {form.experienceYears} yrs</> : null}
                  </p>
                )}
                {form.description && <p className="pm-preview-desc">{form.description}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Existing products */}
        <div className="pm-products">
          <div className="pm-products-header">
            <h3>Your Products</h3>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {products.length === 0 ? (
                <p>No products yet. Add your first product above.</p>
              ) : (
                products.map((p) => (
                  <div className="product-card" key={p._id || p.id} style={{ border: '1px solid #e0e0e0', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
                    <div className="product-image" style={{ height: 150, background: '#f5f7f9', display: 'grid', placeItems: 'center' }}>
                      {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div className="empty-img">📦</div>}
                    </div>
                    <div className="product-details" style={{ padding: 12 }}>
                      <h3 style={{ margin: '0 0 6px 0', fontSize: 16 }}>{p.name}</h3>
                      <p className="product-price" style={{ margin: 0, color: '#2e7d32', fontWeight: 700 }}>₹{p.price}/kg · {p.stock} kg · {p.grade}</p>
                      {(p.address || p.experienceYears) && (
                        <p style={{ margin: '6px 0 0', color: '#607d8b', fontSize: 13 }}>
                          {p.address ? <>📍 {p.address} </> : null}
                          {p.experienceYears ? <> · 👨‍🌾 {p.experienceYears} yrs</> : null}
                        </p>
                      )}
                      {p.description && <p style={{ margin: '8px 0 0', color: '#37474f', fontSize: 13 }}>{p.description}</p>}
                      <div className="product-actions" style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                        <button className="wishlist-btn" onClick={() => removeProduct(p._id || p.id)}>🗑️ Remove</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}