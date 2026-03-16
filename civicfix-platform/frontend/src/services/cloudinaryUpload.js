import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../utils/constants'

/**
 * Uploads a file to Cloudinary using unsigned upload preset.
 * Returns the secure URL of the uploaded image.
 */
export async function uploadToCloudinary(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) throw new Error('Image upload failed')
  const data = await res.json()
  return data.secure_url
}
