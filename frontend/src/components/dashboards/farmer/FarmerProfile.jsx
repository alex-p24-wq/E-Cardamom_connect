import React, { useState } from "react";
import "../../../css/FarmerDashboard.css";

// Simple profile update form for farmers
export default function FarmerProfile({ user, onSave }) {
  const [form, setForm] = useState({
    fullName: user?.profileData?.fullName || "",
    farmLocation: user?.profileData?.farmLocation || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setSuccess(null);
    try {
      setSaving(true);
      // TODO: Wire to backend API when available
      // await api.put('/farmer/profile', form)
      setTimeout(() => {
        setSaving(false);
        setSuccess("Profile updated successfully (mock)");
        if (onSave) onSave(form);
      }, 800);
    } catch (err) {
      setSaving(false);
      setError(err?.message || "Failed to update");
    }
  };

  return (
    <div className="dashboard-card">
      <div className="card-header"><h3>Update Profile</h3></div>
      <div className="card-content">
        {error && <div className="api-error">{error}</div>}
        {success && <div className="api-success">{success}</div>}
        <form onSubmit={handleSubmit} className="form grid-2">
          <div className="form-field">
            <label>Full Name</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} required />
          </div>
          <div className="form-field">
            <label>Farm Location</label>
            <input name="farmLocation" value={form.farmLocation} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-actions">
            <button className="view-all-btn" type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}