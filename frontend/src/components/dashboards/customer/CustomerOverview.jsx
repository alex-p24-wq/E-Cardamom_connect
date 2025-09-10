import React from "react";
import "../../../css/CustomerDashboard.css";

export default function CustomerOverview({ user }) {
  // Sample data for demonstration
  const stats = [
    { label: "Total Orders", value: 12, icon: "📦", color: "#4CAF50" },
    { label: "Wishlist Items", value: 8, icon: "❤️", color: "#F44336" },
    { label: "Cart Items", value: 3, icon: "🛒", color: "#2196F3" },
    { label: "Saved Addresses", value: 2, icon: "📍", color: "#FF9800" },
  ];

  const recentOrders = [
    { id: "ORD-001", date: "2023-05-15", status: "Delivered", total: 1250 },
    { id: "ORD-002", date: "2023-05-10", status: "Processing", total: 850 },
    { id: "ORD-003", date: "2023-05-05", status: "Shipped", total: 1500 },
  ];

  const featuredProducts = [
    { id: 1, name: "Premium Cardamom", price: 450, image: "/images/plant11.jpeg" },
    { id: 2, name: "Organic Cardamom", price: 550, image: "/images/plant12.jpeg" },
    { id: 3, name: "Special Grade Cardamom", price: 650, image: "/images/plant13.jpeg" },
  ];

  return (
    <div className="customer-overview">
      <div className="welcome-banner">
        <div className="welcome-content">
          <h2>Welcome back, {user.username}!</h2>
          <p>Here's what's happening with your account today.</p>
        </div>
        <div className="welcome-image">
          <img src="/images/plant11.jpeg" alt="Welcome" />
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-details">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-row">
        <div className="dashboard-col">
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Recent Orders</h3>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="card-content">
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
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.date}</td>
                      <td>
                        <span className={`status-badge ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>₹{order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="dashboard-col">
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Featured Products</h3>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="card-content">
              <div className="product-grid">
                {featuredProducts.map((product) => (
                  <div className="product-card" key={product.id}>
                    <div className="product-image">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="product-details">
                      <h4>{product.name}</h4>
                      <p className="product-price">₹{product.price}/kg</p>
                      <button className="add-to-cart-btn">Add to Cart</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}