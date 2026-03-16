import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AdminProvider } from './context/AdminContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ReportIssuePage from './pages/ReportIssuePage'
import IssueDetailsPage from './pages/IssueDetailsPage'
import TrackComplaintPage from './pages/TrackComplaintPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/report" element={<ReportIssuePage />} />
            <Route path="/issue/:id" element={<IssueDetailsPage />} />
            <Route path="/track" element={<TrackComplaintPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AdminProvider>
  )
}
