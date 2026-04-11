import { useState, useEffect } from 'react';
import { getComplaints, upvoteComplaint, addComment } from '../api/complaintApi';
import toast from 'react-hot-toast';

export default function SeeProblemsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [commentingId, setCommentingId] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn("Location access denied", error);
        }
      );
    }
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await getComplaints();
      // If we have user location, sort by distance in frontend for now 
      // (Simplified version of backend's $geoNear)
      let list = res.data.data.complaints;
      setComplaints(list);
    } catch (err) {
      console.error("Error fetching problems:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (id) => {
    try {
      await upvoteComplaint(id);
      // Optimistic update or refetch
      setComplaints(prev => prev.map(c => 
        c.complaint_id === id ? { ...c, upvotes: (c.upvotes || 0) + 1 } : c
      ));
      toast.success("Complaint priority increased!");
    } catch (err) {
      toast.error("Failed to upvote");
    }
  };

  const handleAddComment = async (id) => {
    if (!newComment.trim()) return;
    try {
      const res = await addComment(id, { text: newComment, user_name: userName || 'Anonymous' });
      setComplaints(prev => prev.map(c => 
        c.complaint_id === id ? { ...c, comments: [...(c.comments || []), { text: newComment, user_name: userName || 'Anonymous', created_at: new Date() }] } : c
      ));
      setNewComment('');
      setCommentingId(null);
      toast.success("Comment added to discussion!");
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 pt-10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Section */}
        <div className="relative mb-12 text-center">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-60 h-60 bg-blue-500/10 blur-[120px] rounded-full"></div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight transition-colors duration-300">
            Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Bulletin</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-medium transition-colors duration-300">
            Real-time updates on local community issues. Upvote to prioritize and collaborate on solutions.
          </p>
        </div>

        {/* Filters/Location Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 px-2">
          <div className="flex items-center space-x-3 bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 px-6 py-3 rounded-2xl shadow-sm transition-colors duration-300">
            <span className="text-2xl text-blue-600">📍</span>
            <span className="text-gray-800 dark:text-white text-lg font-bold transition-colors duration-300">
              {userLocation ? "Nearby Reports" : "All local issues"}
            </span>
          </div>
          <button 
            onClick={fetchComplaints}
            className="flex items-center space-x-3 bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 px-8 py-3 rounded-2xl transition-all duration-300 shadow-sm font-bold text-lg transform hover:-translate-y-0.5 active:scale-95"
          >
            <span className="text-xl">🔄</span>
            <span>Refresh Updates</span>
          </button>
        </div>

        {/* Complaints List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Updating community feed...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl p-12 text-center shadow-sm transition-colors duration-300">
            <div className="text-6xl mb-6">🏙️</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 transition-colors duration-300">No problems reported yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Your community feed is clear! Report an issue to help your neighborhood.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {complaints.map((item) => (
              <div 
                key={item.complaint_id}
                className="group bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl shadow-sm"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Image Placeholder/Image */}
                    <div className="md:w-56 h-56 rounded-2xl overflow-hidden flex-shrink-0 relative shadow-inner bg-gray-100 border border-gray-100">
                      <img 
                        src={item.image_url} 
                        alt="Issue" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-slate-700 uppercase tracking-wider">
                        {item.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border-2 ${
                              item.status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-200' :
                              item.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              'bg-orange-50 text-orange-700 border-orange-200'
                            }`}>
                              {item.status}
                            </span>
                            <span className="text-gray-400 text-sm font-mono font-bold">#{item.complaint_id}</span>
                          </div>
                          <h3 className="text-3xl font-black text-gray-900 dark:text-white leading-tight mb-4 transition-colors duration-300">
                            {item.description}
                          </h3>
                        </div>
                      </div>

                      <div className="bg-blue-50/50 rounded-2xl p-6 mb-8 border-2 border-blue-100/50">
                        <p className="text-gray-700 dark:text-gray-200 text-lg flex items-start font-medium transition-colors duration-300">
                          <span className="mr-3 text-2xl">📍</span>
                          <span>{item.address || "Location specified via GPS"}</span>
                        </p>
                      </div>

                      <p className="text-gray-500 dark:text-gray-400 text-xs mb-6 flex-grow transition-colors duration-300">
                        Reported by <span className="text-gray-800 dark:text-gray-200 font-bold transition-colors duration-300">{item.name}</span> • {new Date(item.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center space-x-4 mt-auto">
                        <button 
                          onClick={() => handleUpvote(item.complaint_id)}
                          className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl transition-all duration-300 transform active:scale-95 group/btn shadow-lg shadow-blue-200"
                        >
                          <span className="group-hover/btn:animate-bounce text-lg">👍</span>
                          <span>Priority ({item.upvotes || 0})</span>
                        </button>
                        <button 
                          onClick={() => setCommentingId(commentingId === item.complaint_id ? null : item.complaint_id)}
                          className="flex-1 flex items-center justify-center space-x-2 bg-gray-50 dark:bg-slate-700 hover:bg-white dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-200 font-bold py-3.5 rounded-2xl transition-all duration-300 transform active:scale-95"
                        >
                          <span className="text-lg">💬</span>
                          <span>Discuss ({item.comments?.length || 0})</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Comment Section (Expandable) */}
                  {commentingId === item.complaint_id && (
                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-slate-700 animate-slideDown">
                      <div className="space-y-4 mb-6 max-h-56 overflow-y-auto pr-3 custom-scrollbar">
                        {item.comments?.length > 0 ? (
                          item.comments.map((comment, idx) => (
                            <div key={idx} className="bg-gray-50 dark:bg-slate-700 rounded-2xl p-4 border border-gray-100 dark:border-slate-600 transition-colors duration-300">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-blue-700 dark:text-blue-400 text-xs font-black uppercase">{comment.user_name}</p>
                                <p className="text-gray-400 dark:text-gray-500 text-[10px]">{new Date(comment.created_at).toLocaleDateString()}</p>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed transition-colors duration-300">{comment.text}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <span className="text-3xl mb-2 block">💬</span>
                            <p className="text-gray-400 text-sm italic">No discussion yet. Be the first to speak up!</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col space-y-3 bg-gray-50 dark:bg-slate-700 p-4 rounded-3xl border border-gray-100 dark:border-slate-600 transition-colors duration-300">
                        <input 
                          type="text" 
                          placeholder="Your name (optional)"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-2 text-gray-800 dark:text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <div className="flex space-x-2">
                          <input 
                            type="text" 
                            placeholder="Share an update or perspective..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment(item.complaint_id)}
                            className="flex-grow bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-2xl px-6 py-3.5 text-gray-800 dark:text-white focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
                          />
                          <button 
                            onClick={() => handleAddComment(item.complaint_id)}
                            className="bg-gray-900 dark:bg-gray-100 hover:bg-black dark:hover:bg-white text-white dark:text-gray-900 px-8 rounded-2xl font-bold transition-all duration-300 active:scale-95 shadow-md"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.03);
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
