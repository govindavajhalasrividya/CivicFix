// IssueDetailsPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

// Mock API functions (replace with actual imports)
const getComplaintById = (id) => {
  return Promise.resolve({
    data: {
      data: {
        complaint_id: id || "CMP_874123",
        category: "Street Light Malfunction",
        status: "In Progress",
        image_url: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        description: "Street light not working for the past 3 days. Area is completely dark at night, posing safety risks for pedestrians and vehicles.",
        name: "Rahul Sharma",
        phone_number: "+91 98765 43210",
        email: "rahul.sharma@email.com",
        latitude: "17.3850",
        longitude: "78.4867",
        created_at: "2024-03-15T10:30:00Z",
        assigned_worker_id: "WRK_456",
        assigned_worker_name: "Rajesh Kumar",
        resolution_image_url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        resolution_notes: "Fixed the electrical connection. Replaced faulty wiring.",
        resolved_at: "2024-03-16T14:20:00Z",
        upvotes: 24,
        comments: 7
      }
    }
  });
};

// Status badge component
const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '⏳' };
      case 'in progress':
        return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '🔄' };
      case 'resolved':
        return { color: 'bg-green-100 text-green-800 border-green-200', icon: '✅' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800 border-red-200', icon: '❌' };
      default:
        return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: '📋' };
    }
  };

  const config = getStatusConfig(status);
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
      <span className="mr-1">{config.icon}</span>
      {status}
    </span>
  );
};

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
      <div className="w-16 h-16 border-4 border-blue-600 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
    </div>
  </div>
);

