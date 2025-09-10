import React from "react";
import DashboardLayout from "./DashboardLayout";
import "../../css/FarmerDashboard.css";

export default function FarmerDashboard({ user }) {
  // Menu items for farmer dashboard
  const menuItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "inventory", label: "Inventory", icon: "📦" },
    { id: "orders", label: "Orders", icon: "🛒" },
    { id: "grading", label: "Grading", icon: "⭐" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  return (
    <DashboardLayout
      user={user}
      menuItems={menuItems}
      pageTitle="Farmer Dashboard"
      roleName="Farmer"
    >
      <div className="farmer-dashboard">
        <div className="welcome-banner">
          <div className="welcome-content">
            <h2>Welcome back, {user.username}!</h2>
            <p>Manage your farm inventory and track your orders.</p>
          </div>
          <div className="welcome-image">
            <img src="/images/plant12.jpeg" alt="Welcome" />
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: "#4CAF50" }}>📦</div>
            <div className="stat-details">
              <h3>250 kg</h3>
              <p>Current Inventory</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: "#2196F3" }}>🛒</div>
            <div className="stat-details">
              <h3>12</h3>
              <p>Pending Orders</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: "#FF9800" }}>💰</div>
            <div className="stat-details">
              <h3>₹45,250</h3>
              <p>Monthly Revenue</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: "#9C27B0" }}>⭐</div>
            <div className="stat-details">
              <h3>4.8/5</h3>
              <p>Average Rating</p>
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
                <h3>Inventory Status</h3>
                <button className="view-all-btn">View All</button>
              </div>
              <div className="card-content">
                <p>Your inventory status will appear here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}