export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export const statusColor = (status) => {
  const map = {
    'Reported': 'bg-red-100 text-red-700',
    'Under Review': 'bg-orange-100 text-orange-700',
    'In Progress': 'bg-yellow-100 text-yellow-700',
    'Resolved': 'bg-green-100 text-green-700',
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}
