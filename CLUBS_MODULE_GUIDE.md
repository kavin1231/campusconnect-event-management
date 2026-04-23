# NEXORA Clubs Module Implementation Guide

## Overview
A professional, modern Clubs Module page has been created for your NEXORA frontend. The implementation follows your design specifications with a clean, minimal, and responsive layout.

## Files Created/Modified

### 1. **ClubsModule.jsx** - Main Page Component
- **Location**: `frontend/src/pages/ClubsModule.jsx`
- **Features**:
  - Responsive full-page layout with integrated navbar
  - Search functionality to filter clubs by name
  - Horizontal scrollable club tabs with theme color highlights
  - Large banner section with club logo, name, and member count
  - Club description with highlighted mission box
  - Leadership Team section (4-person grid)
  - Members/Committee section (responsive grid)
  - Smooth hover effects and transitions
  - Left/right scroll controls for club tabs

### 2. **clubsData.js** - Sample Data
- **Location**: `frontend/src/constants/clubsData.js`
- **Contains**: 30 clubs with complete data including:
  - Unique color theme for each club
  - Banner image URL
  - Club logo
  - Member count
  - Description and mission statement
  - Leadership team (4 members with roles)
  - Committee members/additional team members
  - All data uses Unsplash images for professional appearance

### 3. **App.jsx** - Updated Routes
- **Import Added**: `import { ClubsModule } from "./pages/ClubsModule";`
- **Route Added**: Protected route to `/clubs` with allowed roles
- **Accessible to**: STUDENT, CLUB_PRESIDENT, SYSTEM_ADMIN, EVENT_ORGANIZER

### 4. **Navbar.jsx** - Updated Navigation
- **Change**: Added "Clubs" to navigation link array
- **Navigation Array**: `["dashboard", "Dashboard"], ["create", "Events"], ["clubs", "Clubs"], ["venues", "Logistics"], ["requests", "Reports"]`

## 30 Clubs Included

