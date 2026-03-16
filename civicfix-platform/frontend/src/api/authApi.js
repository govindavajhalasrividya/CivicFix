import axiosClient from './axiosClient'

export const adminLogin = (data) => axiosClient.post('/admin/login', data)
