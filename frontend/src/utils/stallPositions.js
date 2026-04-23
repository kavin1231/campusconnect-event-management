/**
 * Stall Positions Configuration
 * 
 * This file defines the exact coordinates for each stall on the campus map.
 * Positions are defined as percentages (0-100) of the map width/height.
 * 
 * **HOW TO CALIBRATE COORDINATES:**
 * 1. Open the campus map image in an image editor or browser DevTools
 * 2. Identify the visual position of each stall on the map
 * 3. Calculate the percentage position:
 *    - measurePixels = distance from left/top edge in pixels
 *    - imageWidth/Height = total map dimensions
 *    - percentage = (measurePixels / imageWidth/Height) * 100
 * 4. Clamp values between 4-96% to keep markers within visible bounds
 * 5. Update the coordinates below with your calculated values
 * 
 * **TEMPLATE STRUCTURE:**
 * stallNumber: unique identifier (1-20 for 5x4 grid)
 * mapX: horizontal position (% from left)
 * mapY: vertical position (% from top)
 * category: service category (e.g., "Food & Beverage", "Technology", "Arts")
 * description: stall description for admin reference
 * eventId: (optional) if event-specific positions needed in future
 */

export const STALL_POSITIONS = [
  // Coordinates aligned to the marked stall locations on the updated campus map.
  {
    stallNumber: 1,
    mapX: 50.8,
    mapY: 23.8,
    category: "Food & Beverage",
    description: "Top inner lane - west point"
  },
  {
    stallNumber: 2,
    mapX: 52.5,
    mapY: 24.7,
    category: "Food & Beverage",
    description: "Top inner lane - east point"
  },
  {
    stallNumber: 3,
    mapX: 64.7,
    mapY: 33.6,
    category: "Technology",
    description: "Upper diagonal lane"
  },
  {
    stallNumber: 4,
    mapX: 79.0,
    mapY: 43.6,
    category: "Food & Beverage",
    description: "Right diagonal lane"
  },
  {
    stallNumber: 5,
    mapX: 36.1,
    mapY: 50.9,
    category: "Arts & Crafts",
    description: "Central west cluster - north west"
  },

  // Central clusters and curved lane
  {
    stallNumber: 6,
    mapX: 38.5,
    mapY: 50.9,
    category: "Arts & Crafts",
    description: "Central west cluster - north east"
  },
  {
    stallNumber: 7,
    mapX: 36.1,
    mapY: 57.4,
    category: "Services",
    description: "Central west cluster - south west"
  },
  {
    stallNumber: 8,
    mapX: 38.5,
    mapY: 57.4,
    category: "Technology",
    description: "Central west cluster - south east"
  },
  {
    stallNumber: 9,
    mapX: 46.3,
    mapY: 52.3,
    category: "Arts & Crafts",
    description: "Curved lane - point 1"
  },
  {
    stallNumber: 10,
    mapX: 48.5,
    mapY: 52.3,
    category: "Services",
    description: "Curved lane - point 2"
  },

  // Curved lane continuation
  {
    stallNumber: 11,
    mapX: 51.0,
    mapY: 53.6,
    category: "Food & Beverage",
    description: "Curved lane - point 3"
  },
  {
    stallNumber: 12,
    mapX: 53.4,
    mapY: 55.0,
    category: "Technology",
    description: "Curved lane - point 4"
  },
  {
    stallNumber: 13,
    mapX: 55.4,
    mapY: 57.7,
    category: "Services",
    description: "Curved lane - point 5"
  },
  {
    stallNumber: 14,
    mapX: 56.8,
    mapY: 61.5,
    category: "Arts & Crafts",
    description: "Curved lane - point 6"
  },
  {
    stallNumber: 15,
    mapX: 57.1,
    mapY: 75.2,
    category: "Food & Beverage",
    description: "Main building east lane - upper"
  },

  // Vertical lanes near main building
  {
    stallNumber: 16,
    mapX: 57.1,
    mapY: 79.4,
    category: "Services",
    description: "Main building east lane - upper middle"
  },
  {
    stallNumber: 17,
    mapX: 57.1,
    mapY: 87.6,
    category: "Arts & Crafts",
    description: "Main building east lane - lower middle"
  },
  {
    stallNumber: 18,
    mapX: 57.1,
    mapY: 91.1,
    category: "Technology",
    description: "Main building east lane - lower"
  },
  {
    stallNumber: 19,
    mapX: 33.7,
    mapY: 87.4,
    category: "Services",
    description: "Main building west lane - upper"
  },
  {
    stallNumber: 20,
    mapX: 33.7,
    mapY: 91.2,
    category: "Arts & Crafts",
    description: "Main building west lane - lower"
  }
];

/**
 * Get stall position by stall number
 * @param {number} stallNumber - The stall number to find
 * @returns {object|null} The stall position object or null if not found
 */
export function getStallPosition(stallNumber) {
  return STALL_POSITIONS.find(s => s.stallNumber === stallNumber) || null;
}

/**
 * Get all stall positions for a specific category
 * @param {string} category - The service category to filter by
 * @returns {array} Array of stalls matching the category
 */
export function getStallsByCategory(category) {
  return STALL_POSITIONS.filter(s => s.category === category);
}

/**
 * Get all available categories
 * @returns {array} Array of unique categories
 */
export function getCategories() {
  return [...new Set(STALL_POSITIONS.map(s => s.category))];
}

/**
 * Validate and normalize stall coordinates
 * Ensures coordinates stay within bounds (4-96%)
 * @param {object} stall - Stall object with mapX and mapY
 * @returns {object} Normalized stall with clamped coordinates
 */
export function normalizeStallCoordinates(stall) {
  return {
    ...stall,
    mapX: Math.min(96, Math.max(4, Number(stall.mapX ?? 50))),
    mapY: Math.min(96, Math.max(4, Number(stall.mapY ?? 50)))
  };
}
