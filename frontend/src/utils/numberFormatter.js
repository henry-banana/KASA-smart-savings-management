/**
 * Format number using Vietnamese locale (vi-VN)
 * Uses dot (.) for thousand separator and comma (,) for decimal separator
 *
 * @param {number|string} value - The number to format
 * @param {Object} options - Intl.NumberFormat options
 * @param {number} options.minimumFractionDigits - Minimum decimal places (default: 0)
 * @param {number} options.maximumFractionDigits - Maximum decimal places (default: 20)
 * @returns {string} Formatted number string (e.g., "1.234,56")
 *
 * @example
 * formatVnNumber(1234567)           // "1.234.567"
 * formatVnNumber(1234.5)            // "1.234,5"
 * formatVnNumber(1234.567, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
 * // "1.234,57"
 */
export const formatVnNumber = (value, options = {}) => {
  const formatter = new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 20,
    ...options,
  });

  return formatter.format(Number(value) || 0);
};

/**
 * Format balance using Vietnamese locale with no decimal places
 * Rounds to nearest integer for currency display
 *
 * @param {number|string} value - The balance to format
 * @returns {string} Formatted balance string without decimal places (e.g., "1.234.567")
 *
 * @example
 * formatBalance(1234567.89)    // "1.234.568"
 * formatBalance(1234.5)        // "1.235"
 */
export const formatBalance = (value) => {
  return formatVnNumber(Math.round(Number(value) || 0), {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

/**
 * Replace decimal point with comma in percentage text strings
 * Localizes decimal separator while preserving other text
 *
 * @param {string} text - Text containing decimal numbers (e.g., "+13.3%")
 * @returns {string} Text with decimal points replaced by commas (e.g., "+13,3%")
 *
 * @example
 * formatPercentText("+13.3%")                    // "+13,3%"
 * formatPercentText("-5.2% from last week")      // "-5,2% from last week"
 * formatPercentText("+0%")                       // "+0%"
 */
export const formatPercentText = (text) => {
  if (typeof text !== "string") return text;
  return text.replace(/(\d+)\.(\d+)/g, "$1,$2");
};
