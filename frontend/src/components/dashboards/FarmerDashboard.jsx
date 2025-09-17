import React, { useState } from "react";
import DashboardLayout from "./DashboardLayout";
import "../../css/FarmerDashboard.css";
import "../../css/theme-modern.css";

// Feature sections
import FarmerProfile from "./farmer/FarmerProfile";
import ProductManager from "./farmer/ProductManager";
import CardamomGrading from "./farmer/CardamomGrading";
import DiseasePredictor from "./farmer/DiseasePredictor";
import ConnectAgriCare from "./farmer/ConnectAgriCare";
import FarmerFeedback from "./farmer/FarmerFeedback";

export default function FarmerDashboard({ user }) {
  const [activePage, setActivePage] = useState("overview");

  // Menu items for farmer dashboard
  const menuItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "products", label: "Add Product", icon: "🧺" },
    { id: "grading", label: "Cardamom Grading", icon: "⭐" },
    { id: "predictor", label: "Disease Predictor", icon: "🧪" },
    { id: "agricare", label: "Connect AgriCare", icon: "🤝" },
    { id: "feedback", label: "Feedback", icon: "💬" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  const renderPageContent = () => {
    switch (activePage) {
      case "overview":
        return (
          <div className="farmer-dashboard">
            <div className="welcome-banner">
              <div className="welcome-content">
                <h2>Welcome back, {user.username}!</h2>
                <p>Manage your farm inventory and engage customers.</p>
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
        );
      case "products":
        return <ProductManager />;
      case "grading":
        return <CardamomGrading />;
      case "predictor":
        return <DiseasePredictor />;
      case "agricare":
        return <ConnectAgriCare />;
      case "feedback":
        return <FarmerFeedback />;
      case "profile":
        return <FarmerProfile user={user} />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      user={user}
      menuItems={menuItems}
      pageTitle={`Farmer Dashboard - ${activePage.charAt(0).toUpperCase() + activePage.slice(1)}`}
      roleName="Farmer"
      onMenuItemClick={setActivePage}
    >
      {renderPageContent()}
    </DashboardLayout>
  );
}