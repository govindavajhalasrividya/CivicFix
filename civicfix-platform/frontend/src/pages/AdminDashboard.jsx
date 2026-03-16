// AdminDashboard.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const complaints = [
    { id: 1, issue: "Street light not working", area: "Sector 5", status: "Pending", priority: "High", date: "2024-03-15", reports: 3 },
    { id: 2, issue: "Garbage not collected", area: "Sector 8", status: "In Progress", priority: "Medium", date: "2024-03-14", reports: 5 },
    { id: 3, issue: "Water leakage", area: "Sector 2", status: "Resolved", priority: "Low", date: "2024-03-13", reports: 2 },
    { id: 4, issue: "Broken traffic signal", area: "Sector 3", status: "Pending", priority: "High", date: "2024-03-15", reports: 4 },
    { id: 5, issue: "Pothole on main road", area: "Sector 7", status: "In Progress", priority: "High", date: "2024-03-14", reports: 7 },
    { id: 6, issue: "Stray animals", area: "Sector 4", status: "Resolved", priority: "Medium", date: "2024-03-12", reports: 2 },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "In Progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Resolved": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const stats = [
    { label: "Total Complaints", value: "1,247", change: "+12%", icon: "📋", color: "from-blue-500 to-blue-600" },
    { label: "Pending", value: "342", change: "-5%", icon: "⏳", color: "from-yellow-500 to-yellow-600" },
    { label: "In Progress", value: "523", change: "+8%", icon: "🔄", color: "from-purple-500 to-purple-600" },
    { label: "Resolved", value: "382", change: "+23%", icon: "✅", color: "from-green-500 to-green-600" },
  ];

  const filteredComplaints = complaints.filter(c => {
    if (selectedFilter !== "all" && c.status.toLowerCase() !== selectedFilter) return false;
    if (searchTerm && !c.issue.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !c.area.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">🏛️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-500">Manage and track civic complaints</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-4 py-2">
                <span className="text-sm text-gray-600">Last updated:</span>
                <span className="text-sm font-semibold text-gray-900">2 min ago</span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <span className="text-xl">🔔</span>
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
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  <p className={`text-xs mt-2 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
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
                placeholder="Search complaints or areas..."
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Issue</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Area</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reports</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-gray-50 transition-colors duration-200 group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-blue-600 font-semibold">
                        #{complaint.id.toString().padStart(4, '0')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{complaint.issue}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600">{complaint.area}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(complaint.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {complaint.reports} reports
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button className="text-blue-600 hover:text-blue-800">
                          <span className="text-lg">👁️</span>
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          <span className="text-lg">✏️</span>
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <span className="text-lg">🗑️</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredComplaints.length}</span> of{" "}
                <span className="font-semibold">{complaints.length}</span> complaints
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
                  Previous
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
                  1
                </button>
                <button className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
                  2
                </button>
                <button className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
                  3
                </button>
                <button className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <button className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                📊
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold">Generate Report</h3>
                <p className="text-blue-100 text-sm">Export complaint analytics</p>
              </div>
            </div>
          </button>

          <button className="group relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                👥
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold">Assign Workers</h3>
                <p className="text-purple-100 text-sm">Manage task allocation</p>
              </div>
            </div>
          </button>

          <button className="group relative bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                ⚙️
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold">Settings</h3>
                <p className="text-green-100 text-sm">Configure system</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}