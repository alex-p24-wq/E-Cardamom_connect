import React from "react";
import DashboardLayout from "./DashboardLayout";
import "../../css/AgriCareDashboard.css";

export default function AgriCareDashboard({ user }) {
  // Menu items for agricare dashboard
  const menuItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "products", label: "Products", icon: "🧪" },
    { id: "orders", label: "Orders", icon: "🛒" },
    { id: "farmers", label: "Farmers", icon: "👨‍🌾" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  return (
    <DashboardLayout
      user={user}
      menuItems={menuItems}
      pageTitle="AgriCare Dashboard"
      roleName="AgriCare Provider"
    >
      <div className="agricare-dashboard">
        <div className="welcome-banner">
          <div className="welcome-content">
            <h2>Welcome back, {user.username}!</h2>
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
              <h3>24</h3>
              <p>Active Products</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: "#2196F3" }}>🛒</div>
            <div className="stat-details">
              <h3>18</h3>
              <p>Pending Orders</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: "#FF9800" }}>👨‍🌾</div>
            <div className="stat-details">
              <h3>45</h3>
              <p>Farmer Clients</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: "#9C27B0" }}>💰</div>
            <div className="stat-details">
              <h3>₹78,500</h3>
              <p>Monthly Revenue</p>
            </div>
          </div>
        </div>

        <div className="dashboard-row">
          <div className="dashboard-col">
            <div className="dashboard-card">
              <div className="card-header">
                <h3>Recent Orders</h3>
                <button className="view-all-btn">View All</button>
              </div>
              <div className="card-content">
                <p>Your recent orders will appear here.</p>
              </div>
            </div>
          </div>
          
          <div className="dashboard-col">
            <div className="dashboard-card">
              <div className="card-header">
                <h3>Top Products</h3>
                <button className="view-all-btn">View All</button>
              </div>
              <div className="card-content">
                <p>Your top products will appear here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}