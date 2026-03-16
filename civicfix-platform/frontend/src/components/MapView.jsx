// MapView.jsx
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat/dist/leaflet-heat.js';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons based on complaint status
const getMarkerIcon = (status) => {
  const iconSize = [30, 30];
  const iconAnchor = [15, 30];
  const popupAnchor = [0, -30];
  
  const icons = {
    pending: L.divIcon({
      className: 'custom-marker',
      html: `<div class="marker-pulse" style="background-color: #F59E0B; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 0 15px rgba(245, 158, 11, 0.6); display: flex; align-items: center; justify-content: center;">
              <span style="transform: rotate(45deg); color: white; font-size: 14px;">⚠️</span>
             </div>`,
      iconSize,
      iconAnchor,
      popupAnchor
    }),
    'in progress': L.divIcon({
      className: 'custom-marker',
      html: `<div class="marker-pulse" style="background-color: #3B82F6; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 0 15px rgba(59, 130, 246, 0.6); display: flex; align-items: center; justify-content: center;">
              <span style="transform: rotate(45deg); color: white; font-size: 14px;">🔄</span>
             </div>`,
      iconSize,
      iconAnchor,
      popupAnchor
    }),
    resolved: L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: #10B981; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 0 15px rgba(16, 185, 129, 0.6); display: flex; align-items: center; justify-content: center;">
              <span style="transform: rotate(45deg); color: white; font-size: 14px;">✅</span>
             </div>`,
      iconSize,
      iconAnchor,
      popupAnchor
    })
  };
  
  return icons[status?.toLowerCase()] || icons.pending;
};

// Component to recenter map when complaints change
function RecenterMap({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, map, zoom]);
  return null;
}

export default function MapView({ complaints = [], height = '500px', showHeatmap = true }) {
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default center of India
  const [mapZoom, setMapZoom] = useState(5);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showClusters, setShowClusters] = useState(false);
  const [mapType, setMapType] = useState('streets');
  const [hoveredComplaint, setHoveredComplaint] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);

  // Calculate statistics
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status?.toLowerCase() === 'pending').length,
    inProgress: complaints.filter(c => c.status?.toLowerCase() === 'in progress').length,
    resolved: complaints.filter(c => c.status?.toLowerCase() === 'resolved').length
  };

  // Filter complaints based on selected status
  const filteredComplaints = selectedStatus === 'all' 
    ? complaints 
    : complaints.filter(c => c.status?.toLowerCase() === selectedStatus.toLowerCase());

  // Prepare heatmap data
  useEffect(() => {
    if (complaints.length > 0) {
      const heat = complaints
        .filter(c => c.latitude && c.longitude)
        .map(c => [c.latitude, c.longitude, 1]);
      setHeatmapData(heat);
      
      // Center map on first complaint if available
      const firstComplaint = complaints.find(c => c.latitude && c.longitude);
      if (firstComplaint) {
        setMapCenter([firstComplaint.latitude, firstComplaint.longitude]);
        setMapZoom(12);
      }
    }
  }, [complaints]);

  if (!complaints || complaints.length === 0) {
    return (
      <div className="relative group">
        {/* Empty State with Gradient Background */}
        <div className={`bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl ${height ? `h-[${height}]` : 'h-96'} flex items-center justify-center relative overflow-hidden`}>
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="relative text-center p-8">
            {/* Map Icon with Pulse Animation */}
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <span className="text-white text-5xl">🗺️</span>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm animate-pulse">
                {complaints.length}
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Complaints to Display</h3>
            <p className="text-gray-500 mb-6 max-w-md">
              {complaints.length === 0 
                ? "There are no complaints in the system yet. Be the first to report an issue!"
                : "No complaints with valid location data found."}
            </p>
            
            {/* Decorative Grid */}
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto opacity-30">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-10 h-10 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
            
            <p className="text-xs text-gray-400 mt-6">
              {complaints.length} total {complaints.length === 1 ? 'complaint' : 'complaints'} in system
            </p>
          </div>
        </div>

        {/* Animation Styles */}
        <style jsx>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Map Controls */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Status Filters */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 mr-2">Filter:</span>
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedStatus === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setSelectedStatus('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedStatus === 'pending'
                  ? 'bg-yellow-500 text-white shadow-lg'
                  : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
              }`}
            >
              ⏳ Pending ({stats.pending})
            </button>
            <button
              onClick={() => setSelectedStatus('in progress')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedStatus === 'in progress'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              🔄 In Progress ({stats.inProgress})
            </button>
            <button
              onClick={() => setSelectedStatus('resolved')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedStatus === 'resolved'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              ✅ Resolved ({stats.resolved})
            </button>
          </div>

          {/* Map Settings */}
          <div className="flex items-center space-x-2">
            {/* Map Type Toggle */}
            <button
              onClick={() => setMapType(mapType === 'streets' ? 'satellite' : 'streets')}
              className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 hover:bg-gray-200 transition flex items-center space-x-1"
            >
              <span className="text-lg">🛰️</span>
              <span>{mapType === 'streets' ? 'Satellite' : 'Streets'}</span>
            </button>

            {/* Heatmap Toggle */}
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-3 py-2 rounded-lg text-sm transition flex items-center space-x-1 ${
                showHeatmap
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">🔥</span>
              <span>Heatmap</span>
            </button>

            {/* Cluster Toggle */}
            <button
              onClick={() => setShowClusters(!showClusters)}
              className={`px-3 py-2 rounded-lg text-sm transition flex items-center space-x-1 ${
                showClusters
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">📊</span>
              <span>Clusters</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg p-3 text-white">
            <p className="text-xs opacity-80">Total Complaints</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-yellow-500 rounded-lg p-3 text-white">
            <p className="text-xs opacity-80">Pending</p>
            <p className="text-2xl font-bold">{stats.pending}</p>
          </div>
          <div className="bg-blue-500 rounded-lg p-3 text-white">
            <p className="text-xs opacity-80">In Progress</p>
            <p className="text-2xl font-bold">{stats.inProgress}</p>
          </div>
          <div className="bg-green-500 rounded-lg p-3 text-white">
            <p className="text-xs opacity-80">Resolved</p>
            <p className="text-2xl font-bold">{stats.resolved}</p>
          </div>
        </div>
      </div>

      {/* Main Map */}
      <div className={`relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white`} style={{ height }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          className="z-0"
        >
          {/* Tile Layer based on selection */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url={mapType === 'streets' 
              ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            }
          />

          {/* Heatmap Layer */}
          {showHeatmap && heatmapData.length > 0 && (
            <HeatmapLayer data={heatmapData} />
          )}

          {/* Markers */}
          {filteredComplaints.map((complaint, index) => {
            if (!complaint.latitude || !complaint.longitude) return null;
            
            const position = [complaint.latitude, complaint.longitude];
            const icon = getMarkerIcon(complaint.status);
            
            return (
              <Marker
                key={complaint.id || index}
                position={position}
                icon={icon}
                eventHandlers={{
                  mouseover: () => setHoveredComplaint(complaint),
                  mouseout: () => setHoveredComplaint(null)
                }}
              >
                <Popup className="custom-popup">
                  <div className="min-w-[250px]">
                    {/* Popup Header */}
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                        complaint.status?.toLowerCase() === 'pending' ? 'bg-yellow-100' :
                        complaint.status?.toLowerCase() === 'in progress' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {complaint.category?.includes('Light') ? '💡' :
                         complaint.category?.includes('Garbage') ? '🗑️' :
                         complaint.category?.includes('Water') ? '💧' : '📋'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{complaint.category || 'General Issue'}</h4>
                        <p className="text-xs text-gray-500">ID: {complaint.complaint_id || `CMP_${index}`}</p>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3">{complaint.description || 'No description provided'}</p>
                    
                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-gray-500">Status</p>
                        <p className={`font-medium ${
                          complaint.status?.toLowerCase() === 'pending' ? 'text-yellow-600' :
                          complaint.status?.toLowerCase() === 'in progress' ? 'text-blue-600' : 'text-green-600'
                        }`}>
                          {complaint.status || 'Pending'}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-gray-500">Reported</p>
                        <p className="font-medium text-gray-700">
                          {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(`/issue/${complaint.complaint_id}`, '_blank')}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:shadow-lg transition"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => window.open(`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`, '_blank')}
                        className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200 transition"
                      >
                        🗺️
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Recenter on complaints */}
          <RecenterMap center={mapCenter} zoom={mapZoom} />
        </MapContainer>

        {/* Hover Tooltip */}
        {hoveredComplaint && (
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-xl p-3 z-10 max-w-xs">
            <p className="text-sm font-medium text-gray-800">{hoveredComplaint.category}</p>
            <p className="text-xs text-gray-500 mt-1">{hoveredComplaint.description?.substring(0, 100)}...</p>
          </div>
        )}

        {/* Map Legend */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur rounded-lg shadow-lg p-3 z-10">
          <p className="text-xs font-semibold text-gray-700 mb-2">📍 Legend</p>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Pending</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-600">In Progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Resolved</span>
            </div>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
          <button
            onClick={() => setMapZoom(z => Math.min(z + 1, 18))}
            className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center text-xl hover:bg-gray-50 transition"
          >
            +
          </button>
          <button
            onClick={() => setMapZoom(z => Math.max(z - 1, 3))}
            className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center text-xl hover:bg-gray-50 transition"
          >
            −
          </button>
        </div>
      </div>

      {/* Complaints List Preview */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Recent Complaints</h3>
          <span className="text-xs text-gray-500">Showing {Math.min(5, filteredComplaints.length)} of {filteredComplaints.length}</span>
        </div>
        <div className="space-y-2">
          {filteredComplaints.slice(0, 5).map((complaint, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  complaint.status?.toLowerCase() === 'pending' ? 'bg-yellow-500' :
                  complaint.status?.toLowerCase() === 'in progress' ? 'bg-blue-500' : 'bg-green-500'
                }`}></div>
                <span className="text-sm text-gray-600">{complaint.category || 'General Issue'}</span>
              </div>
              <span className="text-xs text-gray-400">{complaint.area || 'Location not specified'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Heatmap Layer Component
function HeatmapLayer({ data }) {
  const map = useMap();
  
  useEffect(() => {
    if (!map || !data.length) return;
    
    // @ts-ignore - Leaflet.heat plugin
    const heat = L.heatLayer(data, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: { 0.4: 'blue', 0.6: 'lime', 0.8: 'red' }
    }).addTo(map);
    
    return () => {
      map.removeLayer(heat);
    };
  }, [map, data]);
  
  return null;
}