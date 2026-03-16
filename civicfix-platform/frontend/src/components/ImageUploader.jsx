import { useState } from 'react'
import { uploadToCloudinary } from '../services/cloudinaryUpload'

export default function ImageUploader({ onUpload }) {
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const handleFile = async (file) => {
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    setError(null)
    try {
      const url = await uploadToCloudinary(file)
      onUpload(url)
    } catch (e) {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Issue Image *</label>
      <input
        type="file"
        accept="image/jpg,image/jpeg,image/png"
        onChange={(e) => handleFile(e.target.files[0])}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {uploading && <p className="text-sm text-blue-500">Uploading image...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {preview && !uploading && (
        <img src={preview} alt="preview" className="mt-2 w-40 h-40 object-cover rounded-lg border" />
      )}
    </div>
  )
}
