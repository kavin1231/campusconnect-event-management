# Event Stall Allocation Map - Implementation Guide

## Overview

The stall allocation map component has been refactored to use **fixed, real stall positions** instead of random marker placement. Stall coordinates are now defined in a configuration file (`stallPositions.js`) that maps each stall to exact positions on your campus map image.

**Key Benefits:**
✅ Real stall positions match your campus map image  
✅ Reusable across all events (same stall layout for every event)  
✅ Vendor/reservation data from API merged cleanly with position config  
✅ Easy to update coordinates by editing one config file  
✅ Ready for backend integration (database-driven positions in future)  
✅ No external map libraries required (lightweight, performant)  

---

## Files Changed / Created

### New Files
1. **`frontend/src/utils/stallPositions.js`** ← Stall coordinate configuration
2. **`frontend/src/utils/stallDataMapper.js`** ← Enrichment utility (merges API data with positions)

### Modified Files
1. **`frontend/src/components/events/VendorStallMap.jsx`** ← Now uses position enrichment
2. **`frontend/public/maps/sliit-campus-map.png`** ← Replace with your new map image

### No Changes Needed
- **`EventDetail.jsx`** – Integration works transparently (enrichment happens inside VendorStallMap)
- **`PublishedEventPage.jsx`** – Integration works transparently
- **`VendorStallMap.css`** – Styling unchanged

---

## Architecture: How It Works

```
┌─────────────────────────────────────────────────────────┐
│  API Returns Stall Data (vendor/reservation info)      │
│  { id, stallNumber, vendorId, vendor, status, ... }    │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
        ┌─────────────────────────┐
        │  EventDetail.jsx or     │
        │  PublishedEventPage.jsx │
        └────────┬────────────────┘
                 │ passes stalls[] prop
                 ▼
        ┌─────────────────────────────────────────┐
        │    VendorStallMap Component             │
        │    (receives API stalls data)            │
        └────────┬────────────────────────────────┘
                 │
                 ▼
        ┌──────────────────────────────────────────────────────┐
        │  enrichStallsWithPositions()                         │
        │  (merges API data with fixed position config)        │
        └────────┬─────────────────────────────────────────────┘
                 │
    ┌────────────┴────────────┐
    ▼                         ▼
stallPositions.js      stallDataMapper.js
(coordinate config)    (enrichment logic)
    │                         │
    └────────────┬────────────┘
                 ▼
        ┌──────────────────────────────────────────┐
        │  Enriched Stall Data                     │
        │  { stallNumber, mapX, mapY, category,    │
        │    vendor, status, description, ... }    │
        └────────┬─────────────────────────────────┘
                 │
                 ▼
        ┌──────────────────────────────────────────┐
        │  Render Stall Markers on Map             │
        │  (position + color based on status)      │
        │  (hover tooltip with full details)       │
        └──────────────────────────────────────────┘
```

---

## Step 1: Update Stall Positions Configuration

Edit `frontend/src/utils/stallPositions.js` to match your new campus map image.

### How to Calibrate Coordinates

**What you need:**
- Your new campus map image (in `frontend/public/maps/`)
- Exact visual positions of each stall on the map

**Coordinate Calibration Process:**

1. **Open the map image** in an image editor (Photoshop, GIMP) or browser DevTools
2. **For each stall**, measure:
   - Distance from the **LEFT edge** to the stall center (in pixels) → `mapX`
   - Distance from the **TOP edge** to the stall center (in pixels) → `mapY`

3. **Convert pixels to percentages:**
   ```
   mapX_percent = (distanceFromLeft / imageWidth) × 100
   mapY_percent = (distanceFromTop / imageHeight) × 100
   ```

4. **Clamp between 4-96%** to keep markers within visible bounds:
   ```
   if mapX < 4: mapX = 4
   if mapX > 96: mapX = 96
   (same for mapY)
   ```

5. **Update** `frontend/src/utils/stallPositions.js` with your calculated values