1. Rotaract Club (#E74C3C)
2. Tech Club (#3498DB)
3. SLIIT Sports Council (#27AE60)
4. Arts & Culture (#9B59B6)
5. Science Club (#F39C12)
6. Photography Club (#1ABC9C)
7. Debate Society (#C0392B)
8. Music Club (#8E44AD)
9. Robotics Club (#E74C3C)
10. Student Council (#16A085)
11. Film Festival (#2C3E50)
12. Coding Bootcamp (#34495E)
13. News Club (#2980B9)
14. Drama Club (#D35400)
15. Art Club (#E67E22)
16. SLIIT FOSS Community (#27AE60)
17. SLIIT Robotics (#E74C3C)
18. SLIIT Mozi Club (#2C3E50)
19. SLIIT Leo Club (#8E44AD)
20. SLIIT IEEE Student Branch (#2980B9)
21. SLIIT Gavel Club (#C0392B)
22. SLIIT AIESEC (#F39C12)
23. SLIIT Arts Society (#9B59B6)
24. SLIIT Nature Club (#27AE60)
25. SLIIT Media Unit (#34495E)
26. SLIIT Gaming Community (#E74C3C)
27. Software Engineering Community (SEC) (#3498DB)
28. Interactive Media Association (IMA) (#E67E22)
29. Cyber Security Community (CSC) (#8E44AD)
30. Data Science Community (DSC) (#F39C12)

## Design Features

### Visual Design
- **Color Scheme**: Uses your NEXORA color constants (C.primary, C.secondary, etc.)
- **Typography**: Montserrat font with consistent sizing hierarchy
- **Spacing**: Clean 8pt/16pt/24pt spacing grid
- **Borders & Shadows**: Subtle 1px borders and soft shadows (0 1px 3px to 0 4px 12px)
- **Rounded Corners**: 8px-20px border radius for modern appearance
- **Theme Colors**: Each club has a unique color that appears in:
  - Club tab highlight
  - Mission box accent
  - Member avatar borders
  - Text highlights

### Interactive Elements
- **Tab Switching**: Smooth transitions when clicking club tabs
- **Hover Effects**: Cards lift on hover with shadow increase
- **Search**: Real-time filtering by club name
- **Scroll Controls**: Left/right arrow buttons appear when tabs overflow
- **Responsive**: Adapts to desktop, tablet, and mobile views

## How to Use

### Accessing the Page
1. Users click "Clubs" in the NEXORA navbar
2. Route navigates to `/clubs`
3. ClubsModule component renders with first club (Rotaract Club) selected

### User Interactions
1. **Search**: Type club name to filter the tab list
2. **Select Club**: Click any club tab to view its details
3. **Scroll Tabs**: Use arrow buttons or scroll horizontally to see more clubs
4. **View Details**: See full club info including leadership and members

## Connecting to Backend (Future)

### Current State
- Using sample data from `constants/clubsData.js`
- All images use Unsplash URLs (placeholder)

### To Connect Backend API
1. Replace sample data import with API call:
```javascript
// Replace CLUBS_DATA import with API fetch
const [clubs, setClubs] = useState([]);
useEffect(() => {
  // Fetch from your backend API
  fetch('/api/clubs')
    .then(res => res.json())
    .then(data => setClubs(data));
}, []);
```

2. Update backend data structure to match:
```javascript
{
  id: number,
  name: string,
  themeColor: string (hex),
  bannerImage: string (URL),
  logo: string (URL),
  memberCount: number,
  description: string,
  mission: string,
  leadership: [{
    name: string,
    role: string,
    subrole: string,
    avatar: string (URL)
  }],
  members: [{
    name: string,
    role: string,
    avatar: string (URL)
  }]
}
```

## Component Structure

### Main Component: ClubsModule
- **State Management**:
  - `selectedClub`: Current active club
  - `searchQuery`: Search input value
  - `tabsContainerRef`: Reference to scrollable tabs
  - `canScrollLeft/Right`: Scroll control visibility

- **Key Functions**:
  - `handleScroll()`: Manages scroll button visibility
  - `scroll(direction)`: Smooth scrolls through tabs
  - `filteredClubs`: Computed array based on search

### Sections
1. **Navbar** (Same as site navbar)
2. **Header** (Title + Subtitle)
3. **Search Bar** (Filter clubs)
4. **Club Tabs** (Scrollable pill buttons)
5. **Club Banner** (Hero section with cover image)
6. **Details Section** (Description + Mission)
7. **Leadership Team** (4-column grid)
8. **Members/Committee** (Auto-fit responsive grid)

## Styling Notes

### Color Usage
- Primary: `#053668` (Navy)
- Secondary: `#FF7100` (Orange)
- Theme Colors: Unique per club (30 different colors)
- Neutral: `#F9FAFB` (Off-white)
- Text: `#0D1F33` (Dark)
- Text Muted: `#5A7494` (Gray)

### Responsive Breakpoints
- **Desktop**: Full layout as designed
- **Tablet**: Adjusted grid columns (2-3)
- **Mobile**: Single column, stacked layout

## Performance Considerations

- Uses inline styles (consistent with your codebase)
- React hooks for efficient state management
- Event delegation for scroll handling
- Images from Unsplash (external CDN)
- Smooth scrolling behavior for better UX

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox support required
- CSS transitions for smooth effects

## Future Enhancements

1. **Backend Integration**: Connect to REST API for dynamic data
2. **User Interactions**: 
   - Join/Leave club functionality
   - Club event calendar
   - Member directory search
   - Contact leadership
3. **Admin Features**:
   - Edit club information
   - Manage members
   - Update leadership team
4. **Analytics**: Track club views, member growth
5. **Notifications**: Club announcements and events

## Testing Checklist

- [ ] Page loads without errors
- [ ] Search functionality filters clubs correctly
- [ ] Club tab switching updates all sections
- [ ] Scroll controls appear/disappear appropriately
- [ ] Images load correctly
- [ ] Responsive layout works on mobile
- [ ] Hover effects trigger smoothly
- [ ] Navigation from navbar works
- [ ] All 30 clubs display correct data
- [ ] Mission boxes show themed colors

## File Paths Summary

```
frontend/
├── src/
│   ├── pages/
│   │   └── ClubsModule.jsx (NEW)
│   ├── constants/
│   │   └── clubsData.js (NEW)
│   └── App.jsx (MODIFIED - added import + route)
│   └── components/common/
│       └── Navbar.jsx (MODIFIED - added "clubs" link)
```

## Support & Maintenance

- All code follows your existing style conventions
- Uses your color constants for consistency
- Modular design for easy updates
- Ready for backend API integration
- No external dependencies added

---

**Created**: 2026-04-10
**Status**: Ready for Use
**Next Steps**: Connect to backend API and customize images/data as needed
