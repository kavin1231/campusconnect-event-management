/**
 * Stall Data Mapper
 * 
 * Merges API stall data (vendor/reservation info) with fixed position configuration.
 * This allows stall positions to be defined independently of vendor assignments,
 * making them reusable across multiple events.
 * 
 * Usage:
 * const enrichedStalls = enrichStallsWithPositions(apiStalls, stallPositions);
 */

import { STALL_POSITIONS, normalizeStallCoordinates } from './stallPositions';

function normalizeStallNumber(stallNumber) {
  if (stallNumber === null || stallNumber === undefined) return null;
  if (typeof stallNumber === 'string') {
    const match = stallNumber.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  }
  const value = Number(stallNumber);
  return Number.isNaN(value) ? null : value;
}

/**
 * Enriches API stall data with fixed position coordinates
 * 
 * @param {array} apiStalls - Stall data from API, containing vendor/status info
 *                             Expected format: { id, stallNumber, status, vendorId, vendor, ... }
 * @param {array} positionConfig - Stall position configuration (defaults to STALL_POSITIONS)
 * @returns {array} Enriched stall array with position data merged in
 * 
 * Example:
 * Input API stall:
 *   { id: "1", stallNumber: 1, vendorId: "v123", vendor: { name: "Food Co" }, status: "RESERVED" }
 * 
 * Position config entry:
 *   { stallNumber: 1, mapX: 15, mapY: 20, category: "Food & Beverage", description: "..." }
 * 
 * Output (enriched):
 *   { id: "1", stallNumber: 1, vendorId: "v123", vendor: { name: "Food Co" },
 *     mapX: 15, mapY: 20, category: "Food & Beverage", description: "...", status: "RESERVED" }
 */
export function enrichStallsWithPositions(apiStalls = [], positionConfig = STALL_POSITIONS) {
  if (!apiStalls || !Array.isArray(apiStalls)) {
    console.warn('[stallDataMapper] Invalid API stalls array:', apiStalls);
    return [];
  }

  return apiStalls.map(apiStall => {
    const normalizedApiStallNumber = normalizeStallNumber(apiStall.stallNumber);

    // Find matching position config for this stall
    const positionData = positionConfig.find(
      pos => normalizeStallNumber(pos.stallNumber) === normalizedApiStallNumber
    );

    // Merge API data with position config
    const enrichedStall = {
      ...apiStall,
      // Position data (with fallback to defaults if not found)
      mapX: positionData?.mapX ?? 50,
      mapY: positionData?.mapY ?? 50,
      category: positionData?.category ?? 'General',
      description: positionData?.description ?? `Stall ${apiStall.stallNumber}`,
    };

    // Normalize coordinates to ensure they stay within bounds (4-96%)
    return normalizeStallCoordinates(enrichedStall);
  });
}

/**
 * Enriches a single stall with position data
 * 
 * @param {object} apiStall - Single stall from API
 * @param {array} positionConfig - Stall position configuration
 * @returns {object} Enriched stall with position data
 */
export function enrichSingleStall(apiStall, positionConfig = STALL_POSITIONS) {
  if (!apiStall) return null;

  const normalizedApiStallNumber = normalizeStallNumber(apiStall.stallNumber);

  const positionData = positionConfig.find(
    pos => normalizeStallNumber(pos.stallNumber) === normalizedApiStallNumber
  );

  const enrichedStall = {
    ...apiStall,
    mapX: positionData?.mapX ?? 50,
    mapY: positionData?.mapY ?? 50,
    category: positionData?.category ?? 'General',
    description: positionData?.description ?? `Stall ${apiStall.stallNumber}`,
  };

  return normalizeStallCoordinates(enrichedStall);
}

/**
 * Groups enriched stalls by status for analytics
 * 
 * @param {array} enrichedStalls - Array of enriched stall objects
 * @returns {object} Grouped stalls by status
 * 
 * Returns: { reserved: [...], free: [...], all: [...] }
 */
