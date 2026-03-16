import axiosClient from './axiosClient'

export const createComplaint = (data) => axiosClient.post('/complaints', data)
export const checkDuplicate = (data) => axiosClient.post('/complaints/check-duplicate', data)
export const getComplaints = (params) => axiosClient.get('/complaints', { params })
export const getComplaintById = (id) => axiosClient.get(`/complaints/${id}`)
export const getMapComplaints = () => axiosClient.get('/complaints/map')
export const trackByPhone = (phone) => axiosClient.get(`/complaints/track/${phone}`)
export const updateStatus = (id, status) => axiosClient.put(`/complaints/${id}/status`, { status })
export const assignWorker = (id, worker_id) => axiosClient.put(`/complaints/${id}/assign-worker`, { worker_id })
export const uploadResolution = (id, resolution_image_url) =>
  axiosClient.put(`/complaints/${id}/resolution`, { resolution_image_url })
