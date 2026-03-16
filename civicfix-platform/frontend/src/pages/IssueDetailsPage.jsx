import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getComplaintById } from '../api/complaintApi'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatDate } from '../utils/helpers'

export default function IssueDetailsPage() {
  const { id } = useParams()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getComplaintById(id)
      .then((res) => setComplaint(res.data.data))
      .catch(() => setError('Complaint not found.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner />

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-red-500 text-lg">{error}</p>
        <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline text-sm">← Back to Home</Link>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-5">
      <Link to="/" className="text-sm text-blue-600 hover:underline">← Back</Link>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-bold text-gray-800">{complaint.category}</h1>
        <StatusBadge status={complaint.status} />
      </div>

      {complaint.image_url && (
        <img
          src={complaint.image_url}
          alt="Issue"
          className="w-full h-56 object-cover rounded-xl border"
        />
      )}

      <div className="bg-white rounded-xl shadow p-4 space-y-3 text-sm">
        <Row label="Complaint ID" value={complaint.complaint_id} mono />
        <Row label="Description" value={complaint.description} />
        <Row label="Reported by" value={complaint.name} />
        <Row label="Phone" value={complaint.phone_number} />
        <Row label="Location" value={`${complaint.latitude}, ${complaint.longitude}`} />
        <Row label="Reported on" value={formatDate(complaint.created_at)} />
        {complaint.assigned_worker_id && (
          <Row label="Assigned Worker" value={complaint.assigned_worker_id} />
        )}
      </div>

      {complaint.resolution_image_url && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Resolution Photo</p>
          <img
            src={complaint.resolution_image_url}
            alt="Resolution"
            className="w-full h-48 object-cover rounded-xl border"
          />
        </div>
      )}
    </div>
  )
}

function Row({ label, value, mono }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className={`text-gray-800 text-right ${mono ? 'font-mono font-semibold text-blue-700' : ''}`}>{value}</span>
    </div>
  )
}
