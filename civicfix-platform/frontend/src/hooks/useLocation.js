import { useState, useEffect } from 'react'

export function useLocation() {
  const [location, setLocation] = useState({ latitude: null, longitude: null })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      setLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )
  }, [])

  return { location, error, loading }
}
