import axiosClient from './axiosClient'

export const getCategories = () => axiosClient.get('/api/v1/categories')