import React, { useState, useEffect } from "react";
import "../../../css/CardamomComponents.css";
import { getAllHubs } from "../../../services/api";
import KeralaHubMap from "./KeralaHubMap";
import { useNavigate } from "react-router-dom";

export default function HubList({ user }) {
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterHubType, setFilterHubType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

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

  const handleDistrictSelect = (districtName) => {
    if (!districtName) return;
    const encoded = encodeURIComponent(districtName);
    navigate(`/hubs/district/${encoded}`);
  };

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
          </div>
        </div>

        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e0e0e0', background: '#fafcff' }}>
          <KeralaHubMap onSelectDistrict={handleDistrictSelect} />
        </div>
      </div>
    </div>
  );
}
