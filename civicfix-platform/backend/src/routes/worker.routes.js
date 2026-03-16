const express = require('express');
const router = express.Router();
const { createWorker, getWorkers } = require('../controllers/worker.controller');
const protect = require('../middleware/auth');

// GET  /api/v1/workers  — admin only
router.get('/', protect, getWorkers);

// POST /api/v1/workers  — admin only
router.post('/', protect, createWorker);

module.exports = router;
