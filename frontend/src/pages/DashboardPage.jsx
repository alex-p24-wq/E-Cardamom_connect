import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/DashboardPage.css";

// Role-specific dashboard components
import CustomerDashboard from "../components/dashboards/CustomerDashboard";
import FarmerDashboard from "../components/dashboards/FarmerDashboard";
import AgriCareDashboard from "../components/dashboards/AgriCareDashboard";
import HubDashboard from "../components/dashboards/HubDashboard";
import AdminDashboard from "../components/dashboards/AdminDashboard";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userStr || !token) {
      // Redirect to login if not logged in
      navigate("/login");
      return;
    }

    try {
      // Parse user data
      const userData = JSON.parse(userStr);
      setUser(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      // Clear invalid data and redirect to login
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // Render the appropriate dashboard based on user role
  const renderDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case "customer":
        return <CustomerDashboard user={user} />;
      case "farmer":
        return <FarmerDashboard user={user} />;
      case "agricare":
        return <AgriCareDashboard user={user} />;
      case "hub":
        return <HubDashboard user={user} />;
      case "admin":
        return <AdminDashboard user={user} />;
      default:
        return (
          <div className="dashboard-error">
            <h2>Invalid User Role</h2>
            <p>Your account has an invalid role. Please contact support.</p>
            <button 
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="logout-btn"
            >
              Logout
            </button>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      {renderDashboard()}
    </div>
  );
}