### Example Calibration

If your map is **1000px wide × 600px tall**, and stall #1 is at **pixel 150, 120**:
```
mapX = (150 / 1000) × 100 = 15%
mapY = (120 / 600) × 100 = 20%
```

Update the config:
```javascript
{
  stallNumber: 1,
  mapX: 15,          // ← your calculated value
  mapY: 20,          // ← your calculated value
  category: "Food & Beverage",
  description: "Stall location description"
}
```

### Template: Coordinate Spreadsheet

Use this to organize your calibration:

| Stall # | Pixel X | Pixel Y | Image Width | Image Height | mapX % | mapY % | Category | Notes |
|---------|---------|---------|-------------|--------------|--------|--------|----------|-------|
| 1 | 150 | 120 | 1000 | 600 | 15 | 20 | Food | NW corner |
| 2 | 320 | 120 | 1000 | 600 | 32 | 20 | Food | Center |
| 3 | 500 | 120 | 1000 | 600 | 50 | 20 | Tech | Center |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |

---

## Step 2: Replace Campus Map Image

1. Get your new map image (preferably same dimensions as the old one for consistent scaling)
2. Save it as: **`frontend/public/maps/sliit-campus-map.png`**
   - (Replace the existing file or update the fallback path in VendorStallMap if using a different filename)

---

## Step 3: Understanding the New Stall Data Structure

### Before (Random Positioning - Old System)
```javascript
// API returns stall data - positions were random
{
  id: "stall-1",
  stallNumber: 1,
  vendorId: "vendor-123",
  vendor: {
    name: "Food Co",
    companyName: "Food Company",
    contactName: "John Doe",
    contactPhone: "+1234567890"
  },
  status: "RESERVED",
  mapX: 50,  // ← random value
  mapY: 50   // ← random value
}
```

### After (Fixed Positioning - New System)
```javascript
// API returns only vendor/status data
{
  id: "stall-1",
  stallNumber: 1,
  vendorId: "vendor-123",
  vendor: { name: "Food Co", ... },
  status: "RESERVED"
  // NOTE: mapX, mapY, category, description come from config!
}

// ↓ enrichStallsWithPositions() merges with config ↓

{
  id: "stall-1",
  stallNumber: 1,
  vendorId: "vendor-123",
  vendor: { name: "Food Co", ... },
  status: "RESERVED",
  mapX: 15,          // ← from stallPositions.js config
  mapY: 20,          // ← from stallPositions.js config
  category: "Food & Beverage",
  description: "Stall 1 - Premium food area"
  // Enriched stall ready to render!
}
```

---

## Step 4: Integration (Automatic - No Code Changes Needed)

### EventDetail.jsx (No changes needed)
```javascript
// Component already works - enrichment is automatic inside VendorStallMap
<VendorStallMap 
  stalls={stalls}  // Just pass raw API stalls
  loading={stallsLoading}
  error={stallsError}
/>
```

### PublishedEventPage.jsx (No changes needed)
```javascript
// Same as EventDetail - pass raw stalls, enrichment happens inside VendorStallMap
<VendorStallMap 
  stalls={stalls}
  stallsLoading={stallsLoading}
  stallsError={stallsError}
/>
```

---

## Step 5: Stall Component Behavior (Updated)

### Hover Tooltip (Enhanced with Category)
When hovering over a stall marker:

```
┌─────────────────────────────────┐
│ Stall 1                         │
│ Status: Available               │
│ Category: Food & Beverage       │
│ Location: Premium food stall... │
│ Vendor: Unassigned              │
└─────────────────────────────────┘
```

### Marker Colors
- **Red** = Reserved (has vendorId + vendor data)
- **Blue** = Free/Available (no vendor assigned)

### Legend (Top of Map)
```
🔴 Red = Reserved (3)
🔵 Blue = Free (17)
```

---

## Usage Examples

### In Your Components

