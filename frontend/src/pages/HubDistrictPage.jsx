import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHubsByDistrict } from "../services/api";

export default function HubDistrictPage() {
  const { district } = useParams();
  const navigate = useNavigate();
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHubs = async () => {
      try {
        setLoading(true);
        setError("");
        // We target Kerala specifically
        const res = await getHubsByDistrict("Kerala", district);
        // API may return array or object with data; normalize to array
        const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
        setHubs(list);
      } catch (e) {
        setError(e?.message || "Failed to load hubs for district");
        setHubs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHubs();
  }, [district]);

  const titleCase = (s) => (s || "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const districtTitle = titleCase(decodeURIComponent(district || ""));

  const totalCapacity = useMemo(() => hubs.reduce((sum, h) => sum + (parseInt(h.capacity) || 0), 0), [hubs]);

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <h3>Hubs in {districtTitle}</h3>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>Hubs in {districtTitle}, Kerala</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => navigate(-1)} style={{ padding: "6px 10px", border: "1px solid #ddd", background: "white", borderRadius: 6, cursor: "pointer" }}>← Back</button>
          <button onClick={() => navigate("/dashboard")} style={{ padding: "6px 10px", border: "1px solid #2196F3", background: "white", color: "#2196F3", borderRadius: 6, cursor: "pointer" }}>🏠 Dashboard</button>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: 12, color: "#b00020" }}>{error}</div>
      )}

      <div style={{ marginBottom: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
        <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 8, background: "#fafafa", textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{hubs.length}</div>
          <div style={{ fontSize: 12, color: "#666" }}>Hubs</div>
        </div>
        <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 8, background: "#fafafa", textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{hubs.filter(h => h.isActive).length}</div>
          <div style={{ fontSize: 12, color: "#666" }}>Active</div>
        </div>
        <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 8, background: "#fafafa", textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{Math.round(totalCapacity / 1000)}K</div>
          <div style={{ fontSize: 12, color: "#666" }}>Total Capacity (kg)</div>
        </div>
      </div>

      {hubs.length === 0 ? (
        <div style={{ padding: 24, border: "1px dashed #ddd", borderRadius: 8, textAlign: "center", color: "#666" }}>
          No hubs found in {districtTitle}.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
          {hubs.map((hub) => (
            <div key={hub._id || hub.id} style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ margin: '0 0 6px 0' }}>{hub.name}</h4>
                  <div style={{ fontSize: 12, color: '#666' }}>📍 {hub.district}, {hub.state}</div>
                </div>
                <div style={{ fontSize: 12, padding: '3px 8px', borderRadius: 6, background: hub.isActive ? '#e8f5e8' : '#ffeaa7', color: hub.isActive ? '#2d5a2d' : '#b8860b' }}>
                  {hub.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
              {hub.address && (
                <div style={{ marginTop: 8, fontSize: 13, color: '#555' }}>{hub.address}</div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
                <div>
                  <div style={{ fontSize: 12, color: '#666' }}>Capacity</div>
                  <div style={{ fontWeight: 600 }}>📦 {hub.capacity} kg</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#666' }}>Hours</div>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>🕒 {hub.operatingHours || 'N/A'}</div>
                </div>
              </div>
              <div style={{ marginTop: 12, fontSize: 13, color: '#555' }}>
                👤 {hub.contactPerson} {hub.phone ? `• ${hub.phone}` : ''}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
