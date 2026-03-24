export function normalizeVendorSeed(seedVendors) {
  return seedVendors.map((vendor, index) => ({
    id: index + 1,
    name: String(vendor.name ?? '').trim(),
    stallId: Number(vendor.stall_id),
    contactNumber: String(vendor.contact_number ?? '').trim(),
    eventName: String(vendor.event_name ?? '').trim(),
    fee: Number(vendor.fee) || 0,
  }))
}

export function getStallLabel(stalls, stallId) {
  const found = stalls.find((stall) => stall.id === stallId)
  if (found) {
    return found.stall_name
  }

  return `Unknown Stall (#${stallId})`
}

export function getSelectableStalls(stalls, vendors, editingVendor = null) {
  const occupied = new Set(
    vendors
      .filter((vendor) => !editingVendor || vendor.id !== editingVendor.id)
      .map((vendor) => vendor.stallId)
  )

  const selectable = stalls.filter((stall) => stall.availability && !occupied.has(stall.id))

  if (editingVendor && Number.isFinite(editingVendor.stallId)) {
    const currentFromStallData = stalls.find((stall) => stall.id === editingVendor.stallId)

    if (currentFromStallData && !selectable.some((stall) => stall.id === currentFromStallData.id)) {
      selectable.unshift(currentFromStallData)
    }

    if (!currentFromStallData) {
      selectable.unshift({
        id: editingVendor.stallId,
        stall_name: `Unknown Stall (#${editingVendor.stallId})`,
        availability: true,
      })
    }
  }

  return selectable
}
