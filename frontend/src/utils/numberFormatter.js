/**
 * Format number using Vietnamese locale (vi-VN)
 * Uses dot (.) for thousand separator and comma (,) for decimal separator
 * Automatically floors the value to the nearest integer by default
 *
 * @param {number|string} value - The number to format
 * @param {Object} options - Intl.NumberFormat options
 * @param {number} options.minimumFractionDigits - Minimum decimal places (default: 0)
 * @param {number} options.maximumFractionDigits - Maximum decimal places (default: 0)
 * @param {boolean} options.noFloor - Set to true to preserve decimal places (default: false)
 * @returns {string} Formatted number string (e.g., "1.234.567")
 *
 * @example
 * formatVnNumber(1234567)           // "1.234.567"
 * formatVnNumber(1234.5)            // "1.234"
 * formatVnNumber(1234.567, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
 * // "1.234"
 * formatVnNumber(1234.567, { minimumFractionDigits: 2, maximumFractionDigits: 2, noFloor: true })
 * // "1.234,57"
 */
export const formatVnNumber = (value, options = {}) => {
  const { noFloor = false, ...formatOptions } = options;

  const formatter = new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...formatOptions,
  });

  const numValue = Number(value) || 0;
  const valueToFormat = noFloor ? numValue : Math.floor(numValue);

  return formatter.format(valueToFormat);
};

/**
 * Format balance using Vietnamese locale with no decimal places
 * Floors to nearest integer for currency display
 *
 * @param {number|string} value - The balance to format
 * @returns {string} Formatted balance string without decimal places (e.g., "1.234.567")
 *
 * @example
 * formatBalance(1234567.89)    // "1.234.568"
 * formatBalance(1234.5)        // "1.235"
 */
export const formatBalance = (value) => {
  return formatVnNumber(Math.floor(Number(value) || 0), {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

/**
 * Format number with decimal places (no flooring)
 * Uses Vietnamese locale (vi-VN)
 *
 * @param {number|string} value - The number to format
 * @param {number} decimalPlaces - Number of decimal places to display (default: 2)
 * @returns {string} Formatted number string (e.g., "1.234,57")
 *
 * @example
 * formatVnNumberWithDecimals(1234.567)      // "1.234,57"
 * formatVnNumberWithDecimals(1234.567, 3)   // "1.234,567"
 */
export const formatVnNumberWithDecimals = (value, decimalPlaces = 2) => {
  return formatVnNumber(value, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    noFloor: true,
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
