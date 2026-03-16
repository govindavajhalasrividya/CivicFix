// ReportIssuePage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom Location Marker component
function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position ? (
    <Marker position={position}>
      <Popup>Selected location for issue report</Popup>
    </Marker>
  ) : null;
}

// Custom hook for GPS location
const useLocation = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError('Unable to retrieve your location');
        setLoading(false);
      }
    );
  }, []);

  return { location, error, loading };
};

// Mock API functions
const createComplaint = (data) => {
  return Promise.resolve({
    data: {
      data: {
        complaint_id: 'CMP_' + Math.floor(Math.random() * 1000000),
        ...data
      }
    }
  });
};

const checkDuplicate = (data) => {
  return Promise.resolve({
    data: {
      duplicate_found: false,
      existing_complaints: []
    }
  });
};

const INITIAL_FORM = {
  name: "",
  phone_number: "",
  email: "",
  category: "",
  description: "",
};

export default function ReportIssuePage() {
  const navigate = useNavigate();
  const { location: gpsLocation, error: gpsError, loading: gpsLoading } = useLocation();
  
  const [form, setForm] = useState(INITIAL_FORM);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [forceSubmit, setForceSubmit] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);

  const categories = [
    { id: "CAT_001", name: "Garbage", icon: "🗑️", description: "Improper waste disposal or collection" },
    { id: "CAT_002", name: "Broken Street Light", icon: "💡", description: "Non-functional street lighting" },
    { id: "CAT_003", name: "Pothole / Road Damage", icon: "🕳️", description: "Damaged roads or potholes" },
    { id: "CAT_004", name: "Water Leakage", icon: "💧", description: "Pipe leakage or water wastage" },
    { id: "CAT_005", name: "Traffic Issue", icon: "🚦", description: "Signal problems or traffic congestion" },
    { id: "CAT_006", name: "Public Toilet Problem", icon: "🚽", description: "Maintenance or cleanliness issues" },
    { id: "CAT_007", name: "Safety Concern", icon: "⚠️", description: "Security or hazard concerns" },
    { id: "CAT_008", name: "Stray Animals", icon: "🐕", description: "Stray animal issues" }
  ];

  // Update location when GPS loads
  useEffect(() => {
    if (gpsLocation.latitude && gpsLocation.longitude) {
      setSelectedLocation({
        lat: gpsLocation.latitude,
        lng: gpsLocation.longitude
      });
    }
  }, [gpsLocation]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowed.includes(file.type)) {
      setError('Only JPG, JPEG, and PNG images are allowed.');
      return;
    }

    if (file.size > maxSize) {
      setError('Image size should be less than 5MB.');
      return;
    }

    setImageFile(file);
    setUploading(true);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploading(false);
        
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        setImageUrl(previewUrl);
      }
    }, 200);
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required.";
    if (!/^\d{10}$/.test(form.phone_number)) return "Phone number must be 10 digits.";
    if (!form.category) return "Please select a category.";
    if (!form.description.trim()) return "Description is required.";
    if (!imageUrl) return "Please upload an image.";
    if (!selectedLocation) return "Please select a location on the map.";
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
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
        });

        if (dupRes.data.duplicate_found) {
          setDuplicateWarning(dupRes.data.existing_complaints);
          return;
        }
      } catch (err) {
        console.error("Duplicate check failed:", err);
      }
    }

    setSubmitting(true);

    try {
      const payload = {
        ...form,
        image_url: imageUrl,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        reported_at: new Date().toISOString()
      };

      const res = await createComplaint(payload);
      setSuccess(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !selectedLocation) {
      setError("Please select a location on the map");
      return;
    }
    if (currentStep === 2 && !imageUrl) {
      setError("Please upload an image");
      return;
    }
    setError("");
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
            
            {/* Success animation */}
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center animate-bounce">
              <span className="text-white text-5xl">✓</span>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">Your complaint has been submitted successfully</p>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
              <p className="text-sm text-gray-500 mb-2">Complaint ID</p>
              <p className="text-2xl font-mono font-bold text-green-600 mb-2">{success.complaint_id}</p>
              <p className="text-xs text-gray-400">Save this ID to track your complaint</p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/track?id=${success.complaint_id}`)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Track Complaint
              </button>
              <button
                onClick={() => {
                  setSuccess(null);
                  setForm(INITIAL_FORM);
                  setImagePreview(null);
                  setImageUrl("");
                  setCurrentStep(1);
                }}
                className="w-full bg-white text-gray-700 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:border-green-500 hover:text-green-600 transition-all duration-300"
              >
                Report Another Issue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Duplicate warning screen
  if (duplicateWarning) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl">⚠️</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Duplicate Detected</h2>
            <p className="text-gray-600 mb-6">
              A similar complaint has already been reported in this location
            </p>
            
            <div className="bg-yellow-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-yellow-800 mb-2">Existing complaints:</p>
              {duplicateWarning.map((dup, idx) => (
                <div key={idx} className="text-xs text-gray-600 py-1">
                  • {dup.complaint_id} - {dup.status}
                </div>
              ))}
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => setDuplicateWarning(null)}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                View Existing Reports
              </button>
              <button
                onClick={() => {
                  setDuplicateWarning(null);
                  setForceSubmit(true);
                  handleSubmit(new Event('submit'));
                }}
                className="w-full bg-white text-gray-700 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:border-yellow-500 hover:text-yellow-600 transition-all duration-300"
              >
                Report Anyway
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <span className="text-white text-3xl">📝</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Report an Issue</h1>
          <p className="text-gray-600">Help us make your city better by reporting civic problems</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    currentStep >= step 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step ? '✓' : step}
                  </div>
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                    currentStep > step ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>Location</span>
            <span>Evidence</span>
            <span>Details</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Location Selection */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">1</span>
                Select Issue Location
              </h2>

              {/* Location Status */}
              <div className="flex items-center space-x-2 text-sm">
                {gpsLoading ? (
                  <div className="flex items-center text-gray-400">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Detecting your location...
                  </div>
                ) : gpsError ? (
                  <div className="flex items-center text-yellow-600">
                    <span className="mr-2">⚠️</span>
                    {gpsError} - You can manually select a location
                  </div>
                ) : (
                  <div className="flex items-center text-green-600">
                    <span className="mr-2">📍</span>
                    Location detected! Click on map to adjust if needed
                  </div>
                )}
              </div>

              {/* Map */}
              <div className="rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
                <MapContainer
                  center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : [20.5937, 78.9629]}
                  zoom={13}
                  style={{ height: "400px", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker position={selectedLocation} setPosition={setSelectedLocation} />
                </MapContainer>
              </div>

              {selectedLocation && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800 mb-2">Selected Coordinates:</p>
                  <div className="flex space-x-4">
                    <code className="text-xs bg-white px-2 py-1 rounded">Lat: {selectedLocation.lat.toFixed(6)}</code>
                    <code className="text-xs bg-white px-2 py-1 rounded">Lng: {selectedLocation.lng.toFixed(6)}</code>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!selectedLocation}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    selectedLocation
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Continue to Evidence →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Image Upload */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">2</span>
                Upload Evidence
              </h2>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors duration-300">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                
                {!imagePreview ? (
                  <label htmlFor="image-upload" className="cursor-pointer block">
                    <div className="text-5xl mb-4">📸</div>
                    <p className="text-gray-700 font-medium mb-2">Click to upload a photo</p>
                    <p className="text-sm text-gray-500">JPG, JPEG, or PNG up to 5MB</p>
                  </label>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden">
                      <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImageUrl("");
                          setImageFile(null);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                      >
                        ✕
                      </button>
                    </div>
                    
                    {uploading && (
                      <div className="space-y-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-500">Uploading: {uploadProgress}%</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!imageUrl || uploading}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    imageUrl && !uploading
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Continue to Details →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Details Form */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">3</span>
                Issue Details
              </h2>

              <div className="space-y-4">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {categories.map((cat) => (
                      <label
                        key={cat.id}
                        className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          form.category === cat.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={cat.id}
                          checked={form.category === cat.id}
                          onChange={handleChange}
                          className="hidden"
                        />
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{cat.icon}</span>
                          <div>
                            <p className="font-medium text-gray-800">{cat.name}</p>
                            <p className="text-xs text-gray-500">{cat.description}</p>
                          </div>
                        </div>
                        {form.category === cat.id && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe the issue in detail..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  ></textarea>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={form.phone_number}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold transition-all duration-300 ${
                      submitting 
                        ? 'opacity-75 cursor-not-allowed' 
                        : 'hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                  >
                    {submitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      'Submit Complaint'
                    )}
                  </button>
                </div>

                {/* Terms */}
                <p className="text-xs text-gray-400 text-center pt-4">
                  By submitting, you agree that the information provided is accurate to the best of your knowledge.
                </p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}