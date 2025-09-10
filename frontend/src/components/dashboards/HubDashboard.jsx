import React from "react";
import DashboardLayout from "./DashboardLayout";
import "../../css/HubDashboard.css";

export default function HubDashboard({ user }) {
  // Menu items for hub dashboard
  const menuItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "inventory", label: "Inventory", icon: "📦" },
    { id: "logistics", label: "Logistics", icon: "🚚" },
    { id: "farmers", label: "Farmers", icon: "👨‍🌾" },
    { id: "customers", label: "Customers", icon: "👥" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  return (
    <DashboardLayout
      user={user}
      menuItems={menuItems}
      pageTitle="Hub Manager Dashboard"
      roleName="Hub Manager"
    >
      <div className="hub-dashboard">
        <div className="welcome-banner">
          <div className="welcome-content">
            <h2>Welcome back, {user.username}!</h2>
            <p>Manage your hub operations and logistics.</p>
          </div>
          <div className="welcome-image">
            <img src="/images/plant14.jpeg" alt="Welcome" />
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: "#4CAF50" }}>📦</div>
            <div className="stat-details">
              <h3>1,250 kg</h3>
              <p>Current Inventory</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: "#2196F3" }}>🚚</div>
            <div className="stat-details">
              <h3>24</h3>
              <p>Pending Shipments</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: "#FF9800" }}>👨‍🌾</div>
            <div className="stat-details">
              <h3>78</h3>
              <p>Registered Farmers</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: "#9C27B0" }}>👥</div>
            <div className="stat-details">
              <h3>120</h3>
              <p>Active Customers</p>
            </div>
          </div>
        </div>

        <div className="dashboard-row">
          <div className="dashboard-col">
            <div className="dashboard-card">
              <div className="card-header">
                <h3>Recent Shipments</h3>
                <button className="view-all-btn">View All</button>
              </div>
              <div className="card-content">
                <p>Your recent shipments will appear here.</p>
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