import React, { useState } from "react";
import "../../../css/FarmerDashboard.css";

// Connect with AgriCare providers (mock list with request action)
export default function ConnectAgriCare() {
  const providers = [
    { id: 1, name: "AgriCare Plus", services: ["Soil Testing", "Fertilizers", "Pest Control"], rating: 4.7 },
    { id: 2, name: "GreenLine Agri", services: ["Seeds", "Equipment", "Consultation"], rating: 4.5 },
    { id: 3, name: "CropCare Co.", services: ["Irrigation", "Organic Inputs"], rating: 4.6 },
  ];

  const [requested, setRequested] = useState({});

  const requestConnect = (id) => {
    setRequested((r) => ({ ...r, [id]: true }));
    // TODO: integrate API call
  };

  return (
    <div className="dashboard-card">
      <div className="card-header"><h3>Connect AgriCare</h3></div>
      <div className="card-content">
        <div className="products-grid">
          {providers.map((p) => (
            <div className="product-card" key={p.id}>
              <div className="product-details">
                <h3>{p.name}</h3>
                <p>Services: {p.services.join(", ")}</p>
                <p>Rating: {p.rating}★</p>
                <div className="product-actions">
                  <button 
                    className="add-to-cart-btn" 
                    disabled={requested[p.id]}
                    onClick={() => requestConnect(p.id)}
                  >
                    {requested[p.id] ? "Requested" : "Request Connect"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}