// Format date helper
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export default function IssueDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    getComplaintById(id)
      .then((res) => {
        setComplaint(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Complaint not found.');
        setLoading(false);
      });
  }, [id]);

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">😕</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            <span className="mr-2">←</span>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" onClick={() => setIsImageModalOpen(false)}>
          <div className="relative max-w-5xl w-full">
            <img src={selectedImage} alt="Full size" className="w-full h-auto rounded-lg" />
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4">
        {/* Navigation */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <span className="mr-2 text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back</span>
          </button>
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                📋
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">{complaint.category}</h1>
                <div className="flex items-center space-x-3 text-sm">
                  <span className="font-mono text-blue-600 font-semibold">{complaint.complaint_id}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-500">Reported {formatDate(complaint.created_at)}</span>
                </div>
              </div>
            </div>
            <StatusBadge status={complaint.status} />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'details', label: 'Details', icon: '📄' },
                { id: 'updates', label: 'Updates', icon: '🔄' },
                { id: 'media', label: 'Media', icon: '📸' },
                { id: 'activity', label: 'Activity', icon: '📊' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Main Image */}
                {complaint.image_url && (
                  <div 
                    className="relative rounded-xl overflow-hidden cursor-pointer group"
                    onClick={() => openImageModal(complaint.image_url)}
                  >
                    <img
                      src={complaint.image_url}
                      alt="Issue"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white text-lg">Click to enlarge</span>
                    </div>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Description</h3>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{complaint.description}</p>
                    
                    <h3 className="text-lg font-semibold text-gray-800">Reporter Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Name</span>
                        <span className="text-gray-800 font-medium">{complaint.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Phone</span>
                        <span className="text-gray-800 font-medium">{complaint.phone_number}</span>
                      </div>
                      {complaint.email && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Email</span>
                          <span className="text-gray-800 font-medium">{complaint.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Location Details</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Latitude</span>
                        <span className="font-mono text-gray-800">{complaint.latitude}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Longitude</span>
                        <span className="font-mono text-gray-800">{complaint.longitude}</span>
                      </div>
                      <div className="pt-2">
                        <a
                          href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <span className="mr-1">📍</span>
                          View on Google Maps
                        </a>
                      </div>
                    </div>

                    {complaint.assigned_worker_name && (
                      <>
                        <h3 className="text-lg font-semibold text-gray-800">Assignment</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600">👷</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{complaint.assigned_worker_name}</p>
                              <p className="text-sm text-gray-500">ID: {complaint.assigned_worker_id}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Social Stats */}
                <div className="flex items-center space-x-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">👍</span>
                    <span className="font-semibold text-gray-800">{complaint.upvotes}</span>
                    <span className="text-gray-500">upvotes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">💬</span>
                    <span className="font-semibold text-gray-800">{complaint.comments}</span>
                    <span className="text-gray-500">comments</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'media' && complaint.resolution_image_url && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Resolution Photo</h3>
                <div 
                  className="relative rounded-xl overflow-hidden cursor-pointer group max-w-2xl"
                  onClick={() => openImageModal(complaint.resolution_image_url)}
                >
                  <img
                    src={complaint.resolution_image_url}
                    alt="Resolution"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-lg">Click to enlarge</span>
                  </div>
                </div>
                
                {complaint.resolution_notes && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">{complaint.resolution_notes}</p>
                    {complaint.resolved_at && (
                      <p className="text-xs text-green-600 mt-2">
                        Resolved on {formatDate(complaint.resolved_at)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'updates' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Status Timeline</h3>
                <div className="relative pl-8 pb-4">
                  {/* Timeline line */}
                  <div className="absolute left-3 top-2 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  {/* Timeline items */}
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="absolute -left-6 mt-1.5 w-3 h-3 bg-green-500 rounded-full"></div>
                      <p className="text-sm font-medium text-gray-800">Report Submitted</p>
                      <p className="text-xs text-gray-500">{formatDate(complaint.created_at)}</p>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-6 mt-1.5 w-3 h-3 bg-blue-500 rounded-full"></div>
                      <p className="text-sm font-medium text-gray-800">Assigned to {complaint.assigned_worker_name}</p>
                      <p className="text-xs text-gray-500">Worker assigned for resolution</p>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-6 mt-1.5 w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <p className="text-sm font-medium text-gray-800">In Progress</p>
                      <p className="text-xs text-gray-500">Work started on site</p>
                    </div>

                    {complaint.status === 'Resolved' && (
                      <div className="relative">
                        <div className="absolute -left-6 mt-1.5 w-3 h-3 bg-green-500 rounded-full"></div>
                        <p className="text-sm font-medium text-gray-800">Resolved</p>
                        <p className="text-xs text-gray-500">{formatDate(complaint.resolved_at)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Activity Log</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-600">👁️</span>
                    <div>
                      <p className="text-sm text-gray-800">Viewed by 5 different users</p>
                      <p className="text-xs text-gray-500">Last view: 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-600">🔄</span>
                    <div>
                      <p className="text-sm text-gray-800">Status changed to "In Progress"</p>
                      <p className="text-xs text-gray-500">by Admin on {formatDate(complaint.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-purple-600">📸</span>
                    <div>
                      <p className="text-sm text-gray-800">Resolution photo uploaded</p>
                      <p className="text-xs text-gray-500">by {complaint.assigned_worker_name}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <button className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative flex items-center justify-center space-x-2">
              <span className="text-white text-xl">📞</span>
              <span className="text-white font-medium">Contact</span>
            </div>
          </button>
          
          <button className="group relative bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative flex items-center justify-center space-x-2">
              <span className="text-white text-xl">📋</span>
              <span className="text-white font-medium">Update Status</span>
            </div>
          </button>
          
          <button className="group relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative flex items-center justify-center space-x-2">
              <span className="text-white text-xl">👥</span>
              <span className="text-white font-medium">Reassign</span>
            </div>
          </button>
          
          <button className="group relative bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-4 overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative flex items-center justify-center space-x-2">
              <span className="text-white text-xl">👍</span>
              <span className="text-white font-medium">Upvote ({complaint.upvotes})</span>
            </div>
          </button>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Comments</h3>
          <div className="space-y-4">
            {/* Comment input */}
            <div className="flex space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white">👤</span>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* Sample comments */}
            <div className="flex space-x-3 pt-4 border-t border-gray-100">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span>👤</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Priya Singh</p>
                <p className="text-sm text-gray-600">Hope this gets resolved soon! Area is really dark at night.</p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span>👤</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Amit Patel</p>
                <p className="text-sm text-gray-600">Thanks for reporting this. I've also faced the same issue.</p>
                <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Row component for consistent display
function Row({ label, value, mono }) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className={`text-gray-800 text-right ${mono ? 'font-mono font-semibold text-blue-700' : ''}`}>
        {value || '—'}
      </span>
    </div>
  );
}