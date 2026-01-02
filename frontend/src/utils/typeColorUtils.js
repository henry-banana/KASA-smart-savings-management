/**
 * Type Color Utilities
 * Provides consistent color mapping for account types across the application
 */

// Color palette for badge classes (used in tables/badges)
export const TYPE_BADGE_COLOR_CLASSES = [
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-cyan-100 text-cyan-700 border-cyan-200",
  "bg-sky-100 text-sky-700 border-sky-200",
  "bg-indigo-100 text-indigo-700 border-indigo-200",
  "bg-violet-100 text-violet-700 border-violet-200",
  "bg-purple-100 text-purple-700 border-purple-200",
  "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
  "bg-pink-100 text-pink-700 border-pink-200",
  "bg-rose-100 text-rose-700 border-rose-200",
  "bg-red-100 text-red-700 border-red-200",
  "bg-orange-100 text-orange-700 border-orange-200",
  "bg-amber-100 text-amber-700 border-amber-200",
  "bg-yellow-100 text-yellow-800 border-yellow-200",
  "bg-lime-100 text-lime-700 border-lime-200",
  "bg-green-100 text-green-700 border-green-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-teal-100 text-teal-700 border-teal-200",
];

// Hex color palette for charts (used in PieChart, BarChart, etc.)
export const TYPE_CHART_HEX_COLORS = [
  "#3B82F6", // blue-500
  "#06B6D4", // cyan-500
  "#0EA5E9", // sky-500
  "#6366F1", // indigo-500
  "#8B5CF6", // violet-500
  "#A855F7", // purple-500
  "#D946EF", // fuchsia-500
  "#EC4899", // pink-500
  "#F43F5E", // rose-500
  "#EF4444", // red-500
  "#F97316", // orange-500
  "#F59E0B", // amber-500
  "#EAB308", // yellow-500
  "#84CC16", // lime-500
  "#22C55E", // green-500
  "#10B981", // emerald-500
  "#14B8A6", // teal-500
];

/**
 * Improved hash function with salt and multiple rounds for better distribution
 * Uses combination of djb2 and FNV-1a algorithms to reduce collisions
 * @param {string} str - String to hash
 * @returns {number} Hash value
 */
const hashString = (str) => {
  const s = String(str || "").toLowerCase();

  // Round 1: djb2 with custom salt
  let hash1 = 5381;
  const salt1 = 33; // Prime multiplier
  for (let i = 0; i < s.length; i++) {
    hash1 = (hash1 << 5) + hash1 + s.charCodeAt(i) * salt1;
    hash1 = hash1 & 0xffffffff;
  }

  // Round 2: FNV-1a algorithm with different salt
  let hash2 = 2166136261; // FNV offset basis
  const salt2 = 16777619; // FNV prime
  for (let i = 0; i < s.length; i++) {
    hash2 = hash2 ^ (s.charCodeAt(i) * 37); // XOR with char * prime
    hash2 = (hash2 * salt2) >>> 0; // Multiply and convert to unsigned 32-bit
  }

  // Combine both hashes with rotation for final value
  const combined = ((hash1 ^ (hash2 >>> 16)) + (hash2 << 3)) >>> 0;

  return Math.abs(combined);
};

/**
 * Get badge color class for a type (for use in Badge components)
 * @param {string} type - Account type name
 * @returns {string} Tailwind CSS classes for badge styling
 */
export const getTypeBadgeColor = (type) => {
  const idx = hashString(type) % TYPE_BADGE_COLOR_CLASSES.length;
  return TYPE_BADGE_COLOR_CLASSES[idx];
};

/**
 * Get hex color for a type (for use in charts)
 * @param {string} type - Account type name
 * @returns {string} Hex color code
 */
export const getTypeChartColor = (type) => {
  const idx = hashString(type) % TYPE_CHART_HEX_COLORS.length;
  return TYPE_CHART_HEX_COLORS[idx];
};

/**
 * Get type label (default implementation)
 * @param {string} type - Account type name
 * @returns {string} Display label
 */
export const getTypeLabel = (type) => type || "Unknown";
