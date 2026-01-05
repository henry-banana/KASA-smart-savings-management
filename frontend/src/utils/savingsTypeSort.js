/**
 * Sort savings types in a consistent order across the application
 * Dynamic order: All/All Types → No term → X months (sorted by number) → others (alphabetically)
 * Examples: "2 months", "3 months", "6 months", "12 months", "18 months" will be sorted numerically
 * @param {Array} types - Array of objects with 'label' property
 * @returns {Array} Sorted array of types
 */
export const sortSavingsTypes = (types) => {
  // Helper function to extract number from "X months" or "X month" pattern
  const extractMonths = (label) => {
    const match = label.match(/^(\d+)\s+months?$/i);
    return match ? parseInt(match[1]) : null;
  };

  return types.sort((a, b) => {
    const aLabel = a.label;
    const bLabel = b.label;

    // All/All Types always first
    if (aLabel === "All" || aLabel === "All Types") return -1;
    if (bLabel === "All" || bLabel === "All Types") return 1;

    // No term always second
    if (aLabel === "No term") return -1;
    if (bLabel === "No term") return 1;

    // Extract months from patterns like "X months"
    const aMonths = extractMonths(aLabel);
    const bMonths = extractMonths(bLabel);

    // If both are "X months" pattern, sort by number
    if (aMonths !== null && bMonths !== null) {
      return aMonths - bMonths;
    }

    // If only one is "X months", it comes before other items
    if (aMonths !== null) return -1;
    if (bMonths !== null) return 1;

    // Otherwise sort alphabetically
    return aLabel.localeCompare(bLabel);
  });
};

/**
 * Sort savings type items by typeName (used for API response data)
 * Applies same sorting logic as sortSavingsTypes
 * @param {Array} items - Array of objects with 'typeName' property
 * @returns {Array} Sorted array of items
 */
export const sortSavingsTypeItems = (items) => {
  // Helper function to extract number from "X months" or "X month" pattern
  const extractMonths = (typeName) => {
    const match = typeName.match(/^(\d+)\s+months?$/i);
    return match ? parseInt(match[1]) : null;
  };

  return items.sort((a, b) => {
    const aTypeName = a.typeName;
    const bTypeName = b.typeName;

    // No term always first (for items without All option)
    if (aTypeName === "No term") return -1;
    if (bTypeName === "No term") return 1;

    // Extract months from patterns like "X months"
    const aMonths = extractMonths(aTypeName);
    const bMonths = extractMonths(bTypeName);

    // If both are "X months" pattern, sort by number
    if (aMonths !== null && bMonths !== null) {
      return aMonths - bMonths;
    }

    // If only one is "X months", it comes before other items
    if (aMonths !== null) return -1;
    if (bMonths !== null) return 1;

    // Otherwise sort alphabetically
    return aTypeName.localeCompare(bTypeName);
  });
};
