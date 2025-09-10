import React from "react";
import DashboardLayout from "./DashboardLayout";
import "../../css/AdminDashboard.css";

export default function AdminDashboard({ user }) {
  // Menu items for admin dashboard
  const menuItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "products", label: "Products", icon: "📦" },
    { id: "orders", label: "Orders", icon: "🛒" },
    { id: "hubs", label: "Hubs", icon: "🏢" },
    { id: "reports", label: "Reports", icon: "📈" },
    { id: "settings", label: "Settings", icon: "⚙️" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  return (
    <DashboardLayout
      user={user}
      menuItems={menuItems}
      pageTitle="Admin Dashboard"
      roleName="Administrator"
    >
      <div className="admin-dashboard">
        <div className="welcome-banner admin-banner">
          <div className="welcome-content">
            <h2>Welcome back, {user.username}!</h2>
            <p>Manage your platform and monitor system performance.</p>
          </div>
          <div className="welcome-image">
            <img src="/images/plant15.jpeg" alt="Welcome" />
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: "#4CAF50" }}>👥</div>
            <div className="stat-details">
              <h3>1,245</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: "#2196F3" }}>📦</div>
            <div className="stat-details">
              <h3>458</h3>
              <p>Active Products</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: "#FF9800" }}>🛒</div>
            <div className="stat-details">
              <h3>89</h3>
              <p>Today's Orders</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: "#9C27B0" }}>💰</div>
            <div className="stat-details">
              <h3>₹2.4L</h3>
              <p>Today's Revenue</p>
            </div>
          </div>
        </div>

        <div className="dashboard-row">
          <div className="dashboard-col">
            <div className="dashboard-card">
              <div className="card-header">
                <h3>Recent User Registrations</h3>
                <button className="view-all-btn">View All</button>
              </div>
              <div className="card-content">
                <p>Recent user registrations will appear here.</p>
              </div>
            </div>
          </div>
          
          <div className="dashboard-col">
            <div className="dashboard-card">
              <div className="card-header">
                <h3>System Alerts</h3>
                <button className="view-all-btn">View All</button>
              </div>
              <div className="card-content">
                <p>System alerts will appear here.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-row">
          <div className="dashboard-card full-width">
            <div className="card-header">
              <h3>Platform Analytics</h3>
              <div className="period-selector">
                <button className="period-btn active">Day</button>
                <button className="period-btn">Week</button>
                <button className="period-btn">Month</button>
                <button className="period-btn">Year</button>
              </div>
            </div>
            <div className="card-content">
              <p>Platform analytics will appear here.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}