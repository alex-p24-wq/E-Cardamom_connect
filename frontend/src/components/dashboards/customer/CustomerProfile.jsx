import React, { useState } from "react";
import "../../../css/CustomerDashboard.css";

export default function CustomerProfile({ user }) {
  // Sample data for demonstration
  const [profileData, setProfileData] = useState({
    fullName: "John Doe",
    email: user.email,
    phone: user.phone || "",
    address: "123 Main Street, Apartment 4B, Cityville, State, 12345",
    alternatePhone: "",
    profileImage: null
  });

  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({...profileData});

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would call an API to update the profile
    setProfileData({...formData});
    setIsEditing(false);
  };

  // Handle cancel edit
  const handleCancel = () => {
    setFormData({...profileData});
    setIsEditing(false);
  };

  // Sample addresses for demonstration
  const addresses = [
    {
      id: 1,
      type: "Home",
      address: "123 Main Street, Apartment 4B, Cityville, State, 12345",
      isDefault: true
    },
    {
      id: 2,
      type: "Work",
      address: "456 Business Avenue, Suite 200, Commerce City, State, 67890",
      isDefault: false
    }
  ];

  // Sample payment methods for demonstration
  const paymentMethods = [
    {
      id: 1,
      type: "Credit Card",
      last4: "4242",
      expiry: "05/25",
      isDefault: true
    },
    {
      id: 2,
      type: "UPI",
      upiId: "user@upi",
      isDefault: false
    }
  ];

  return (
    <div className="customer-profile">
      <div className="profile-header">
        <div className="profile-avatar">
          {profileData.profileImage ? (
            <img src={profileData.profileImage} alt={profileData.fullName} />
          ) : (
            <div className="avatar-placeholder">
              {profileData.fullName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="profile-title">
          <h2>{profileData.fullName}</h2>
          <p>{user.username} • Customer</p>
        </div>
        {!isEditing && (
          <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>

      <div className="profile-tabs">
        <button 
          className={`profile-tab ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          Personal Info
        </button>
        <button 
          className={`profile-tab ${activeTab === 'addresses' ? 'active' : ''}`}
          onClick={() => setActiveTab('addresses')}
        >
          Addresses
        </button>
        <button 
          className={`profile-tab ${activeTab === 'payment' ? 'active' : ''}`}
          onClick={() => setActiveTab('payment')}
        >
          Payment Methods
        </button>
        <button 
          className={`profile-tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'personal' && (
          <div className="personal-info">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="edit-profile-form">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="alternatePhone">Alternate Phone</label>
                  <input
                    type="tel"
                    id="alternatePhone"
                    name="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="address">Default Address</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label htmlFor="profileImage">Profile Image</label>
                  <input
                    type="file"
                    id="profileImage"
                    name="profileImage"
                    accept="image/*"
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="save-btn">Save Changes</button>
                  <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
                </div>
              </form>
            ) : (
              <div className="profile-details">
                <div className="detail-group">
                  <h3>Full Name</h3>
                  <p>{profileData.fullName}</p>
                </div>
                
                <div className="detail-group">
                  <h3>Email</h3>
                  <p>{profileData.email}</p>
                </div>
                
                <div className="detail-group">
                  <h3>Phone</h3>
                  <p>{profileData.phone || "Not provided"}</p>
                </div>
                
                <div className="detail-group">
                  <h3>Alternate Phone</h3>
                  <p>{profileData.alternatePhone || "Not provided"}</p>
                </div>
                
                <div className="detail-group">
                  <h3>Default Address</h3>
                  <p>{profileData.address}</p>
                </div>
                
                <div className="detail-group">
                  <h3>Member Since</h3>
                  <p>May 2023</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="addresses-section">
            <div className="section-header">
              <h3>Saved Addresses</h3>
              <button className="add-new-btn">+ Add New Address</button>
            </div>
            
            <div className="addresses-list">
              {addresses.map((address) => (
                <div className="address-card" key={address.id}>
                  <div className="address-header">
                    <h4>{address.type}</h4>
                    {address.isDefault && <span className="default-badge">Default</span>}
                  </div>
                  <p className="address-text">{address.address}</p>
                  <div className="address-actions">
                    <button className="edit-btn">Edit</button>
                    <button className="delete-btn">Delete</button>
                    {!address.isDefault && (
                      <button className="set-default-btn">Set as Default</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="payment-section">
            <div className="section-header">
              <h3>Payment Methods</h3>
              <button className="add-new-btn">+ Add Payment Method</button>
            </div>
            
            <div className="payment-list">
              {paymentMethods.map((method) => (
                <div className="payment-card" key={method.id}>
                  <div className="payment-header">
                    <h4>{method.type}</h4>
                    {method.isDefault && <span className="default-badge">Default</span>}
                  </div>
                  <p className="payment-details">
                    {method.type === "Credit Card" ? 
                      `**** **** **** ${method.last4} | Expires: ${method.expiry}` : 
                      `ID: ${method.id}`
                    }
                  </p>
                  <div className="payment-actions">
                    <button className="edit-btn">Edit</button>
                    <button className="delete-btn">Delete</button>
                    {!method.isDefault && (
                      <button className="set-default-btn">Set as Default</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="security-section">
            <div className="section-header">
              <h3>Security Settings</h3>
            </div>
            
            <div className="security-options">
              <div className="security-card">
                <h4>Change Password</h4>
                <p>Update your password to maintain account security</p>
                <button className="change-password-btn">Change Password</button>
              </div>
              
              <div className="security-card">
                <h4>Two-Factor Authentication</h4>
                <p>Add an extra layer of security to your account</p>
                <button className="enable-2fa-btn">Enable 2FA</button>
              </div>
              
              <div className="security-card">
                <h4>Login History</h4>
                <p>View your recent login activity</p>
                <button className="view-history-btn">View History</button>
              </div>
              
              <div className="security-card">
                <h4>Delete Account</h4>
                <p>Permanently delete your account and all data</p>
                <button className="delete-account-btn">Delete Account</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}