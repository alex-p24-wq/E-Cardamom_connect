import React, { useState, useEffect } from "react";
import "../../../css/CardamomComponents.css";
import { getAllHubs } from "../../../services/api";

export default function HubList({ user }) {
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterHubType, setFilterHubType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Load hubs data
  useEffect(() => {
    const loadHubs = async () => {
      try {
        setLoading(true);
        const response = await getAllHubs();
        setHubs(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Failed to load hubs:', error);
        setHubs([]);
      } finally {
        setLoading(false);
      }
    };

    loadHubs();
  }, []);

  // Filter and sort hubs
  const filteredAndSortedHubs = React.useMemo(() => {
    let filtered = hubs.filter(hub => {
      const matchesSearch = hub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          hub.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          hub.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesState = !filterState || hub.state === filterState;
      const matchesHubType = !filterHubType || hub.hubType === filterHubType;
      const matchesStatus = !filterStatus || 
                          (filterStatus === "active" && hub.isActive) ||
                          (filterStatus === "inactive" && !hub.isActive);
      
      return matchesSearch && matchesState && matchesHubType && matchesStatus;
    });

    // Sort hubs
    filtered.sort((a, b) => {
      let aValue = a[sortBy] || "";
      let bValue = b[sortBy] || "";
      
      if (sortBy === "capacity") {
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [hubs, searchTerm, filterState, filterHubType, filterStatus, sortBy, sortOrder]);

  // Get unique states and hub types for filters
  const uniqueStates = [...new Set(hubs.map(hub => hub.state))].sort();
  const uniqueHubTypes = [...new Set(hubs.map(hub => hub.hubType))].sort();

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getHubTypeColor = (hubType) => {
    const colors = {
      'Primary Production Hub': '#4CAF50',
      'Regional Hub': '#2196F3',
      'Export Hub': '#FF9800',
      'Processing Hub': '#9C27B0',
      'Distribution Hub': '#607D8B',
      'Collection Hub': '#795548',
      'Metropolitan Hub': '#E91E63',
      'Technology Hub': '#00BCD4',
      'Port Hub': '#3F51B5',
      'Commercial Hub': '#FFC107'
    };
    return colors[hubType] || '#757575';
  };

  const formatCapacity = (capacity) => {
    if (capacity >= 1000) {
      return `${(capacity / 1000).toFixed(1)}K kg`;
    }
    return `${capacity} kg`;
  };

  if (loading) {
    return (
      <div className="hub-dashboard">
        <div className="dashboard-card">
          <div className="card-content">
            <div className="empty-state">
              <div className="empty-icon">⏳</div>
              <h3>Loading hub list...</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hub-dashboard">
      <div className="dashboard-card">
        <div className="card-header">
          <h3>Hub Network ({hubs.length} Total Hubs)</h3>
          <div className="header-actions">
            <button className="btn-primary">
              📊 Hub Analytics
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="filters-section" style={{ padding: '20px', borderBottom: '1px solid #e0e0e0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Search Hubs</label>
              <input
                type="text"
                placeholder="Search by name, district, or contact person..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Filter by State</label>
              <select
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="">All States</option>
                {uniqueStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Filter by Hub Type</label>
              <select
                value={filterHubType}
                onChange={(e) => setFilterHubType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="">All Hub Types</option>
                {uniqueHubTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontWeight: '500' }}>Sort by:</span>
            <button
              onClick={() => handleSort('name')}
              style={{
                padding: '5px 10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: sortBy === 'name' ? '#e3f2fd' : 'white',
                cursor: 'pointer'
              }}
            >
              Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('state')}
              style={{
                padding: '5px 10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: sortBy === 'state' ? '#e3f2fd' : 'white',
                cursor: 'pointer'
              }}
            >
              State {sortBy === 'state' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('capacity')}
              style={{
                padding: '5px 10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: sortBy === 'capacity' ? '#e3f2fd' : 'white',
                cursor: 'pointer'
              }}
            >
              Capacity {sortBy === 'capacity' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>

        <div className="card-content">
          {filteredAndSortedHubs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏢</div>
              <h3>No hubs found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="hub-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' }}>
              {filteredAndSortedHubs.map((hub) => (
                <div key={hub._id} className="hub-card" style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '20px',
                  background: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '18px' }}>{hub.name}</h4>
                      <div style={{
                        display: 'inline-block',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '500',
                        color: 'white',
                        backgroundColor: getHubTypeColor(hub.hubType)
                      }}>
                        {hub.hubType}
                      </div>
                    </div>
                    <div style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: hub.isActive ? '#e8f5e8' : '#ffeaa7',
                      color: hub.isActive ? '#2d5a2d' : '#b8860b'
                    }}>
                      {hub.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
                      📍 {hub.district}, {hub.state}
                    </p>
                    <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#777' }}>
                      {hub.address}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                      <span style={{ fontSize: '12px', color: '#666' }}>Capacity</span>
                      <p style={{ margin: '2px 0 0 0', fontWeight: '600', color: '#333' }}>
                        📦 {formatCapacity(hub.capacity)}
                      </p>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: '#666' }}>Operating Hours</span>
                      <p style={{ margin: '2px 0 0 0', fontWeight: '500', color: '#333', fontSize: '13px' }}>
                        🕒 {hub.operatingHours}
                      </p>
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <span style={{ fontSize: '12px', color: '#666' }}>Contact Person</span>
                    <p style={{ margin: '2px 0 0 0', fontWeight: '500', color: '#333' }}>
                      👤 {hub.contactPerson}
                    </p>
                    <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                      📞 {hub.phone} | ✉️ {hub.email}
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <span style={{ fontSize: '12px', color: '#666', marginBottom: '5px', display: 'block' }}>Services</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {hub.services.map((service, index) => (
                        <span key={index} style={{
                          padding: '2px 6px',
                          borderRadius: '8px',
                          fontSize: '10px',
                          backgroundColor: '#f0f0f0',
                          color: '#555'
                        }}>
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
                    <button style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #2196F3',
                      borderRadius: '4px',
                      background: 'white',
                      color: '#2196F3',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}>
                      View Details
                    </button>
                    <button style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: 'none',
                      borderRadius: '4px',
                      background: '#2196F3',
                      color: 'white',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}>
                      Contact Hub
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Statistics */}
        <div style={{ padding: '20px', borderTop: '1px solid #e0e0e0', backgroundColor: '#f9f9f9' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>
                {filteredAndSortedHubs.length}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Showing Hubs</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196F3' }}>
                {filteredAndSortedHubs.filter(h => h.isActive).length}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Active Hubs</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF9800' }}>
                {uniqueStates.length}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>States Covered</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9C27B0' }}>
                {Math.round(filteredAndSortedHubs.reduce((sum, hub) => sum + (hub.capacity || 0), 0) / 1000)}K
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Total Capacity (kg)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
