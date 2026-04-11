const repo = require('../repositories/complaint.repository');
const { generateComplaintId } = require('../utils/idGenerator');
const { isValidPhone, isValidEmail, isValidLatitude, isValidLongitude } = require('../utils/validators');

const DUPLICATE_RADIUS_METERS = 100;
const VALID_STATUSES = ['Reported', 'Under Review', 'In Progress', 'Resolved'];

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const validateCreatePayload = ({
  name, phone_number, email, category,
  description, image_url, latitude, longitude,
}) => {
  if (!name || !name.trim()) return 'Name is required.';
  if (!phone_number) return 'Phone number is required.';
  if (!isValidPhone(phone_number)) return 'Phone number must be 10 digits.';
  if (email && !isValidEmail(email)) return 'Invalid email address.';
  if (!category || !category.trim()) return 'Category is required.';
  if (!description || !description.trim()) return 'Description is required.';
  if (!image_url || !image_url.trim()) return 'Image URL is required.';
  if (latitude === undefined || latitude === null) return 'Latitude is required.';
  if (longitude === undefined || longitude === null) return 'Longitude is required.';
  if (!isValidLatitude(latitude)) return 'Latitude must be between -90 and 90.';
  if (!isValidLongitude(longitude)) return 'Longitude must be between -180 and 180.';
  return null;
};

const makeError = (message, code, status) => {
  const err = new Error(message);
  err.code = code;
  err.status = status;
  return err;
};

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

const createComplaint = async (payload) => {
  const validationError = validateCreatePayload(payload);
  if (validationError) throw makeError(validationError, 'INVALID_REQUEST', 400);

  const { name, phone_number, email, category, description, address, image_url, latitude, longitude } = payload;

  // Generate unique complaint_id (retry on collision)
  let complaint_id;
  let attempts = 0;
  do {
    complaint_id = generateComplaintId();
    const existing = await repo.findComplaintById(complaint_id);
    if (!existing) break;
    attempts++;
  } while (attempts < 5);

  const complaint = await repo.insertComplaint({
    complaint_id,
    name: name.trim(),
    phone_number,
    email: email || null,
    category,
    description: description.trim(),
    address: address ? address.trim() : null,
    image_url,
    latitude,
    longitude,
    location: { type: 'Point', coordinates: [longitude, latitude] },
    status: 'Reported',
  });

  return { complaint_id: complaint.complaint_id, status: complaint.status };
};

const checkDuplicate = async ({ category, latitude, longitude }) => {
  if (!category || latitude === undefined || longitude === undefined) {
    throw makeError('category, latitude, and longitude are required.', 'INVALID_REQUEST', 400);
  }

  const nearby = await repo.findNearbyComplaints(longitude, latitude, DUPLICATE_RADIUS_METERS, category);

  if (nearby.length === 0) return { duplicate_found: false };

  return {
    duplicate_found: true,
    existing_complaints: nearby.map((c) => ({
      complaint_id: c.complaint_id,
      category: c.category,
      status: c.status,
      distance: c.distance,
    })),
  };
};

const getComplaintById = async (complaint_id) => {
  const complaint = await repo.findComplaintById(complaint_id);
  if (!complaint) throw makeError('Complaint not found.', 'COMPLAINT_NOT_FOUND', 404);
  return complaint;
};

const trackByPhone = async (phone_number) => {
  if (!phone_number) throw makeError('Phone number is required.', 'INVALID_REQUEST', 400);
  return repo.findComplaintsByPhone(phone_number);
};

const getAllComplaints = async ({ status, category, page, limit }) => {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
  return repo.findComplaints({ status, category, page: pageNum, limit: limitNum });
};

const getComplaintsForMap = async () => {
  return repo.findComplaintsForMap();
};

const updateStatus = async (complaint_id, status) => {
  if (!VALID_STATUSES.includes(status)) {
    throw makeError(`Invalid status. Allowed: ${VALID_STATUSES.join(', ')}`, 'INVALID_REQUEST', 400);
  }
  const updated = await repo.updateComplaintStatus(complaint_id, status);
  if (!updated) throw makeError('Complaint not found.', 'COMPLAINT_NOT_FOUND', 404);
  return updated;
};

const assignWorker = async (complaint_id, worker_id) => {
  if (!worker_id) throw makeError('worker_id is required.', 'INVALID_REQUEST', 400);
  const updated = await repo.assignWorkerToComplaint(complaint_id, worker_id);
  if (!updated) throw makeError('Complaint not found.', 'COMPLAINT_NOT_FOUND', 404);
  return updated;
};

const uploadResolution = async (complaint_id, resolution_image_url) => {
  if (!resolution_image_url) throw makeError('resolution_image_url is required.', 'INVALID_REQUEST', 400);
  const updated = await repo.setResolutionImage(complaint_id, resolution_image_url);
  if (!updated) throw makeError('Complaint not found.', 'COMPLAINT_NOT_FOUND', 404);
  return updated;
};

const upvoteComplaint = async (complaint_id) => {
  const updated = await repo.upvoteComplaint(complaint_id);
  if (!updated) throw makeError('Complaint not found.', 'COMPLAINT_NOT_FOUND', 404);
  return updated;
};

const addComment = async (complaint_id, { text, user_name }) => {
  if (!text || !text.trim()) throw makeError('Comment text is required.', 'INVALID_REQUEST', 400);
  const updated = await repo.addCommentToComplaint(complaint_id, {
    text: text.trim(),
    user_name: user_name || 'Anonymous',
  });
  if (!updated) throw makeError('Complaint not found.', 'COMPLAINT_NOT_FOUND', 404);
  return updated;
};

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  createComplaint,
  checkDuplicate,
  getComplaintById,
  trackByPhone,
  getAllComplaints,
  getComplaintsForMap,
  updateStatus,
  assignWorker,
  uploadResolution,
  upvoteComplaint,
  addComment,
};
