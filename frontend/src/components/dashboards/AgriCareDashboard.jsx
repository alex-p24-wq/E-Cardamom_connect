import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import "../../css/AgriCareDashboard.css";
import "../../css/theme-modern.css";

export default function AgriCareDashboard({ user }) {
  // Sidebar menu for AgriCare
  const menuItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "products", label: "Products", icon: "🧪" },
    { id: "orders", label: "Orders", icon: "🛒" },
    { id: "farmers", label: "Farmers", icon: "👨‍🌾" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  // Track active section (synced with DashboardLayout via onMenuItemClick)
  const [active, setActive] = useState("overview");

  // Demo data (replace with API when endpoints are ready)
  const [products, setProducts] = useState([
    { id: "P-101", name: "Soil Test Kit", price: 999, stock: 42, grade: "Premium" },
    { id: "P-102", name: "Organic Fertilizer", price: 499, stock: 120, grade: "Regular" },
    { id: "P-103", name: "Pest Control Spray", price: 299, stock: 60, grade: "Special" },
  ]);

  const [orders, setOrders] = useState([
    { id: "O-8901", date: "2025-05-08", status: "Processing", total: 3496, items: 4 },
    { id: "O-8892", date: "2025-05-07", status: "Shipped", total: 1299, items: 1 },
    { id: "O-8871", date: "2025-05-05", status: "Delivered", total: 1999, items: 2 },
  ]);

  const [farmers, setFarmers] = useState([
    { id: "F-201", name: "Rahul N", location: "Idukki, KL", joined: "2024-10-12" },
    { id: "F-214", name: "Meera V", location: "Kumily, KL", joined: "2024-11-28" },
    { id: "F-225", name: "Jijo P", location: "Munnar, KL", joined: "2025-01-15" },
  ]);

  // Simple profile (persisted locally for demo)
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("agricareProfile");
      if (saved) return JSON.parse(saved);
    } catch {}
    return { fullName: user?.profile?.fullName || user?.username || "", email: user?.email || "", phone: "" };
  });

  useEffect(() => {
    try { localStorage.setItem("agricareProfile", JSON.stringify(profile)); } catch {}
  }, [profile]);

  const counts = useMemo(() => ({
    products: products.length,
    orders: orders.length,
    farmers: farmers.length,
    revenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
  }), [products, orders, farmers]);

  const formatCurrency = (amount, currency = "INR") => {
    try { return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(amount || 0); }
    catch { return `₹${amount || 0}`; }
  };

  const renderOverview = () => (
    <div className="agricare-dashboard">
      <div className="welcome-banner">
        <div className="welcome-content">
          <h2>Welcome back, {profile.fullName || user.username}!</h2>
          <p>Manage your agricultural products and services.</p>
        </div>
        <div className="welcome-image">
          <img src="/images/plant13.jpeg" alt="Welcome" />
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#4CAF50" }}>🧪</div>
          <div className="stat-details">
            <h3>{counts.products}</h3>
            <p>Active Products</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#2196F3" }}>🛒</div>
          <div className="stat-details">
            <h3>{counts.orders}</h3>
            <p>Recent Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#FF9800" }}>👨‍🌾</div>
          <div className="stat-details">
            <h3>{counts.farmers}</h3>
            <p>Farmer Clients</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#9C27B0" }}>💰</div>
          <div className="stat-details">
            <h3>{formatCurrency(counts.revenue)}</h3>
            <p>Monthly Revenue</p>
          </div>
        </div>
      </div>

      <div className="dashboard-row">
        <div className="dashboard-col">
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Recent Orders</h3>
              <button className="view-all-btn" onClick={() => setActive("orders")}>View All</button>
            </div>
            <div className="card-content">
              {orders.length === 0 ? (
                <p>No recent orders</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(o => (
                      <tr key={o.id}>
                        <td>{o.id}</td>
                        <td>{o.date}</td>
                        <td><span className={`status-badge ${String(o.status).toLowerCase()}`}>{o.status}</span></td>
                        <td>{formatCurrency(o.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-col">
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Top Products</h3>
              <button className="view-all-btn" onClick={() => setActive("products")}>View All</button>
            </div>
            <div className="card-content">
              {products.length === 0 ? (
                <p>No products yet</p>
              ) : (
                <div className="product-grid">
                  {products.slice(0, 4).map(p => (
                    <div className="product-card" key={p.id}>
                      <div className="product-image">
                        <img src="/images/plant12.jpeg" alt={p.name} />
                      </div>
                      <div className="product-details">
                        <h4>{p.name}</h4>
                        <p className="product-price">{formatCurrency(p.price)} • Stock {p.stock}</p>
                        <button className="view-all-btn" onClick={() => setActive("products")}>Manage</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const [searchProducts, setSearchProducts] = useState("");
  const filteredProducts = useMemo(() => {
    const q = searchProducts.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(q));
  }, [products, searchProducts]);

  const renderProducts = () => (
    <div className="agricare-dashboard">
      <div className="dashboard-card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h3>Products</h3>
          <button className="view-all-btn" onClick={() => alert("Add product: integrate form or modal")}>+ Add New</button>
        </div>
        <div className="card-content">
          <div className="marketplace-controls controls-card" style={{ padding: 0, marginBottom: 16 }}>
            <div className="search-bar">
              <input type="text" placeholder="Search products..." value={searchProducts} onChange={(e) => setSearchProducts(e.target.value)} />
              <button className="search-btn">🔍</button>
            </div>
          </div>
          {filteredProducts.length === 0 ? (
            <p>No products found</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Grade</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.grade}</td>
                    <td>{p.stock}</td>
                    <td>{formatCurrency(p.price)}</td>
                    <td>
                      <button className="view-all-btn" onClick={() => alert(`Edit ${p.name}`)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );

  const [statusFilter, setStatusFilter] = useState("All");
  const statusTabs = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];
  const filteredOrders = useMemo(() => {
    if (statusFilter === "All") return orders;
    return orders.filter(o => String(o.status) === statusFilter);
  }, [orders, statusFilter]);

  const renderOrders = () => (
    <div className="agricare-dashboard">
      <div className="dashboard-card">
        <div className="card-header">
          <h3>Orders</h3>
          <div>
            {statusTabs.map(s => (
              <button
                key={s}
                className={`view-all-btn ${statusFilter === s ? 'active' : ''}`}
                style={{ marginLeft: 8 }}
                onClick={() => setStatusFilter(s)}
              >{s}</button>
            ))}
          </div>
        </div>
        <div className="card-content">
          {filteredOrders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(o => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.date}</td>
                    <td><span className={`status-badge ${String(o.status).toLowerCase()}`}>{o.status}</span></td>
                    <td>{o.items}</td>
                    <td>{formatCurrency(o.total)}</td>
                    <td>
                      <button className="view-all-btn" onClick={() => alert(`View ${o.id}`)}>View</button>
                      {o.status === 'Processing' && (
                        <button className="view-all-btn" style={{ marginLeft: 8 }} onClick={() => alert(`Mark shipped ${o.id}`)}>Mark Shipped</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );

  const renderFarmers = () => (
    <div className="agricare-dashboard">
      <div className="dashboard-card">
        <div className="card-header">
          <h3>Farmer Clients</h3>
          <button className="view-all-btn" onClick={() => alert("Invite Farmer")}>Invite</button>
        </div>
        <div className="card-content">
          {farmers.length === 0 ? (
            <p>No farmers yet</p>
          ) : (
            <div className="product-grid">
              {farmers.map(f => (
                <div className="product-card" key={f.id}>
                  <div className="product-image">
                    <img src="/images/plant11.jpeg" alt={f.name} />
                  </div>
                  <div className="product-details">
                    <h4>{f.name}</h4>
                    <p className="product-price">📍 {f.location}</p>
                    <button className="view-all-btn" onClick={() => alert(`Message ${f.name}`)}>Message</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="agricare-dashboard">
      <div className="dashboard-card" style={{ marginBottom: 20 }}>
        <div className="card-header"><h3>Sales Overview</h3></div>
        <div className="card-content">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[{ label: 'This Week', value: 65 }, { label: 'This Month', value: 78 }].map((m, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span>{m.label}</span><span>{m.value}%</span>
                </div>
                <div style={{ height: 10, background: '#eee', borderRadius: 999 }}>
                  <div style={{ width: `${m.value}%`, height: '100%', background: 'linear-gradient(90deg, #667eea, #764ba2)', borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="card-header"><h3>Top Performing Products</h3></div>
        <div className="card-content">
          {products.length === 0 ? (
            <p>No data</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Orders</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, idx) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{(idx + 1) * 7}</td>
                    <td>{formatCurrency((idx + 1) * 1500)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [msg, setMsg] = useState("");
  const onSaveProfile = async (e) => {
    e.preventDefault();
    setMsg("");
    setIsSavingProfile(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      setMsg("Profile updated");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const renderProfile = () => (
    <div className="agricare-dashboard">
      <div className="dashboard-card">
        <div className="card-header"><h3>Profile</h3></div>
        <div className="card-content">
          {msg && <div className="alert-success" style={{ marginBottom: 12 }}>✅ {msg}</div>}
          <form onSubmit={onSaveProfile} className="edit-profile-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input id="fullName" value={profile.fullName} onChange={(e) => setProfile(p => ({ ...p, fullName: e.target.value }))} placeholder="Enter your full name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={profile.email} onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))} placeholder="Enter your email" required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input id="phone" type="tel" value={profile.phone} onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="Phone number" />
            </div>
            <div className="form-actions">
              <button className="save-btn" type="submit" disabled={isSavingProfile}>{isSavingProfile ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const body = (() => {
    switch (active) {
      case "products": return renderProducts();
      case "orders": return renderOrders();
      case "farmers": return renderFarmers();
      case "analytics": return renderAnalytics();
      case "profile": return renderProfile();
      case "overview":
      default: return renderOverview();
    }
  })();

  return (
    <DashboardLayout
      user={user}
      menuItems={menuItems}
      pageTitle="AgriCare Dashboard"
      roleName="AgriCare Provider"
      onMenuItemClick={(id) => setActive(id)}
    >
      {body}
    </DashboardLayout>
  );
}