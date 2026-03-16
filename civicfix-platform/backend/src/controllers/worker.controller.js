const workerService = require('../services/worker.service');
const { successResponse, errorResponse } = require('../utils/response');

// POST /api/v1/workers
const createWorker = async (req, res) => {
  try {
    const result = await workerService.createWorker(req.body);
    return successResponse(res, 'Worker created successfully', result, 201);
  } catch (err) {
    return errorResponse(res, err.message, err.code || 'ERROR', err.status || 500);
  }
};

// GET /api/v1/workers
const getWorkers = async (req, res) => {
  try {
    const data = await workerService.getAllWorkers();
    return successResponse(res, 'Workers fetched', data);
  } catch (err) {
    return errorResponse(res, err.message, err.code || 'ERROR', err.status || 500);
  }
};

module.exports = { createWorker, getWorkers };
