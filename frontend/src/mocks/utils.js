/**
 * Simulate network delay (300-800ms)
 */
export const delay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Random delay
 */
export const randomDelay = () => {
  const ms = Math.floor(Math.random() * 500) + 300; // 300-800ms
  return delay(ms);
};

/**
 * Generate unique ID
 */
export const generateId = (prefix = 'ID') => {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
};
