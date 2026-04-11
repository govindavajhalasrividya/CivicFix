// AdminDashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getComplaints, updateStatus, assignWorker } from "../api/complaintApi";
import { getWorkers } from "../api/workerApi";
import { X, ExternalLink, User, Calendar, MapPin, Tag, Flag, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

// Helper component for professional status badges
const StatusBadge = ({ status }) => {
  const configs = {
    'Reported': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: <AlertTriangle size={14} />, label: 'New Report' },
    'Under Review': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: <Clock size={14} />, label: 'Reviewing' },
    'In Progress': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: <Clock size={14} />, label: 'In Progress' },
    'Resolved': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: <CheckCircle size={14} />, label: 'Resolved' },
  };
  const config = configs[status] || configs['Reported'];

  return (
    <span className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border-2 ${config.bg} ${config.text} ${config.border}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState([
    { label: "Total Complaints", value: "0", change: "+0%", icon: "📋", color: "from-blue-500 to-blue-600" },
    { label: "New Reports", value: "0", change: "0%", icon: "🔔", color: "from-yellow-500 to-yellow-600" },
    { label: "In Progress", value: "0", change: "0%", icon: "🔄", color: "from-purple-500 to-purple-600" },
    { label: "Resolved", value: "0", change: "0%", icon: "✅", color: "from-green-500 to-green-600" },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [complaintsRes, workersRes] = await Promise.all([
        getComplaints(),
        getWorkers()
      ]);
      
      const complaintsData = complaintsRes.data.data.complaints;
      setComplaints(complaintsData);
      setWorkers(workersRes.data.data);

      // Calculate stats
      const total = complaintsData.length;
      const reported = complaintsData.filter(c => c.status === "Reported").length;
      const inProgress = complaintsData.filter(c => c.status === "In Progress").length;
      const resolved = complaintsData.filter(c => c.status === "Resolved").length;

      setStats([
        { label: "Total Complaints", value: total.toString(), change: "+0%", icon: "📋", color: "from-blue-500 to-blue-600" },
        { label: "New Reports", value: reported.toString(), change: "0%", icon: "🔔", color: "from-yellow-500 to-yellow-600" },
        { label: "In Progress", value: inProgress.toString(), change: "0%", icon: "🔄", color: "from-purple-500 to-purple-600" },
        { label: "Resolved", value: resolved.toString(), change: "0%", icon: "✅", color: "from-green-500 to-green-600" },
      ]);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateStatus(id, newStatus);
      // Refresh local state if modal is open
      if (selectedComplaint && selectedComplaint.complaint_id === id) {
        setSelectedComplaint({ ...selectedComplaint, status: newStatus });
      }
      fetchData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleWorkerAssignment = async (id, workerId) => {
    if (!workerId) return;
    try {
      await assignWorker(id, workerId);
      // Refresh local state if modal is open
      if (selectedComplaint && selectedComplaint.complaint_id === id) {
        setSelectedComplaint({ ...selectedComplaint, assigned_worker_id: workerId });
      }
      fetchData();
    } catch (err) {
      alert("Failed to assign worker");
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Reported": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "In Progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Resolved": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getFilteredComplaints = () => {
    return complaints
      .filter(c => {
        if (selectedFilter !== "all") {
          const statusMap = {
            "pending": "Reported",
            "in progress": "In Progress",
            "resolved": "Resolved"
          };
          if (c.status !== statusMap[selectedFilter]) return false;
        }
        if (searchTerm && !c.description.toLowerCase().includes(searchTerm.toLowerCase()) && 
            !c.category.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  };

  const openDetailModal = (complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  const filteredComplaints = getFilteredComplaints();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-3xl">🏛️</span>
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-500 font-medium tracking-tight">Manage and track civic complaints</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button onClick={fetchData} className="p-2 hover:bg-gray-100 rounded-lg transition" title="Refresh">
                <span className="text-xl">🔄</span>
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">A</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-xl opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1 font-bold">{stat.label}</p>
                  <p className="text-4xl font-black text-gray-800">{stat.value}</p>
                </div>
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
              <div className="flex space-x-2">
                {["all", "pending", "in progress", "resolved"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-300 ${
                      selectedFilter === filter
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search issues or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading complaints...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-5 text-left text-sm font-black text-gray-700 uppercase tracking-widest">ID</th>
                    <th className="px-6 py-5 text-left text-sm font-black text-gray-700 uppercase tracking-widest">Image</th>
                    <th className="px-6 py-5 text-left text-sm font-black text-gray-700 uppercase tracking-widest">Issue & Address</th>
                    <th className="px-6 py-5 text-left text-sm font-black text-gray-700 uppercase tracking-widest">Category</th>
                    <th className="px-6 py-5 text-left text-sm font-black text-gray-700 uppercase tracking-widest">Community</th>
                    <th className="px-6 py-5 text-left text-sm font-black text-gray-700 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-5 text-left text-sm font-black text-gray-700 uppercase tracking-widest">Assigned To</th>
                    <th className="px-6 py-5 text-left text-sm font-black text-gray-700 uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-5xl">🔭</span>
                          </div>
                          <h3 className="text-2xl font-black text-gray-800 mb-2">No complaints found</h3>
                          <p className="text-gray-500 max-w-xs mx-auto text-lg">Adjust your filters or search terms to find what you're looking for.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map((complaint) => (
                      <tr 
                        key={complaint.complaint_id} 
                        className="hover:bg-blue-50/50 transition-all duration-300 group cursor-pointer"
                        onClick={() => openDetailModal(complaint)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                            #{complaint.complaint_id}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm group-hover:scale-110 transition-transform duration-300">
                             <img 
                               src={complaint.image_url} 
                               alt="Report" 
                               className="w-full h-full object-cover"
                               onError={(e) => e.target.src = 'https://placehold.co/100x100?text=No+Image'}
                             />
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="text-base font-black text-gray-900 group-hover:text-blue-700 transition-colors uppercase tracking-tight">{complaint.description}</div>
                            {complaint.status === 'Reported' && (
                              <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md animate-pulse">NEW</span>
                            )}
                          </div>
                          <div className="text-sm text-blue-600 font-bold italic bg-blue-50 px-3 py-1 rounded-lg inline-block border border-blue-100 mb-2">{complaint.address || "No address provided"}</div>
                          <div className="text-xs text-gray-400 font-medium">By {complaint.name}</div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-lg font-bold text-gray-700">
                          {complaint.category}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex flex-col space-y-2">
                            <span className="text-base font-black text-gray-800 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">👍 {complaint.upvotes || 0}</span>
                            <span className="text-xs font-bold text-gray-500 px-3">💬 {complaint.comments?.length || 0}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <select 
                            value={complaint.status}
                            onChange={(e) => handleStatusUpdate(complaint.complaint_id, e.target.value)}
                            className={`px-3 py-1 text-xs font-semibold rounded-full border focus:outline-none ${getStatusColor(complaint.status)}`}
                          >
                            <option value="Reported">Reported</option>
                            <option value="Under Review">Under Review</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <select 
                            value={complaint.assigned_worker_id || ""}
                            onChange={(e) => handleWorkerAssignment(complaint.complaint_id, e.target.value)}
                            className="text-sm border border-gray-200 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                          >
                            <option value="">Unassigned</option>
                            {workers.map(worker => (
                              <option key={worker.worker_id} value={worker.worker_id}>
                                {worker.name} ({worker.department})
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(complaint.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-scaleUp">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-mono text-blue-600 font-black bg-blue-50 px-4 py-1.5 rounded-xl border border-blue-100">
                  #{selectedComplaint.complaint_id}
                </span>
                <StatusBadge status={selectedComplaint.status} />
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-3 hover:bg-gray-100 rounded-2xl transition-all duration-300 text-gray-400 hover:text-gray-900"
              >
                <X size={28} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left side: Image & Map */}
                <div className="space-y-6">
                  <div className="rounded-[2rem] overflow-hidden border-4 border-gray-100 shadow-xl group relative">
                    <img 
                      src={selectedComplaint.image_url} 
                      alt="Report" 
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <a 
                        href={selectedComplaint.image_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-white text-gray-900 px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 shadow-2xl transform scale-90 group-hover:scale-100 transition-all"
                      >
                        <ExternalLink size={20} />
                        <span>View Full Image</span>
                      </a>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-[2rem] p-6 border-2 border-blue-100">
                    <h4 className="flex items-center space-x-2 text-blue-800 font-black uppercase tracking-widest text-sm mb-4">
                      <MapPin size={18} />
                      <span>Exact Location</span>
                    </h4>
                    <p className="text-blue-900 text-lg font-bold mb-4">{selectedComplaint.address || "No address provided"}</p>
                    <a 
                      href={`https://www.google.com/maps?q=${selectedComplaint.latitude},${selectedComplaint.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-2 text-blue-600 font-bold hover:underline"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>

                {/* Right side: Details & Actions */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4 leading-tight">
                      {selectedComplaint.description}
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-xl text-gray-600 font-bold text-sm">
                        <Tag size={16} />
                        <span>{selectedComplaint.category}</span>
                      </span>
                      <span className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-xl text-purple-600 font-bold text-sm border border-purple-100">
                        <User size={16} />
                        <span>{selectedComplaint.name}</span>
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100">
                    <h4 className="text-gray-400 font-black uppercase tracking-widest text-xs mb-6">Management Panel</h4>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Update Progress Status</label>
                        <div className="grid grid-cols-2 gap-3">
                          {["Reported", "Under Review", "In Progress", "Resolved"].map(status => (
                            <button
                              key={status}
                              onClick={() => handleStatusUpdate(selectedComplaint.complaint_id, status)}
                              className={`px-4 py-3 rounded-xl text-sm font-bold border-2 transition-all duration-300 ${
                                selectedComplaint.status === status
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Assign Field Worker</label>
                        <div className="relative">
                          <select 
                            value={selectedComplaint.assigned_worker_id || ""}
                            onChange={(e) => handleWorkerAssignment(selectedComplaint.complaint_id, e.target.value)}
                            className="w-full bg-white border-2 border-gray-200 px-5 py-4 rounded-2xl font-bold text-gray-800 outline-none focus:border-blue-500 transition-all duration-300 appearance-none shadow-sm"
                          >
                            <option value="">Choose a worker...</option>
                            {workers.map(worker => (
                              <option key={worker.worker_id} value={worker.worker_id}>
                                {worker.name} — {worker.department}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-gray-400 px-4">
                    <div className="flex items-center space-x-2">
                      <Calendar size={18} />
                      <span className="text-sm font-bold">{new Date(selectedComplaint.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Flag size={18} />
                      <span className="text-sm font-bold">Priority: {selectedComplaint.upvotes > 50 ? 'Critical' : 'Standard'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end space-x-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-100 transition-all duration-300"
              >
                Close View
              </button>
              <button 
                onClick={() => {
                  alert(`Direct contact with ${selectedComplaint.name} initiated via platform messaging.`);
                }}
                className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all duration-300 shadow-xl"
              >
                Contact Citizen
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-scaleUp { animation: scaleUp 0.3s ease-out; }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ddd;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ccc;
        }
      `}</style>
    </div>
  );
}