#### Example 1: Use VendorStallMap as-is (Recommended)
```javascript
import VendorStallMap from '../events/VendorStallMap';

export function MyEventPage() {
  const [stalls, setStalls] = useState([]);
  
  useEffect(() => {
    // Fetch stalls from API (raw data, no positions)
    eventsAPI.getEventStalls(eventId).then(res => {
      setStalls(res.stalls || []);
    });
  }, [eventId]);

  return (
    <VendorStallMap 
      stalls={stalls}
      title="Event Stall Allocation"
      subtitle="View vendor stall assignments"
    />
  );
}
```

#### Example 2: Manual Enrichment (Advanced)
```javascript
import { enrichStallsWithPositions } from '../../utils/stallDataMapper';

// If you need enriched data outside the component:
const apiStalls = [/* from API */];
const enrichedStalls = enrichStallsWithPositions(apiStalls);

// Now enrichedStalls has mapX, mapY, category, description
console.log(enrichedStalls[0]);
// {
//   id: "stall-1",
//   stallNumber: 1,
//   mapX: 15,
//   mapY: 20,
//   category: "Food & Beverage",
//   description: "..."
// }
```

#### Example 3: Get Stall Statistics
```javascript
import { calculateStallStatistics } from '../../utils/stallDataMapper';

const stats = calculateStallStatistics(enrichedStalls);
console.log(stats);
// {
//   total: 20,
//   reserved: 5,
//   free: 15,
//   reservationPct: 25,
//   byCategory: {
//     "Food & Beverage": { total: 8, reserved: 3, free: 5 },
//     "Technology": { total: 6, reserved: 2, free: 4 },
//     ...
//   }
// }
```

---

## Verification & Testing

### ✅ Visual Verification

1. **Navigate to an event detail page**
   - URL: `http://localhost:5173/event/{eventId}`
   - You should see the stall allocation map with your new campus image

2. **Verify stall positions**
   - All 20 stalls should appear on your new map image
   - Stalls should match the positions you calibrated
   - No stalls should be outside the map boundaries

3. **Verify colors**
   - Red stalls = Reserved (have vendor assigned)
   - Blue stalls = Free (no vendor assigned)
   - Legend at top shows correct counts

4. **Verify tooltips**
   - Hover over each stall → tooltip appears
   - Tooltip shows: Stall #, Status, Category, Location, Vendor name, Contact
   - Tooltip disappears on mouse leave

### ✅ Functional Verification

1. **Test responsive layout**
   - Desktop: Map fills container width with clamp(360px, 55vw, 720px) height
   - Tablet (768px): Map scales appropriately
   - Mobile (375px): Map remains usable with proper scaling

2. **Test with different events**
   - Create/view multiple events
   - Each event should show the same stall positions (from config)
   - Different stalls should be red/blue based on vendor assignments for that event

3. **Test error handling**
   - Try with missing/invalid stall data → should show empty state or error
   - Try with map image missing → should show fallback

### ✅ Data Validation

```javascript
// Open browser DevTools console on event page
// Inspect stalls to verify enrichment:

// In VendorStallMap component:
console.log(normalizedStalls[0]);
// Should have: id, stallNumber, mapX, mapY, category, description, vendor, vendorId

// Verify all stalls have positions
console.log(normalizedStalls.filter(s => typeof s.mapX !== 'number'));
// Should return empty array []
```

### ✅ Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Stalls not visible | Map image not found | Verify `/maps/sliit-campus-map.png` exists and path is correct |
| Stalls outside map bounds | Coordinates > 96% or < 4% | Check stallPositions.js, ensure values are clamped to 4-96% |
| Tooltip shows "Unassigned" for reserved stalls | API data missing vendor info | Verify vendor data is returned by API (`/events/{id}/stalls` endpoint) |
| Map appears too small/large | CSS height issue | Check `clamp(360px, 55vw, 720px)` in VendorStallMap.css - adjust if needed |
| Wrong colors (red/blue reversed) | Check vendor assignment logic | Look at `isReserved` calculation: `Boolean(stall.vendorId && stall.vendor)` |

