// TrackComplaintPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { trackByPhone, getComplaintById, upvoteComplaint, addComment } from '../api/complaintApi';
import toast from 'react-hot-toast';

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return { 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
          icon: '⏳',
          label: 'Pending'
        };
      case 'in progress':
        return { 
          color: 'bg-blue-100 text-blue-800 border-blue-200', 
          icon: '🔄',
          label: 'In Progress'
        };
      case 'resolved':
        return { 
          color: 'bg-green-100 text-green-800 border-green-200', 
          icon: '✅',
          label: 'Resolved'
        };
      case 'rejected':
        return { 
          color: 'bg-red-100 text-red-800 border-red-200', 
          icon: '❌',
          label: 'Rejected'
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200', 
          icon: '📋',
          label: status
        };
    }
  };

  const config = getStatusConfig(status);
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center py-12">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-blue-200 rounded-full"></div>
      <div className="w-12 h-12 border-4 border-blue-600 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
    </div>
  </div>
);

// Format Date Helper
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export default function TrackComplaintPage() {
  const [mode, setMode] = useState('phone');
  const [input, setInput] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commentUserName, setCommentUserName] = useState('');

  const handleUpvote = async (id) => {
    try {
      await upvoteComplaint(id);
      setResults(prev => prev.map(c => 
        c.complaint_id === id ? { ...c, upvotes: (c.upvotes || 0) + 1 } : c
      ));
      toast.success("Complaint upvoted!");
    } catch (err) {
      toast.error("Failed to upvote. Please try again.");
    }
  };

  const handleAddComment = async (id) => {
    if (!commentText.trim()) return;
    try {
      const res = await addComment(id, { text: commentText, user_name: commentUserName || 'Anonymous' });
      setResults(prev => prev.map(c => 
        c.complaint_id === id ? { ...c, comments: [...(c.comments || []), { text: commentText, user_name: commentUserName || 'Anonymous', created_at: new Date() }] } : c
      ));
      setCommentText('');
      setActiveCommentId(null);
      toast.success("Comment added!");
    } catch (err) {
      toast.error("Failed to add comment.");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!input.trim()) { 
      setError('Please enter a value.'); 
      return; 
    }
    
    setError('');
    setResults(null);
    setLoading(true);

    try {
      let response;
      if (mode === 'phone') {
        if (!/^\d{10}$/.test(input.trim())) {
          setError('Please enter a valid 10-digit phone number');
          setLoading(false);
          return;
        }
        response = await trackByPhone(input.trim());
        setResults(response.data.data);
      } else {
        response = await getComplaintById(input.trim());
        setResults([response.data.data]);
      }
      
      // Add to recent searches
      setRecentSearches(prev => {
        const newSearch = { type: mode, value: input.trim(), timestamp: new Date() };
        const filtered = prev.filter(s => s.value !== input.trim());
        return [newSearch, ...filtered].slice(0, 5);
      });
      
    } catch (err) {
      setError('No complaints found. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setInput('');
    setResults(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 group"
          >
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
            Back to Home
          </Link>
          
          <div className="inline-block p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg mb-6">
            <span className="text-white text-3xl">🔍</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-white mb-2 transition-colors duration-300">Track Your Complaint</h1>
          <p className="text-base text-gray-600 dark:text-gray-300 transition-colors duration-300">Enter your phone number or complaint ID to check status</p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-colors duration-300">
          {/* Mode Toggle */}
          <div className="bg-gradient-to-r from-gray-50 dark:from-slate-700 to-gray-100 dark:to-slate-800 p-1 transition-colors duration-300">
            <div className="flex rounded-xl bg-white dark:bg-slate-900 p-1 shadow-inner transition-colors duration-300">
              <button
                onClick={() => { setMode('phone'); setResults(null); setInput(''); setError(''); }}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                  mode === 'phone' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className="mr-2">📱</span>
                By Phone Number
              </button>
              <button
                onClick={() => { setMode('id'); setResults(null); setInput(''); setError(''); }}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                  mode === 'id' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className="mr-2">🆔</span>
                By Complaint ID
              </button>
            </div>
          </div>

          {/* Search Form */}
          <div className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative flex">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => { setInput(e.target.value); setError(''); }}
                    placeholder={mode === 'phone' 
                      ? "Enter 10-digit phone number" 
                      : "Enter Complaint ID (e.g., CMP_874123)"
                    }
                    className="flex-1 px-8 py-4 border-2 border-gray-200 dark:border-slate-700 rounded-l-2xl focus:outline-none focus:border-blue-500 transition-all duration-300 text-lg font-medium bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                  />
                    <button
                      type="submit"
                      className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base rounded-r-2xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-3"
                    >
                      <span>Search</span>
                      <span className="text-xl">→</span>
                    </button>
                </div>
              </div>

              {input && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <span className="mr-1">✕</span>
                  Clear search
                </button>
              )}

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                  <div className="flex items-center">
                    <span className="text-red-500 mr-3">⚠️</span>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}
            </form>

            {/* Recent Searches */}
            {recentSearches.length > 0 && !results && (
              <div className="mt-6">
                <p className="text-xs text-gray-500 mb-2">Recent Searches</p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInput(search.value);
                        setMode(search.type);
                      }}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-600 transition-colors duration-300 flex items-center"
                    >
                      <span className="mr-1">{search.type === 'phone' ? '📱' : '🆔'}</span>
                      {search.value}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Results Section */}
        {results && results.length > 0 && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white transition-colors duration-300">
                Found {results.length} {results.length === 1 ? 'Complaint' : 'Complaints'}
              </h2>
              <button
                onClick={() => setResults(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Hide Results
              </button>
            </div>

            {results.map((complaint, index) => (
              <div
                key={complaint.complaint_id}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Priority Indicator */}
                <div className={`absolute top-0 left-0 w-1 h-full ${
                  complaint.priority === 'High' ? 'bg-red-500' :
                  complaint.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>

                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div className="flex items-center space-x-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md ${
                        complaint.priority === 'High' ? 'bg-red-100' :
                        complaint.priority === 'Medium' ? 'bg-yellow-100' : 'bg-green-100'
                      }`}>
                        {complaint.category.includes('Light') ? '💡' :
                         complaint.category.includes('Garbage') ? '🗑️' : '📋'}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 leading-tight">{complaint.category}</h3>
                        <div className="flex items-center space-x-2 text-base">
                          <span className="font-mono text-blue-600 font-bold">#{complaint.complaint_id}</span>
                          <span className="text-gray-300 dark:text-gray-600">•</span>
                          <span className="text-gray-600 dark:text-gray-300 font-medium">{complaint.address || 'Location not specified'}</span>
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={complaint.status} />
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 line-clamp-2">{complaint.description}</p>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Reported Date</p>
                      <p className="text-sm font-medium text-gray-800">{formatDate(complaint.created_at)}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Priority</p>
                      <p className={`text-sm font-medium ${
                        complaint.priority === 'High' ? 'text-red-600' :
                        complaint.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {complaint.priority}
                      </p>
                    </div>

                    {complaint.expected_resolution && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Expected Resolution</p>
                        <p className="text-sm font-medium text-gray-800">{formatDate(complaint.expected_resolution)}</p>
                      </div>
                    )}

                    {complaint.name && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Reported By</p>
                        <p className="text-sm font-medium text-gray-800">{complaint.name}</p>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar for In Progress complaints */}
                  {complaint.status === 'In Progress' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>65%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleUpvote(complaint.complaint_id)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 text-center flex items-center justify-center"
                    >
                      <span className="mr-2">👍</span>
                      Upvote ({complaint.upvotes || 0})
                    </button>
                    
                    <button
                      onClick={() => setActiveCommentId(activeCommentId === complaint.complaint_id ? null : complaint.complaint_id)}
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-300 flex items-center justify-center"
                    >
                      <span className="mr-2">💬</span>
                      Comment ({complaint.comments?.length || 0})
                    </button>
                    
                    <Link
                      to={`/issue/${complaint.complaint_id}`}
                      className="px-4 py-2 border-2 border-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all duration-300 text-center"
                    >
                      Details
                    </Link>
                  </div>

                  {/* Comment Section (Expandable) */}
                  {activeCommentId === complaint.complaint_id && (
                    <div className="mt-6 pt-6 border-t border-gray-100 animate-slideDown">
                      <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {complaint.comments?.length > 0 ? (
                          complaint.comments.map((comment, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-blue-600 text-[10px] font-bold uppercase">{comment.user_name}</p>
                                <p className="text-gray-400 text-[9px]">{new Date(comment.created_at).toLocaleDateString()}</p>
                              </div>
                              <p className="text-gray-700 text-xs">{comment.text}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 text-xs text-center py-2 italic">No comments yet.</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <input 
                          type="text" 
                          placeholder="Your name (optional)"
                          value={commentUserName}
                          onChange={(e) => setCommentUserName(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <div className="flex space-x-2">
                          <input 
                            type="text" 
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment(complaint.complaint_id)}
                            className="flex-grow bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                          />
                          <button 
                            onClick={() => handleAddComment(complaint.complaint_id)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-lg font-bold text-sm transition-all duration-300"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timeline Preview */}
                  <div className="mt-4 flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      Reported
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                      Assigned
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                      In Progress
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-gray-300 rounded-full mr-1"></span>
                      Resolution
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results State */}
        {results && results.length === 0 && (
          <div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-12 text-center transition-colors duration-300">
            <div className="w-20 h-20 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 transition-colors duration-300">No Complaints Found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 transition-colors duration-300">We couldn't find any complaints matching your search.</p>
            <button
              onClick={clearSearch}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Try Another Search
            </button>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                ❓
              </div>
              <div>
                <h3 className="font-semibold mb-1">Need Help Tracking?</h3>
                <p className="text-sm text-blue-100">Check your complaint ID from the email/SMS you received</p>
              </div>
            </div>
            <button
              onClick={() => window.location.href = 'mailto:support@civicfix.com'}
              className="px-6 py-2 bg-white text-blue-600 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Contact Support
            </button>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 text-center">
            <span className="text-2xl mb-2 block">📱</span>
            <h4 className="font-medium text-gray-800 mb-1">Phone Number</h4>
            <p className="text-xs text-gray-500">Use the number you registered with</p>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 text-center">
            <span className="text-2xl mb-2 block">🆔</span>
            <h4 className="font-medium text-gray-800 mb-1">Complaint ID</h4>
            <p className="text-xs text-gray-500">Format: CMP_ followed by 6 digits</p>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 text-center">
            <span className="text-2xl mb-2 block">⏱️</span>
            <h4 className="font-medium text-gray-800 mb-1">24/7 Tracking</h4>
            <p className="text-xs text-gray-500">Check status anytime, anywhere</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}