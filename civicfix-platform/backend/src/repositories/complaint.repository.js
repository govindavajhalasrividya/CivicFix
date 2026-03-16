const Complaint = require('../models/complaint.model');

/**
 * Insert a new complaint document.
 */
const insertComplaint = async (data) => {
  const complaint = new Complaint(data);
  return complaint.save();
};

/**
 * Find complaints within a given radius (meters) of a point, filtered by category.
 * Uses MongoDB $geoNear aggregation to also return the distance.
 */
const findNearbyComplaints = async (longitude, latitude, radiusMeters, category) => {
  return Complaint.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [longitude, latitude] },
        distanceField: 'distance',
        maxDistance: radiusMeters,
        spherical: true,
        query: { category },
      },
    },
    {
      $project: {
        complaint_id: 1,
        category: 1,
        status: 1,
        distance: { $round: ['$distance', 0] },
      },
    },
  ]);
};

/**
 * Find a single complaint by its complaint_id string.
 */
const findComplaintById = async (complaint_id) => {
  return Complaint.findOne({ complaint_id });
};

/**
 * Find all complaints by phone number.
 */
const findComplaintsByPhone = async (phone_number) => {
  return Complaint.find({ phone_number }).sort({ created_at: -1 });
};

/**
 * Paginated list with optional status/category filters.
 */
const findComplaints = async ({ status, category, page = 1, limit = 10 }) => {
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;

  const skip = (page - 1) * limit;
  const [complaints, total] = await Promise.all([
    Complaint.find(filter).sort({ created_at: -1 }).skip(skip).limit(limit),
    Complaint.countDocuments(filter),
  ]);

  return { complaints, total };
};

/**
 * Lightweight projection for map view.
 */
const findComplaintsForMap = async () => {
  return Complaint.find(
    {},
    { complaint_id: 1, latitude: 1, longitude: 1, status: 1, category: 1, _id: 0 }
  );
};

/**
 * Update complaint status by complaint_id.
 */
const updateComplaintStatus = async (complaint_id, status) => {
  return Complaint.findOneAndUpdate(
    { complaint_id },
    { status },
    { new: true }
  );
};

/**
 * Assign a worker to a complaint.
 */
const assignWorkerToComplaint = async (complaint_id, worker_id) => {
  return Complaint.findOneAndUpdate(
    { complaint_id },
    { assigned_worker_id: worker_id },
    { new: true }
  );
};

/**
 * Store resolution image URL on a complaint.
 */
const setResolutionImage = async (complaint_id, resolution_image_url) => {
  return Complaint.findOneAndUpdate(
    { complaint_id },
    { resolution_image_url },
    { new: true }
  );
};

module.exports = {
  insertComplaint,
  findNearbyComplaints,
  findComplaintById,
  findComplaintsByPhone,
  findComplaints,
  findComplaintsForMap,
  updateComplaintStatus,
  assignWorkerToComplaint,
  setResolutionImage,
};
