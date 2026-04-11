// HomePage.jsx
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function HomePage() {
  const [stats, setStats] = useState({ reported: 0, resolved: 0, users: 0 });
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef([]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.dataset.index]: true }));
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Animated counter
  useEffect(() => {
    const targets = { reported: 1247, resolved: 982, users: 523 };
    const duration = 2000;
    const steps = 60;
    const increment = {
      reported: targets.reported / steps,
      resolved: targets.resolved / steps,
      users: targets.users / steps,
    };
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setStats({
        reported: Math.min(Math.floor(increment.reported * currentStep), targets.reported),
        resolved: Math.min(Math.floor(increment.resolved * currentStep), targets.resolved),
        users: Math.min(Math.floor(increment.users * currentStep), targets.users),
      });
      
      if (currentStep >= steps) clearInterval(timer);
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, []);

  const issues = [
    { lat: 17.385, lng: 78.4867, title: "Pothole", type: "danger", icon: "🕳️" },
    { lat: 17.39, lng: 78.48, title: "Garbage", type: "warning", icon: "🗑️" },
    { lat: 17.382, lng: 78.492, title: "Street Light", type: "info", icon: "💡" },
  ];

  const features = [
    {
      icon: "📍",
      title: "GPS Location Detection",
      description: "Pinpoint exact issue location with precision GPS",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: "📸",
      title: "Photo Evidence",
      description: "Upload images to help authorities respond faster",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: "🔄",
      title: "Real-Time Tracking",
      description: "Track complaint progress with unique IDs",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: "🛡️",
      title: "Duplicate Detection",
      description: "Smart system prevents multiple reports",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: "🗺️",
      title: "Interactive Map",
      description: "Visualize issues across your city",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      icon: "⚡",
      title: "Instant Reporting",
      description: "Report problems in under 30 seconds",
      gradient: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          

          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Transform Your City
              </span>
              <br />
              <span className="text-gray-900 dark:text-white transition-colors duration-300">One Report at a Time</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto font-medium transition-colors duration-300">
              Join thousands of citizens making their neighborhoods better. 
              Report issues instantly, track progress, and celebrate solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/report"
                className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1.5 transition-all duration-300 flex items-center justify-center group"
              >
                <span>Report an Issue Now</span>
                <span className="ml-3 text-xl group-hover:translate-x-2 transition">→</span>
              </Link>
              <Link
                to="/track"
                className="px-10 py-5 bg-white dark:bg-slate-800 text-gray-800 dark:text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1.5 transition-all duration-300 border border-gray-200 dark:border-slate-700"
              >
                Track Complaint
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      
      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300">Powerful Features</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors duration-300">Everything you need to report and track civic issues</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              <div className="relative">
                <div className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed transition-colors duration-300">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Map Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-colors duration-300">
          <div className="p-8 border-b border-gray-100 dark:border-slate-700 transition-colors duration-300">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 transition-colors duration-300">Live Issue Map</h2>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">See what's happening in your neighborhood</p>
              </div>
              <div className="flex space-x-3 mt-4 md:mt-0">
                {issues.map((issue, idx) => (
                  <div key={idx} className="flex items-center space-x-1 text-sm">
                    <span>{issue.icon}</span>
                    <span className="text-gray-600 dark:text-gray-300 transition-colors duration-300">{issue.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="h-[400px] w-full">
            <MapContainer
              center={[17.385, 78.4867]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {issues.map((issue, i) => (
                <Marker key={i} position={[issue.lat, issue.lng]}>
                  <Popup>
                    <div className="text-center">
                      <div className="text-2xl mb-1">{issue.icon}</div>
                      <div className="font-semibold">{issue.title}</div>
                      <div className="text-xs text-gray-500 mt-1">Reported recently</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300">Simple 3-Step Process</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors duration-300">Get started in minutes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Report Issue", description: "Take a photo, describe the problem, and pin the location", icon: "📝" },
            { step: "02", title: "Smart Processing", description: "Our system verifies and assigns it to the right team", icon: "⚙️" },
            { step: "03", title: "Resolution", description: "Track progress and get notified when it's resolved", icon: "🎉" },
          ].map((item, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
              <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <div className="text-6xl font-bold text-gray-100 dark:text-slate-700 mb-4 transition-colors duration-300">{item.step}</div>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 transition-colors duration-300">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full opacity-10"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join the community of active citizens improving their neighborhoods every day.
          </p>
          <Link
            to="/report"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Report Your First Issue
            <span className="ml-2">→</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">🏛️</span>
                </div>
                <span className="text-xl font-black text-white tracking-tight">CivicFix</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                Empowering citizens to build better cities through transparent reporting and community collaboration.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Quick Access</h4>
              <ul className="space-y-4 text-sm">
                <li><Link to="/report" className="hover:text-white transition-colors">Report an Issue</Link></li>
                <li><Link to="/track" className="hover:text-white transition-colors">Track Complaint</Link></li>
                <li><Link to="/problems" className="hover:text-white transition-colors">Community Bulletin</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Admin</h4>
              <ul className="space-y-4 text-sm">
                <li><Link to="/admin/login" className="hover:text-white transition-colors">Administrator Login</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Employee Portal</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs">
              © 2026 CivicFix Platform. Government of the Community.
            </p>
            <div className="flex space-x-6 text-xs">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Add animation keyframes */}
      <style>{`
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