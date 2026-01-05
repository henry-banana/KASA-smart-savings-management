/**
 * Format date utilities
 * Provides functions for formatting dates in various formats
 */

/**
 * Format date to DD-MM-YYYY format
 * @param {string|Date} dateString - The date string or Date object to format
 * @returns {string} Formatted date string (e.g., "04-01-2026")
 *
 * @example
 * formatDateToDDMMYYYY("2025-07-28T22:38:44")  // "28-07-2025"
 * formatDateToDDMMYYYY("2025-01-04")            // "04-01-2025"
 */
export const formatDateToDDMMYYYY = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error("Date formatting error:", error);
    return dateString;
  }
};
