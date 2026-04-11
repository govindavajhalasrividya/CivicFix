const complaintService = require('../services/complaint.service');
const { successResponse, errorResponse } = require('../utils/response');

// POST /api/v1/complaints
const createComplaint = async (req, res) => {
  try {
    const result = await complaintService.createComplaint(req.body);
    return successResponse(res, 'Complaint submitted successfully', result, 201);
  } catch (err) {
    return errorResponse(res, err.message, err.code || 'ERROR', err.status || 500);
  }
};

// POST /api/v1/complaints/check-duplicate
const checkDuplicate = async (req, res) => {
  try {
    const result = await complaintService.checkDuplicate(req.body);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return errorResponse(res, err.message, err.code || 'ERROR', err.status || 500);
  }
};

// GET /api/v1/complaints/map  — must be fetched before /:complaint_id
const getMapComplaints = async (req, res) => {
  try {
    const data = await complaintService.getComplaintsForMap();
    return successResponse(res, 'Map complaints fetched', data);
  } catch (err) {
    return errorResponse(res, err.message, err.code || 'ERROR', err.status || 500);
  }
};

// GET /api/v1/complaints/track/:phone_number — must be before /:complaint_id
const trackByPhone = async (req, res) => {
  try {
    const data = await complaintService.trackByPhone(req.params.phone_number);
    return successResponse(res, 'Complaints fetched', data);
  } catch (err) {
    return errorResponse(res, err.message, err.code || 'ERROR', err.status || 500);
  }
};

// GET /api/v1/complaints
const getAllComplaints = async (req, res) => {
  try {
    const { status, category, page, limit } = req.query;
    const result = await complaintService.getAllComplaints({ status, category, page, limit });
    return successResponse(res, 'Complaints fetched', {
      total: result.total,
      page: parseInt(page) || 1,
      complaints: result.complaints,
    });
  } catch (err) {
    return errorResponse(res, err.message, err.code || 'ERROR', err.status || 500);
  }
};

// GET /api/v1/complaints/:complaint_id
const getComplaintById = async (req, res) => {
  try {
    const data = await complaintService.getComplaintById(req.params.complaint_id);
    return successResponse(res, 'Complaint fetched', data);
  } catch (err) {
    return errorResponse(res, err.message, err.code || 'ERROR', err.status || 500);
  }
};

// PUT /api/v1/complaints/:complaint_id/status
const updateStatus = async (req, res) => {
  try {
    await complaintService.updateStatus(req.params.complaint_id, req.body.status);
    return successResponse(res, 'Status updated');
  } catch (err) {
    return errorResponse(res, err.message, err.code || 'ERROR', err.status || 500);
  }
};

// PUT /api/v1/complaints/:complaint_id/assign-worker
const assignWorker = async (req, res) => {
  try {
    await complaintService.assignWorker(req.params.complaint_id, req.body.worker_id);
    return successResponse(res, 'Worker assigned successfully');
  } catch (err) {
    return errorResponse(res, err.message, err.code || 'ERROR', err.status || 500);
  }
};

// PUT /api/v1/complaints/:complaint_id/resolution
const uploadResolution = async (req, res) => {
  try {
    await complaintService.uploadResolution(req.params.complaint_id, req.body.resolution_image_url);
    return successResponse(res, 'Resolution image uploaded');
  } catch (err) {
    return errorResponse(res, err.message, err.code || 'ERROR', err.status || 500);
  }
};

// POST /api/v1/complaints/:complaint_id/upvote
const upvoteComplaint = async (req, res) => {
  try {
    const data = await complaintService.upvoteComplaint(req.params.complaint_id);
    return successResponse(res, 'Complaint upvoted', data);
  } catch (err) {
    return errorResponse(res, err.message, err.code || 'ERROR', err.status || 500);
  }
};

// POST /api/v1/complaints/:complaint_id/comment
const addComment = async (req, res) => {
  try {
    const data = await complaintService.addComment(req.params.complaint_id, req.body);
    return successResponse(res, 'Comment added', data);
  } catch (err) {
    return errorResponse(res, err.message, err.code || 'ERROR', err.status || 500);
  }
};

module.exports = {
  createComplaint,
  checkDuplicate,
  getMapComplaints,
  trackByPhone,
  getAllComplaints,
  getComplaintById,
  updateStatus,
  assignWorker,
  uploadResolution,
  upvoteComplaint,
  addComment,
};
