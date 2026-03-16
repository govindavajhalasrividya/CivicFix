/**
 * In-memory rate limiter.
 * PRD rule: max 5 complaints per phone number per hour.
 * For production, replace with Redis-backed solution.
 */
const submissionMap = new Map(); // phone -> [timestamps]

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS = 5;

const complaintRateLimiter = (req, res, next) => {
  const phone = req.body && req.body.phone_number;
  if (!phone) return next(); // let validation handle missing phone

  const now = Date.now();
  const timestamps = (submissionMap.get(phone) || []).filter(
    (ts) => now - ts < WINDOW_MS
  );

  if (timestamps.length >= MAX_SUBMISSIONS) {
    return res.status(429).json({
      success: false,
      message: `Too many complaints submitted. Maximum ${MAX_SUBMISSIONS} per hour allowed.`,
      error_code: 'RATE_LIMIT_EXCEEDED',
    });
  }

  timestamps.push(now);
  submissionMap.set(phone, timestamps);
  next();
};

module.exports = complaintRateLimiter;
