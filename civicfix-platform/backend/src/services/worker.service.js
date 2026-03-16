const repo = require('../repositories/worker.repository');
const { generateWorkerId } = require('../utils/idGenerator');
const { isValidPhone } = require('../utils/validators');

const createWorker = async ({ name, phone_number, department }) => {
  if (!name || !name.trim()) {
    const err = new Error('Name is required.'); err.code = 'INVALID_REQUEST'; err.status = 400; throw err;
  }
  if (!phone_number || !isValidPhone(phone_number)) {
    const err = new Error('A valid 10-digit phone number is required.'); err.code = 'INVALID_REQUEST'; err.status = 400; throw err;
  }
  if (!department || !department.trim()) {
    const err = new Error('Department is required.'); err.code = 'INVALID_REQUEST'; err.status = 400; throw err;
  }

  // Generate unique worker_id
  let worker_id;
  let attempts = 0;
  do {
    worker_id = generateWorkerId();
    const existing = await repo.findWorkerById(worker_id);
    if (!existing) break;
    attempts++;
  } while (attempts < 5);

  const worker = await repo.insertWorker({
    worker_id,
    name: name.trim(),
    phone_number,
    department: department.trim(),
  });

  return { worker_id: worker.worker_id };
};

const getAllWorkers = async () => {
  return repo.findAllWorkers();
};

module.exports = { createWorker, getAllWorkers };
