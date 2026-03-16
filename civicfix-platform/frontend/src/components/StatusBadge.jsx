import { statusColor } from '../utils/helpers'

export default function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(status)}`}>
      {status}
    </span>
  )
}