export function groupStallsByStatus(enrichedStalls) {
  return {
    reserved: enrichedStalls.filter(s => Boolean(s.vendorId && s.vendor)),
    free: enrichedStalls.filter(s => !s.vendorId || !s.vendor),
    all: enrichedStalls
  };
}

/**
 * Groups enriched stalls by category
 * 
 * @param {array} enrichedStalls - Array of enriched stall objects
 * @returns {object} Stalls grouped by category
 * 
 * Returns: { "Food & Beverage": [...], "Technology": [...], ... }
 */
export function groupStallsByCategory(enrichedStalls) {
  const grouped = {};
  
  enrichedStalls.forEach(stall => {
    const category = stall.category || 'General';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(stall);
  });

  return grouped;
}

/**
 * Calculate stall allocation statistics
 * 
 * @param {array} enrichedStalls - Array of enriched stall objects
 * @returns {object} Allocation statistics
 * 
 * Returns:
 * {
 *   total: number,
 *   reserved: number,
 *   free: number,
 *   reservationPct: number,
 *   byCategory: { category: { total, reserved, free } }
 * }
 */
export function calculateStallStatistics(enrichedStalls) {
  const grouped = groupStallsByStatus(enrichedStalls);
  const byCategory = {};

  enrichedStalls.forEach(stall => {
    const cat = stall.category || 'General';
    if (!byCategory[cat]) {
      byCategory[cat] = { total: 0, reserved: 0, free: 0 };
    }
    byCategory[cat].total += 1;
    if (stall.vendorId && stall.vendor) {
      byCategory[cat].reserved += 1;
    } else {
      byCategory[cat].free += 1;
    }
  });

  return {
    total: enrichedStalls.length,
    reserved: grouped.reserved.length,
    free: grouped.free.length,
    reservationPct: enrichedStalls.length > 0
      ? Math.round((grouped.reserved.length / enrichedStalls.length) * 100)
      : 0,
    byCategory
  };
}

/**
 * Validates that all required stalls are accounted for
 * Useful for detecting missing position configurations
 * 
 * @param {array} apiStalls - API stall data
 * @param {array} positionConfig - Position configuration
 * @returns {object} Validation result
 * 
 * Returns:
 * {
 *   isValid: boolean,
 *   missingPositions: [stallNumbers],
 *   allocationCount: number,
 *   positionCount: number
 * }
 */
export function validateStallConfiguration(apiStalls, positionConfig = STALL_POSITIONS) {
  const apiStallNumbers = new Set(apiStalls.map(s => normalizeStallNumber(s.stallNumber)).filter(n => n !== null));
  const configStallNumbers = new Set(positionConfig.map(s => normalizeStallNumber(s.stallNumber)).filter(n => n !== null));

  const missingPositions = Array.from(apiStallNumbers).filter(
    num => !configStallNumbers.has(num)
  );

  return {
    isValid: missingPositions.length === 0,
    missingPositions,
    allocationCount: apiStalls.length,
    positionCount: positionConfig.length,
    message: missingPositions.length === 0
      ? 'All stalls have position configuration'
      : `Missing positions for stalls: ${missingPositions.join(', ')}`
  };
}

/**
 * Re-maps stall positions from one event to another (future enhancement)
 * Allows different events to have different stall arrangements if needed
 * 
 * @param {array} enrichedStalls - Current enriched stalls
 * @param {array} newPositionConfig - New position configuration
 * @returns {array} Stalls with new positions applied
 */
export function remapStallPositions(enrichedStalls, newPositionConfig = STALL_POSITIONS) {
  return enrichedStalls.map(stall => {
    const normalizedStallNumber = normalizeStallNumber(stall.stallNumber);

    const newPosition = newPositionConfig.find(
      pos => normalizeStallNumber(pos.stallNumber) === normalizedStallNumber
    );

    if (newPosition) {
      return {
        ...stall,
        mapX: newPosition.mapX,
        mapY: newPosition.mapY,
      };
    }

    return stall;
  });
}

export default {
  enrichStallsWithPositions,
  enrichSingleStall,
  groupStallsByStatus,
  groupStallsByCategory,
  calculateStallStatistics,
  validateStallConfiguration,
  remapStallPositions
};
