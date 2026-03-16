import { useState, useEffect } from 'react'
import { getComplaints } from '../api/complaintApi'

export function useComplaints(params = {}) {
  const [complaints, setComplaints] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    getComplaints(params)
      .then((res) => {
        setComplaints(res.data.data.complaints)
        setTotal(res.data.data.total)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [JSON.stringify(params)])

  return { complaints, total, loading, error }
}
