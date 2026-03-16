import { useState } from 'react'
import { Link } from 'react-router-dom'
import { trackByPhone, getComplaintById } from '../api/complaintApi'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatDate } from '../utils/helpers'

export default function TrackComplaintPage() {
  const [mode, setMode] = useState('phone') // 'phone' | 'id'
  const [input, setInput] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!input.trim()) { setError('Please enter a value.'); return }
    setError('')
    setResults(null)
    setLoading(true)

    try {
      if (mode === 'phone') {
        const res = await trackByPhone(input.trim())
        setResults(res.data.data)
      } else {
        const res = await getComplaintById(input.trim())
        setResults([res.data.data])
      }
    } catch {
      setError('No complaints found.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Track Your Complaint</h1>

      {/* Mode toggle */}
      <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
        <button
          onClick={() => { setMode('phone'); setResults(null); setInput('') }}
          className={`flex-1 py-2 font-medium transition ${mode === 'phone' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
        >
          By Phone Number
        </button>
        <button
          onClick={() => { setMode('id'); setResults(null); setInput('') }}
          className={`flex-1 py-2 font-medium 
transition ${mode === 'id' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
        >
          By Complaint ID
        </button>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError('') }}
          placeholder={mode === 'phone' ? 'Enter 10-digit phone number' : 'Enter Complaint ID (e.g. CMP_874123)'}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {loading && <LoadingSpinner />}

      {/* Results */}
      {results && results.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-6">No complaints found.</p>
      )}

      {results && results.length > 0 && (
        <div className="space-y-3">
          {results.map((c) => (
            <div key={c.complaint_id} className="bg-white rounded-xl shadow p-4 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-mono text-sm font-bold text-blue-700">{c.complaint_id}</span>
                <StatusBadge status={c.status} />
              </div>
              <p className="text-sm font-medium text-gray-700">{c.category}</p>
              {c.description && <p className="text-sm text-gray-500 truncate">{c.description}</p>}
              <p className="text-xs text-gray-400">Reported: {formatDate(c.created_at)}</p>
              <Link
                to={`/issue/${c.complaint_id}`}
                className="text-xs text-blue-600 hover:underline"
              >
                View full details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
