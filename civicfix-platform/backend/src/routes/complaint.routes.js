const express = require('express');
const router = express.Router();
const {
  createComplaint,
  checkDuplicate,
  getMapComplaints,
  trackByPhone,
  getAllComplaints,
  getComplaintById,
  updateStatus,
  assignWorker,
  uploadResolution,
} = require('../controllers/complaint.controller');
const complaintRateLimiter = require('../middleware/rateLimiter');
const protect = require('../middleware/auth');

// ── Static paths first (must come before /:complaint_id) ──────────────────

// POST /api/v1/complaints/check-duplicate  — public
router.post('/check-duplicate', checkDuplicate);

// GET /api/v1/complaints/map  — public
router.get('/map', getMapComplaints);

// GET /api/v1/complaints/track/:phone_number  — public
router.get('/track/:phone_number', trackByPhone);

// ── Collection routes ──────────────────────────────────────────────────────

// GET  /api/v1/complaints  — public (admin uses filters)
router.get('/', getAllComplaints);

// POST /api/v1/complaints  — public, rate limited
router.post('/', complaintRateLimiter, createComplaint);

// ── Single resource routes ─────────────────────────────────────────────────

// GET /api/v1/complaints/:complaint_id  — public
router.get('/:complaint_id', getComplaintById);

// PUT /api/v1/complaints/:complaint_id/status  — admin only
router.put('/:complaint_id/status', protect, updateStatus);

// PUT /api/v1/complaints/:complaint_id/assign-worker  — admin only
router.put('/:complaint_id/assign-worker', protect, assignWorker);

// PUT /api/v1/complaints/:complaint_id/resolution  — admin only
router.put('/:complaint_id/resolution', protect, uploadResolution);

module.exports = router;
