/**
 * Utility functions for the vendor stall allocation map
 */

/**
 * Generates a 2D grid from a flat array of stalls (5 columns × 4 rows = 20 max)
 * @param {Array} stalls - Flat array of stall objects
 * @returns {Array<Array>} 2D array representing the grid
 */
export function generateStallGrid(stalls) {
  const grid = [];
  const stallMap = new Map(stalls.map((s) => [s.stallNumber, s]));

  // 5 columns × 4 rows = 20 stalls maximum
  const COLS = 5;
  const ROWS = 4;
  const MAX_STALLS = COLS * ROWS;

  for (let row = 0; row < ROWS; row++) {
    const rowArray = [];
    for (let col = 0; col < COLS; col++) {
      const stallNumber = row * COLS + col + 1; // Stalls numbered 1-20
      const stall = stallMap.get(stallNumber) || {
        id: null,
        stallNumber,
        status: "EMPTY",
        vendorId: null,
        vendor: null,
      };
      rowArray.push(stall);
    }
    grid.push(rowArray);
  }

  return grid;
}

/**
 * Determines the status display string for a stall
 * @param {Object} stall - Stall object
 * @returns {string} Status: "available", "allocated", or "empty"
 */
export function getStallStatus(stall) {
  if (!stall.id) return "empty"; // Grid placeholder
  if (stall.vendorId && stall.vendor) return "allocated";
  return "available";
}

/**
 * Gets the display label for a stall cell
 * @param {Object} stall - Stall object
 * @returns {Object} Object with stallLabel and vendorLabel
 */
export function getDisplayLabel(stall) {
  const stallLabel = `S-${stall.stallNumber}`;

  if (!stall.vendor) {
    return {
      stallLabel,
      vendorLabel: null,
      displayText: stallLabel,
    };
  }

  // Truncate vendor name to fit in cell
  const vendorName = stall.vendor.name || stall.vendor.companyName || "Unknown";
  const truncatedName =
    vendorName.length > 18 ? `${vendorName.slice(0, 15)}...` : vendorName;

  return {
    stallLabel,
    vendorLabel: truncatedName,
    displayText: `${stallLabel}\n${truncatedName}`,
    fullName: vendorName,
  };
}

/**
 * Gets stall info for tooltip display
 * @param {Object} stall - Stall object
 * @returns {Object} Tooltip information
 */
export function getStallTooltipInfo(stall) {
  const status = getStallStatus(stall);

  if (status === "empty") {
    return { title: "No Stall", description: "This position is not available" };
  }

  const stallNumber = `Stall S-${stall.stallNumber}`;

  if (status === "allocated") {
    const vendor = stall.vendor;
    return {
      title: stallNumber,
      description: `Assigned to: ${vendor.name || vendor.companyName}`,
      vendor: {
        name: vendor.name || vendor.companyName,
        contact: vendor.contactName || vendor.contactPhone,
      },
    };
  }

  return {
    title: stallNumber,
    description: "Available for vendor allocation",
  };
}

/**
 * Gets CSS class name for stall cell based on status
 * @param {Object} stall - Stall object
 * @returns {string} CSS class name
 */
export function getStallCellClass(stall) {
  const status = getStallStatus(stall);
  switch (status) {
    case "allocated":
      return "stall-cell stall-allocated";
    case "available":
      return "stall-cell stall-available";
    case "empty":
      return "stall-cell stall-empty";
    default:
      return "stall-cell";
  }
}