---

## Advanced: Updating Stall Positions Later

### Option 1: Edit stallPositions.js (Current)
Simply update the coordinate values in `frontend/src/utils/stallPositions.js` and the component automatically re-renders.

### Option 2: Future - Database-Driven (Coming Soon)
Replace the static `STALL_POSITIONS` array with an API call:

```javascript
// Future enhancement
const fetchStallPositions = async (eventId) => {
  const response = await fetch(`/api/stall-positions?eventId=${eventId}`);
  return response.json(); // Returns array matching STALL_POSITIONS format
};

// Then use in enrichment:
const enrichedStalls = enrichStallsWithPositions(apiStalls, positionConfig);
```

### Option 3: Interactive Calibration Tool (Optional)
You could build an admin tool to:
1. Upload map image
2. Click each stall location on the image
3. Automatically generate coordinates
4. Export as JavaScript array or CSV

---

## File Locations Quick Reference

```
frontend/
├── src/
│   ├── components/
│   │   └── events/
│   │       ├── VendorStallMap.jsx          ← Updated component
│   │       └── VendorStallMap.css          ← (no changes)
│   │   └── dashboard/
│   │       └── PublishedEventPage.jsx      ← (no changes needed)
│   ├── utils/
│   │   ├── stallPositions.js               ← NEW: Coordinate config
│   │   └── stallDataMapper.js              ← NEW: Enrichment utility
│   └── ...
└── public/
    └── maps/
        └── sliit-campus-map.png            ← REPLACE: Your new map image
```

---

## Summary of Changes

| Component | What Changed | Impact |
|-----------|--------------|--------|
| `VendorStallMap.jsx` | Now imports and uses `enrichStallsWithPositions()` to merge API data with fixed positions | Transparent to parent components |
| `stallPositions.js` | NEW file with stall coordinate config | You update this with your map coordinates |
| `stallDataMapper.js` | NEW utility to enrich stalls with position data | Used by VendorStallMap automatically |
| Campus map image | Replace with your new map | Stalls render on your actual campus map |
| `EventDetail.jsx` | No changes needed | Enrichment happens inside VendorStallMap |
| `PublishedEventPage.jsx` | No changes needed | Enrichment happens inside VendorStallMap |

---

## Next Steps

1. ✅ **Measure stall positions** on your new campus map image
2. ✅ **Update stallPositions.js** with calculated coordinates
3. ✅ **Upload new map image** to `frontend/public/maps/`
4. ✅ **Test on event pages** - verify positions and colors
5. ✅ **Verify tooltips** show correct information

---

## Troubleshooting

### Stalls not appearing?
```javascript
// 1. Check if stallPositions.js is imported correctly
import { STALL_POSITIONS } from '../../utils/stallPositions';

// 2. Verify stall numbers in API response match stallPositions.js
console.log('API stalls:', stalls.map(s => s.stallNumber));
console.log('Config stalls:', STALL_POSITIONS.map(s => s.stallNumber));

// 3. Check if positions are within bounds (4-96%)
STALL_POSITIONS.forEach(s => {
  if (s.mapX < 4 || s.mapX > 96 || s.mapY < 4 || s.mapY > 96) {
    console.warn(`Stall ${s.stallNumber} out of bounds:`, s.mapX, s.mapY);
  }
});
```

### Wrong positions?
```javascript
// 1. Verify your map image dimensions match calibration
// 2. Check stallPositions.js coordinates again
// 3. Use browser DevTools to inspect rendered elements:
document.querySelectorAll('[data-testid^="stall-"]').forEach(el => {
  console.log(el.getAttribute('data-stall-number'), el.style.left, el.style.top);
});
```

---

**Implementation Complete! 🎉**

Your stall allocation map is now using real campus positions with a clean, maintainable architecture. All stalls render based on fixed coordinates that can be easily updated or migrated to a database in the future.
