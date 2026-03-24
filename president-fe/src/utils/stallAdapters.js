/**
 * Enriches raw stall data with vendor assignment info.
 * @param {Array} stallData  - raw stall.json entries
 * @param {Array} vendorData - raw vendor.json entries
 * @returns enriched stall objects used across stall components
 */
export function normalizeStalls(stallData, vendorData) {
  return stallData.map((stall) => {
    const vendor = vendorData.find((v) => v.stall_id === stall.id) ?? null
    return {
      id:          stall.id,
      stallName:   stall.stall_name,
      isAvailable: stall.availability,
      vendorName:  vendor ? vendor.name : null,
    }
  })
}
