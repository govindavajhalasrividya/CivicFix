/**
 * Sends a standardised success response matching the PRD contract.
 */
const successResponse = (res, message, data = null, statusCode = 200) => {
  const body = { success: true, message };
  if (data !== null) body.data = data;
  return res.status(statusCode).json(body);
};

/**
 * Sends a standardised error response matching the PRD contract.
 */
const errorResponse = (res, message, errorCode = 'ERROR', statusCode = 400) => {
  return res.status(statusCode).json({ success: false, message, error_code: errorCode });
};

module.exports = { successResponse, errorResponse };
