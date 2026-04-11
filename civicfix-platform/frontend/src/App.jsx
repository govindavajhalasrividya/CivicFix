import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AdminProvider } from './context/AdminContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ReportIssuePage from './pages/ReportIssuePage'
import IssueDetailsPage from './pages/IssueDetailsPage'
import TrackComplaintPage from './pages/TrackComplaintPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboard from './pages/AdminDashboard'
import SeeProblemsPage from './pages/SeeProblemsPage'
import NotFoundPage from './pages/NotFoundPage'
import { Toaster } from 'react-hot-toast'

export default function App() {
  return (
    <ThemeProvider>
      <AdminProvider>
      <Toaster position="top-right" toastOptions={{
        duration: 4000,
        style: {
          background: '#333',
          color: '#fff',
        },
      }}/>
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
            <Route path="/problems" element={<SeeProblemsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </BrowserRouter>
      </AdminProvider>
    </ThemeProvider>
  )
}
