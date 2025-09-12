import React, { useState } from "react";
import "../../../css/CustomerDashboard.css";

export default function CustomerOrders({ user }) {
  const [activeTab, setActiveTab] = useState("all");
  
  // Sample data for demonstration
  const orders = [
    { 
      id: "ORD-001", 
      date: "2023-05-15", 
      status: "Delivered", 
      total: 1250,
      items: [
        { name: "Premium Cardamom", quantity: 2, price: 450 },
        { name: "Organic Cardamom", quantity: 1, price: 350 }
      ]
    },
    { 
      id: "ORD-002", 
      date: "2023-05-10", 
      status: "Processing", 
      total: 850,
      items: [
        { name: "Special Grade Cardamom", quantity: 1, price: 650 },
        { name: "Regular Cardamom", quantity: 1, price: 200 }
      ]
    },
    { 
      id: "ORD-003", 
      date: "2023-05-05", 
      status: "Shipped", 
      total: 1500,
      items: [
        { name: "Premium Cardamom", quantity: 3, price: 450 },
        { name: "Organic Fertilizer", quantity: 1, price: 150 }
      ]
    },
    { 
      id: "ORD-004", 
      date: "2023-04-28", 
      status: "Cancelled", 
      total: 750,
      items: [
        { name: "Regular Cardamom", quantity: 3, price: 200 },
        { name: "Cardamom Seeds", quantity: 1, price: 150 }
      ]
    },
    { 
      id: "ORD-005", 
      date: "2023-04-20", 
      status: "Delivered", 
      total: 1800,
      items: [
        { name: "Premium Cardamom", quantity: 4, price: 450 }
      ]
    },
  ];

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === "all") return true;
    return order.status.toLowerCase() === activeTab.toLowerCase();
  });

  // Toggle order details
  const [expandedOrder, setExpandedOrder] = useState(null);
  
  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  return (
    <div className="customer-orders">
      <div className="page-header">
        <h2>My Orders</h2>
        <p>View and track all your orders</p>
      </div>

      <div className="order-tabs">
        <button 
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Orders
        </button>
        <button 
          className={`tab-btn ${activeTab === 'processing' ? 'active' : ''}`}
          onClick={() => setActiveTab('processing')}
        >
          Processing
        </button>
        <button 
          className={`tab-btn ${activeTab === 'shipped' ? 'active' : ''}`}
          onClick={() => setActiveTab('shipped')}
        >
          Shipped
        </button>
        <button 
          className={`tab-btn ${activeTab === 'delivered' ? 'active' : ''}`}
          onClick={() => setActiveTab('delivered')}
        >
          Delivered
        </button>
        <button 
          className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled
        </button>
      </div>

      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No orders found</h3>
            <p>You don't have any {activeTab !== 'all' ? activeTab : ''} orders yet.</p>
            {activeTab !== 'all' && (
              <button className="view-all-btn" onClick={() => setActiveTab('all')}>
                View All Orders
              </button>
            )}
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-header" onClick={() => toggleOrderDetails(order.id)}>
                <div className="order-info">
                  <h3>{order.id}</h3>
                  <p>Ordered on {order.date}</p>
                </div>
                <div className="order-status">
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                  <span className="order-total">₹{order.total}</span>
                  <span className="expand-icon">
                    {expandedOrder === order.id ? '▲' : '▼'}
                  </span>
                </div>
              </div>
              
              {expandedOrder === order.id && (
                <div className="order-details">
                  <h4>Order Items</h4>
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>₹{item.price}</td>
                          <td>₹{item.quantity * item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="text-right">Order Total:</td>
                        <td>₹{order.total}</td>
                      </tr>
                    </tfoot>
                  </table>
                  
                  <div className="order-actions">
                    <button className="track-btn">Track Order</button>
                    {order.status === "Delivered" && (
                      <button className="review-btn">Write Review</button>
                    )}
                    {order.status === "Processing" && (
                      <button className="cancel-btn">Cancel Order</button>
                    )}
                    <button className="support-btn">Contact Support</button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}