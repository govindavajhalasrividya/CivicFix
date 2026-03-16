import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import { formatDate } from '../utils/helpers'

export default function IssueCard({ complaint }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex gap-4">
      {complaint.image_url && (
        <img src={complaint.image_url} alt="issue" className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="font-semibold text-gray-800 truncate">{complaint.category}</span>
          <StatusBadge status={complaint.status} />
        </div>
        <p className="text-sm text-gray-500 mt-1 truncate">{complaint.description}</p>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
          <span>{formatDate(complaint.created_at)}</span>
          <Link to={`/issue/${complaint.complaint_id}`} className="text-blue-600 hover:underline">
            View Details →
          </Link>
        </div>
      </div>
    </div>
  )
}
