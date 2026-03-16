/**
 * Validates a 10-digit phone number.
 */
const isValidPhone = (phone) => /^\d{10}$/.test(phone);

/**
 * Validates an email address (optional field).
 */
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * Validates latitude is within -90 to 90.
 */
const isValidLatitude = (lat) => typeof lat === 'number' && lat >= -90 && lat <= 90;

/**
 * Validates longitude is within -180 to 180.
 */
const isValidLongitude = (lng) => typeof lng === 'number' && lng >= -180 && lng <= 180;

module.exports = { isValidPhone, isValidEmail, isValidLatitude, isValidLongitude };
