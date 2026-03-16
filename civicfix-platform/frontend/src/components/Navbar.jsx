import { Link } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'

export default function Navbar() {
  const { isAdmin, logout } = useAdmin()

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex items-center justify-between shadow">
      <Link to="/" className="text-xl font-bold tracking-tight">CivicFix</Link>
      <div className="flex gap-4 text-sm">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/report" className="hover:underline">Report Issue</Link>
        <Link to="/track" className="hover:underline">Track</Link>
        {isAdmin ? (
          <>
            <Link to="/admin" className="hover:underline">Dashboard</Link>
            <button onClick={logout} className="hover:underline">Logout</button>
          </>
        ) : (
          <Link to="/admin/login" className="hover:underline">Admin</Link>
        )}
      </div>
    </nav>
  )
}
