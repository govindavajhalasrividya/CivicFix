import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import { useLocation } from "../hooks/useLocation";
import { uploadToCloudinary } from "../services/cloudinaryUpload";

import { createComplaint, checkDuplicate } from "../api/complaintApi";


const INITIAL_FORM = {
  name: "",
  phone_number: "",
  email: "",
  category: "",
  description: "",
};

export default function ReportIssuePage() {

  const navigate = useNavigate();

  const { location, error: gpsError, loading: gpsLoading } = useLocation();

  const [form, setForm] = useState(INITIAL_FORM);
  const categories = [
  { id: "CAT_001", name: "Garbage" },
  { id: "CAT_002", name: "Broken Street Light" },
  { id: "CAT_003", name: "Pothole / Road Damage" },
  { id: "CAT_004", name: "Water Leakage" },
  { id: "CAT_005", name: "Traffic Issue" },
  { id: "CAT_006", name: "Public Toilet Problem" },
  { id: "CAT_007", name: "Safety Concern" },
  { id: "CAT_008", name: "Stray Animals" }
]

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [forceSubmit, setForceSubmit] = useState(false);

  // Load categories from backend


  const handleChange = (e) => {

    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");

  };

  const handleImageChange = async (e) => {

  const file = e.target.files[0]
  if (!file) return

  const allowed = ['image/jpeg', 'image/jpg', 'image/png']

  if (!allowed.includes(file.type)) {
    setError('Only JPG, JPEG, and PNG images are allowed.')
    return
  }

  setImageFile(file)

  const previewUrl = URL.createObjectURL(file)

  setImagePreview(previewUrl)

  // Use preview as uploaded image URL for demo
  setImageUrl(previewUrl)

  setError('')

}

  const validate = () => {

    if (!form.name.trim()) return "Name is required.";

    if (!/^\d{10}$/.test(form.phone_number))
      return "Phone number must be 10 digits.";

    if (!form.category)
      return "Please select a category.";

    if (!form.description.trim())
      return "Description is required.";

    if (!imageUrl)
      return "Please upload an image.";

    if (!location.latitude || !location.longitude)
      return "GPS location is required.";

    return null;

  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError("");

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    // Duplicate complaint detection
    if (!forceSubmit) {

      try {

        const dupRes = await checkDuplicate({
          category: form.category,
          latitude: location.latitude,
          longitude: location.longitude,
        });

        if (dupRes.data.duplicate_found) {

          setDuplicateWarning(dupRes.data.existing_complaints);
          return;

        }

      } catch {}

    }

    setSubmitting(true);

    try {

      const payload = {

        ...form,
        image_url: imageUrl,
        latitude: location.latitude,
        longitude: location.longitude,

      };

      const res = await createComplaint(payload);

      setSuccess(res.data.data);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Submission failed."
      );

    } finally {

      setSubmitting(false);

    }

  };

  // Success screen
  if (success) {

    return (

      <div className="max-w-lg mx-auto px-4 py-16 text-center">

        <h2 className="text-2xl font-bold">
          Complaint Submitted!
        </h2>

        <p className="text-gray-500 mt-2">
          Complaint ID: {success.complaint_id}
        </p>

        <button
          onClick={() => navigate("/track")}
          className="mt-4 bg-blue-600 text-white px-5 py-2 rounded"
        >
          Track Complaint
        </button>

      </div>

    );

  }

  return (

    <div className="max-w-lg mx-auto px-4 py-8">

      <h1 className="text-2xl font-bold mb-4">
        Report Civic Issue
      </h1>

      {/* LOCATION STATUS */}

      <div className="mb-4 text-sm">

        {gpsLoading ? (

          <span className="text-gray-400">
            Detecting location...
          </span>

        ) : gpsError ? (

          <span className="text-red-500">
            {gpsError}
          </span>

        ) : (

          <span className="text-green-600">
            Location detected
          </span>

        )}

      </div>

      {/* MAP */}

      {location.latitude && location.longitude && (

        <div className="mb-6">

          <MapContainer
            center={[location.latitude, location.longitude]}
            zoom={16}
            style={{ height: "250px", width: "100%" }}
          >

            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker
              position={[
                location.latitude,
                location.longitude,
              ]}
            >

              <Popup>
                Issue Location
              </Popup>

            </Marker>

          </MapContainer>

        </div>

      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* IMAGE */}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {imagePreview && (

          <img
            src={imagePreview}
            className="w-full h-48 object-cover rounded"
          />

        )}

        {/* CATEGORY */}

        {/* CATEGORY */}

<select
  name="category"
  value={form.category}
  onChange={handleChange}
  className="w-full border p-2 rounded"
>
  <option value="">Select category</option>

  {categories.map((c) => (
    <option key={c.id} value={c.id}>
      {c.name}
    </option>
  ))}
</select>


        {/* DESCRIPTION */}

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the issue"
          className="w-full border p-2 rounded"
        />

        {/* NAME */}

        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* PHONE */}

        <input
          type="tel"
          name="phone_number"
          placeholder="Phone number"
          value={form.phone_number}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* EMAIL */}

        <input
          type="email"
          name="email"
          placeholder="Email (optional)"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || uploading}
          className="w-full bg-blue-600 text-white py-3 rounded"
        >

          {submitting
            ? "Submitting..."
            : "Submit Complaint"}

        </button>

      </form>

    </div>

  );

}