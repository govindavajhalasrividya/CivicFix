// Navbar.jsx
import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAdmin } from '../context/AdminContext'

export default function Navbar() {
  const { isAdmin, logout } = useAdmin()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsProfileMenuOpen(false)
  }, [location])

  const navLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/problems', label: 'See Problems', icon: '💡' },
    { path: '/report', label: 'Report Issue', icon: '📝' },
    { path: '/track', label: 'Track', icon: '🔍' },
  ]

  const isActivePath = (path) => {
    if (path === '/' && location.pathname !== '/') return false
    return location.pathname.startsWith(path)
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-lg py-2' 
          : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="group flex items-center space-x-2"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-300 ${
                isScrolled 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md' 
                  : 'bg-white/20 backdrop-blur'
              }`}>
                <span className="text-white text-xl">🏛️</span>
              </div>
              <div>
                <span className={`font-black text-xl tracking-tight transition-colors duration-300 ${
                  isScrolled ? 'text-gray-900' : 'text-white'
                }`}>
                  CivicFix
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 group ${
                    isScrolled 
                      ? isActivePath(link.path)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      : isActivePath(link.path)
                        ? 'text-white bg-white/20'
                        : 'text-white hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.label}</span>
                  </span>
                  {isActivePath(link.path) && (
                    <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                      isScrolled ? 'bg-blue-600' : 'bg-white'
                    }`}></span>
                  )}
                </Link>
              ))}
            </div>

            {/* Right Side - Admin & Profile */}
            <div className="hidden md:flex items-center space-x-3">
              {isAdmin ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                      isScrolled 
                        ? 'hover:bg-gray-100' 
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isScrolled 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                        : 'bg-white/20'
                    }`}>
                      <span className="text-white text-sm">👤</span>
                    </div>
                    <span className={`text-sm font-medium ${
                      isScrolled ? 'text-gray-700' : 'text-white'
                    }`}>
                      Admin
                    </span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isProfileMenuOpen ? 'rotate-180' : ''
                      } ${isScrolled ? 'text-gray-500' : 'text-white/70'}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 border border-gray-100 transform origin-top-right animate-fadeIn">
                      <Link
                        to="/admin"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <span className="text-xl">📊</span>
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/admin/settings"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <span className="text-xl">⚙️</span>
                        <span>Settings</span>
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => {
                          logout()
                          setIsProfileMenuOpen(false)
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <span className="text-xl">🚪</span>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/admin/login"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isScrolled
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                      : 'bg-white/20 backdrop-blur text-white hover:bg-white/30'
                  }`}
                >
                  <span className="text-lg">🔐</span>
                  <span>Admin Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
                isScrolled 
                  ? 'hover:bg-gray-100' 
                  : 'hover:bg-white/10'
              }`}
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span className={`w-full h-0.5 rounded-full transition-all duration-300 ${
                  isScrolled ? 'bg-gray-600' : 'bg-white'
                } ${isMobileMenuOpen ? 'transform rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-full h-0.5 rounded-full transition-all duration-300 ${
                  isScrolled ? 'bg-gray-600' : 'bg-white'
                } ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-full h-0.5 rounded-full transition-all duration-300 ${
                  isScrolled ? 'bg-gray-600' : 'bg-white'
                } ${isMobileMenuOpen ? 'transform -rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute left-0 right-0 transition-all duration-500 ease-in-out ${
          isMobileMenuOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}>
          <div className={`mx-4 mt-2 rounded-2xl shadow-2xl overflow-hidden ${
            isScrolled ? 'bg-white' : 'bg-white/95 backdrop-blur-md'
          }`}>
            <div className="py-2">
              {/* Mobile Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-3 px-6 py-4 text-base transition-colors duration-200 ${
                    isActivePath(link.path)
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                  {isActivePath(link.path) && (
                    <span className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></span>
                  )}
                </Link>
              ))}

              {/* Divider */}
              <div className="border-t border-gray-100 my-2"></div>

              {/* Mobile Admin Section */}
              {isAdmin ? (
                <>
                  <Link
                    to="/admin"
                    className="flex items-center space-x-3 px-6 py-4 text-base text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="text-2xl">📊</span>
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="flex items-center space-x-3 px-6 py-4 text-base text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="text-2xl">⚙️</span>
                    <span className="font-medium">Settings</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-6 py-4 text-base text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <span className="text-2xl">🚪</span>
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/admin/login"
                  className="flex items-center space-x-3 px-6 py-4 text-base text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                >
                  <span className="text-2xl">🔐</span>
                  <span className="font-medium">Admin Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Footer */}
            <div className="bg-gray-50 px-6 py-4">
              <p className="text-xs text-gray-500 text-center">
                CivicFix v1.0 • Making cities better
              </p>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  )
}