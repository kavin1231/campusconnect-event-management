# Stall Coordinate Calibration Template

## Step 1: Get Your Map Image Dimensions

Before measuring stalls, determine your map image dimensions:

**Your map image file:** `sliit-campus-map.png`

**Image dimensions (measure in image editor or DevTools):**
- **Width:** _______ pixels
- **Height:** _______ pixels

---

## Step 2: Measure Each Stall Position

For each stall, measure the distance from:
- **mapX:** pixels from the **LEFT edge** to the center of the stall
- **mapY:** pixels from the **TOP edge** to the center of the stall

Then convert to percentages using:
```
mapX_percent = (distance_from_left / image_width) × 100
mapY_percent = (distance_from_top / image_height) × 100
```

---

## Calibration Spreadsheet

| Stall # | Pixel X | Pixel Y | mapX % | mapY % | Category | Location Description | Verified ✓ |
|---------|---------|---------|--------|--------|----------|----------------------|-----------|
| 1 | | | | | | | |
| 2 | | | | | | | |
| 3 | | | | | | | |
| 4 | | | | | | | |
| 5 | | | | | | | |
| 6 | | | | | | | |
| 7 | | | | | | | |
| 8 | | | | | | | |
| 9 | | | | | | | |
| 10 | | | | | | | |
| 11 | | | | | | | |
| 12 | | | | | | | |
| 13 | | | | | | | |
| 14 | | | | | | | |
| 15 | | | | | | | |
| 16 | | | | | | | |
| 17 | | | | | | | |
| 18 | | | | | | | |
| 19 | | | | | | | |
| 20 | | | | | | | |

---

## How to Measure Using Browser DevTools

1. Open your map image in a browser tab
2. Right-click → **Inspect** (or press F12)
3. Find the `<img>` tag: `<img src="..." alt="Stall map">`
4. In the console, run:
   ```javascript
   let img = document.querySelector('img[alt="Stall map"]');
   console.log('Width:', img.naturalWidth, 'Height:', img.naturalHeight);
   ```
5. This gives you the exact image dimensions
6. Use an online ruler or image editor to measure pixel positions of stalls

---

## How to Measure Using Image Editor (Photoshop/GIMP)

1. **Open** the map image in Photoshop, GIMP, or similar
2. **Enable rulers:** View → Rulers (or Shift+Ctrl+R)
3. **Select the pointer/measurement tool**
4. **For each stall:**
   - Click at the center of the stall marker
   - Note the X and Y coordinates shown in the rulers/status bar
5. **Record** the coordinates in the spreadsheet above
6. **Calculate** the percentages

---

## How to Measure Using Figma

1. **Upload** your map image to Figma
2. **Right-click** the image → Add component
3. **Select each stall** and check its X/Y coordinates in the properties panel
4. **Record** coordinates in spreadsheet
5. **Calculate** percentages using: (coordinate / dimension) × 100

---

## Example Calculation

**Given:**
- Map image: 1200px wide × 800px tall
- Stall #1 center: 180 pixels from left, 160 pixels from top

**Calculation:**
```
mapX = (180 / 1200) × 100 = 15%
mapY = (160 / 800) × 100 = 20%
```

**Clamp to bounds (4-96%):**
- 15% is within bounds ✓
- 20% is within bounds ✓

**Update stallPositions.js:**
```javascript
{
  stallNumber: 1,
  mapX: 15,    // ← your calculated value
  mapY: 20,    // ← your calculated value
  category: "Food & Beverage",
  description: "Premium food stall - North West corner"
}
```

---

## Quality Checklist

Before updating stallPositions.js, verify:

- [ ] All stall measurements taken from center of stall marker
- [ ] Pixel values measured correctly from map image edges
- [ ] Calculations double-checked (divide by dimension, multiply by 100)
- [ ] All percentages between 4-96%
- [ ] All 20 stalls have coordinates assigned
- [ ] Categories assigned to each stall
- [ ] Location descriptions are descriptive and accurate

---

## Categories Available

Common stall categories in the system:

- **Food & Beverage** - Food vendors, refreshments, beverages
- **Technology** - Tech booths, electronics, gadgets
- **Arts & Crafts** - Handmade items, art, design, merchandise
- **Services** - Consultation, information, support booths
- **General** - Miscellaneous/uncategorized

---

## Next Steps

1. ✅ Measure all stall positions using this template
2. ✅ Calculate percentages
3. ✅ Update `frontend/src/utils/stallPositions.js` with your values
4. ✅ Replace campus map image: `frontend/public/maps/sliit-campus-map.png`
5. ✅ Test on event page - verify stalls appear at correct positions

---

## Notes

- Values can be decimals (e.g., 15.5%, 20.3%) for better precision
- All values will be automatically clamped to 4-96% in the component
- Keep descriptions short and descriptive (for admin reference)
- You can always update coordinates later by editing stallPositions.js

