/**
 * Generates a unique complaint ID: CMP_XXXXXX (6-digit random number)
 */
const generateComplaintId = () => {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `CMP_${num}`;
};

/**
 * Generates a unique worker ID: WRK_XXXX
 */
const generateWorkerId = () => {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `WRK_${num}`;
};

/**
 * Generates a unique category ID: CAT_XXX
 */
const generateCategoryId = (index) => {
  return `CAT_${String(index).padStart(3, '0')}`;
};

module.exports = { generateComplaintId, generateWorkerId, generateCategoryId };
