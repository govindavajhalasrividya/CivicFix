import axiosClient from './axiosClient'

export const getWorkers = () => axiosClient.get('/workers')
export const createWorker = (data) => axiosClient.post('/workers', data)
