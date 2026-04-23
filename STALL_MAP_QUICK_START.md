# 🎯 Stall Allocation Map - Quick Start Guide

## What Was Done

✅ Created a new stall positioning system that uses **real campus map coordinates** instead of random points  
✅ Stall positions are now defined in a single configuration file (`stallPositions.js`)  
✅ The component automatically enriches API stall data with fixed position coordinates  
✅ All event stalls use the same layout (reusable across events)  
✅ Ready for future database integration  

---

## 4-Step Implementation

### Step 1: Measure Stall Coordinates (10 mins)
- Get your new campus map image
- Measure each stall's X and Y position (in pixels from map edges)
- Convert to percentages using template guide
- See: `STALL_COORDINATE_CALIBRATION_TEMPLATE.md`

### Step 2: Update Stall Config (5 mins)
- Edit: `frontend/src/utils/stallPositions.js`
- Replace sample coordinates with your measured values
- Coordinates must be between 4-96% (auto-clamped if outside)

### Step 3: Replace Campus Map Image (2 mins)
- Save your new map to: `frontend/public/maps/sliit-campus-map.png`
- (Replace existing file or update path in component)

### Step 4: Test (5 mins)
- Navigate to any event detail page
- Verify stalls appear at correct positions
- Hover tooltips show: Stall #, Status, Category, Location, Vendor name
- Red = Reserved, Blue = Free

**Total time: ~20 minutes**

---

## Files Created / Modified

### New Files
```
frontend/src/utils/stallPositions.js          ← Stall coordinate config
frontend/src/utils/stallDataMapper.js         ← Data enrichment utility
STALL_MAP_IMPLEMENTATION_GUIDE.md             ← Detailed guide
STALL_COORDINATE_CALIBRATION_TEMPLATE.md      ← Measurement template
```

### Modified Files
```
frontend/src/components/events/VendorStallMap.jsx  ← Uses enrichment utility
```

### No Changes Needed
```
EventDetail.jsx, PublishedEventPage.jsx, VendorStallMap.css, etc.
```

---

## Key Features

| Feature | How It Works |
|---------|--------------|
| **Real Positions** | Each stall has fixed X/Y coordinates from your map image |
| **Auto Enrichment** | API stall data automatically merged with position config inside component |
| **Reusable Layout** | Same stall positions used for all events |
| **Reserved/Free Status** | Red = vendor assigned, Blue = unassigned |
| **Interactive Tooltips** | Hover shows Stall #, Category, Location, Vendor details |
| **Responsive** | Works on desktop, tablet, mobile |
| **Easy Updates** | Change coordinates anytime by editing `stallPositions.js` |
| **Backend Ready** | Can swap static config for database API call later |

---

## Configuration Format

Each stall in `stallPositions.js`:

```javascript
{
  stallNumber: 1,              // Unique ID (1-20)
  mapX: 15,                    // % from left edge (4-96)
  mapY: 20,                    // % from top edge (4-96)
  category: "Food & Beverage", // Service category
  description: "Location desc" // Admin reference
}
```

---

## Component Usage (No Changes Needed)

```javascript
// Just pass raw API stalls - enrichment happens inside VendorStallMap
<VendorStallMap 
  stalls={stalls}         // From API (no positions needed)
  loading={loading}
  error={error}
  title="Stall Allocation"
/>
```

---

## Data Flow

```
API Returns Raw Stall Data
     ↓
EventDetail / PublishedEventPage
     ↓
VendorStallMap (receives stalls)
     ↓
enrichStallsWithPositions() 
(merges with stallPositions config)
     ↓
Enriched Stalls (with mapX, mapY, category)
     ↓
Render Markers on Map
```

---

## Hover Tooltip Preview

```
┌──────────────────────────────┐
│ Stall 1                      │
│ Status: Available            │
│ Category: Food & Beverage    │
│ Location: Premium food area  │
│ Vendor: Unassigned           │
└──────────────────────────────┘
```

---

## Testing Checklist

- [ ] All 20 stalls visible on map
- [ ] Stalls at correct positions (match calibration)
- [ ] Reserved stalls = Red, Free stalls = Blue
- [ ] Tooltips show full details on hover
- [ ] Legend shows correct reserve/free counts
- [ ] Works on mobile/tablet/desktop
- [ ] Multiple events show same stall layout
- [ ] No stalls outside map boundaries

---

## Troubleshooting

**Stalls not visible?**
→ Check `stallPositions.js` has all 20 stalls  
→ Verify map image exists at `frontend/public/maps/sliit-campus-map.png`  
→ Check browser console for errors

**Wrong positions?**
→ Verify your coordinate measurements  
→ Ensure values are 4-96% (auto-clamped)  
→ Try browser DevTools: `document.querySelectorAll('[data-testid^="stall-"]')` to inspect

**Missing vendor info?**
→ Check API endpoint returns vendor data  
→ Verify stall vendor relationship in backend

---

## Examples: How to Use

### Basic Usage (Component)
```javascript
<VendorStallMap 
  stalls={stalls}
  title="Event Stalls"
  loading={loading}
/>
```

### Get Enriched Data Manually
```javascript
import { enrichStallsWithPositions } from '../../utils/stallDataMapper';

const enrichedStalls = enrichStallsWithPositions(apiStalls);
console.log(enrichedStalls[0]);
// { stallNumber: 1, mapX: 15, mapY: 20, category: "...", vendor: {...}, ... }
```

### Get Statistics
```javascript
import { calculateStallStatistics } from '../../utils/stallDataMapper';

const stats = calculateStallStatistics(enrichedStalls);
console.log(stats);
// { total: 20, reserved: 5, free: 15, reservationPct: 25, ... }
```

---

## Next Steps

1. **Measure stalls** on your new map (see calibration template)
2. **Update stallPositions.js** with coordinates
3. **Upload new map image** to public/maps/
4. **Test on event page** - verify appearance
5. **Go live!** 🚀

---

## Need More Info?

- **Detailed Guide**: See `STALL_MAP_IMPLEMENTATION_GUIDE.md`
- **Coordinate Calibration**: See `STALL_COORDINATE_CALIBRATION_TEMPLATE.md`
- **Code**: Check `frontend/src/utils/` and `frontend/src/components/events/`

---

**Happy stall allocation! 📍**
