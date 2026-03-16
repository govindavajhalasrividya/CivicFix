export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'

export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ''
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ''

export const STATUS_COLORS = {
  'Reported': 'red',
  'Under Review': 'orange',
  'In Progress': 'yellow',
  'Resolved': 'green',
}

export const COMPLAINT_STATUSES = ['Reported', 'Under Review', 'In Progress', 'Resolved']
