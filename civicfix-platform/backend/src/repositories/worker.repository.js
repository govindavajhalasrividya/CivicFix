const Worker = require('../models/worker.model');

const insertWorker = async (data) => {
  const worker = new Worker(data);
  return worker.save();
};

const findAllWorkers = async () => {
  return Worker.find({}, { _id: 0, worker_id: 1, name: 1, phone_number: 1, department: 1 });
};

const findWorkerById = async (worker_id) => {
  return Worker.findOne({ worker_id });
};

module.exports = { insertWorker, findAllWorkers, findWorkerById };
