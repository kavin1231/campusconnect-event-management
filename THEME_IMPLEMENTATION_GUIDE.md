# Dark Mode & Light Mode Implementation Guide

## ✅ Completed Updates

### 1. **ThemeContext Setup** (`frontend/src/context/ThemeContext.jsx`)
- Created theme context with `isDarkMode` state
- Toggle function for switching between dark and light modes
- Persists theme preference to localStorage

### 2. **Main App Setup** (`frontend/src/main.jsx`)
- Wrapped app with `<ThemeProvider>` to provide theme context globally

### 3. **AdminDashboard** (`frontend/src/components/dashboard/AdminDashboard.jsx`)
- ✅ Full theme support implemented
- Added theme toggle button (Sun/Moon icons) in header
- Updated all sections: header, stat cards, tables, status sections
- Light mode colors:
  - Background: #F9FAFB (off-white)
  - Text: #053668 (navy)
  - Accents: #FF7100 (orange)
  - Buttons: #F7ECB5 (cream)

### 4. **OrganizerDashboard** (`frontend/src/components/dashboard/OrganizerDashboard.jsx`)
- ✅ Full theme support implemented
- Added theme toggle button
- Updated header, stat cards, and all sections
- Same light mode color scheme as AdminDashboard

---

## 🔄 How to Update Remaining Admin Sidebar Pages

Follow this pattern for each admin page component:

### Step 1: Import Theme Hook
```javascript
import { useTheme } from "../../context/ThemeContext";
```

### Step 2: Use Theme in Component
```javascript
const YourComponent = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  // ... rest of component
};
```

### Step 3: Add Theme Toggle Button (Optional)
In the header section, add:
```javascript
<motion.button
  onClick={toggleTheme}
  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 ${isDarkMode ? "bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 hover:bg-indigo-500/30" : "bg-[#FF7100]/20 border border-[#FF7100]/30 text-[#FF7100] hover:bg-[#FF7100]/30"} transition`}
  whileTap={{ scale: 0.98 }}
  title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
>
  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
</motion.button>
```

### Step 4: Update Tailwind Classes with Theme Conditions
Replace hardcoded dark colors with conditional classes:

**Dark theme colors to replace:**
- `bg-[#0B0F19]` → background
- `bg-[#111827]` → sections
- `text-slate-300` → text
- `text-white` → text
- `border-slate-700/70` → borders

**With:**
```javascript
className={`${isDarkMode ? "bg-[#0B0F19]" : "bg-[#F9FAFB]"}`}
className={`${isDarkMode ? "text-slate-300" : "text-[#053668]"}`}
className={`${isDarkMode ? "border-slate-700/70" : "border-[#FF7100]/30"}`}
```

---

## 🎨 Light Mode Color Palette

| Element | Color | Value |
|---------|-------|-------|
| Primary | Navy Blue | #053668 |
| Secondary | Orange | #FF7100 |
| Tertiary | Cream | #F7ECB5 |
| Neutral | Off-White | #F9FAFB |
| Text | Navy | #053668 |
| Accents | Orange | #FF7100 |

---

## 📋 Pages to Update with Theme Support

### Governance Pages
- [ ] GovernanceDashboard
- [ ] ClubOnboarding
- [ ] EventApproval
- [ ] PresidentApplicationManagement

### Logistics Pages
- [ ] LogisticsDashboard
- [ ] AssetManagement

### Analytics Pages
- [ ] AnalyticsOverview
- [ ] AnalyticsReports
- [ ] AnalyticsActivity

### Admin Pages
- [ ] UserManagement
- [ ] RoleManagement
- [ ] StudySupportAdmin
- [ ] GroupLinksManagement

---

## 🔧 Quick Reference: Update Pattern

For each section in a component, follow this pattern:

**Before (Dark Only):**
```jsx
<section className="rounded-2xl border border-slate-700/70 bg-[#111827] p-5">
  <h2 className="text-slate-300">Title</h2>
  <p className="text-slate-400">Content</p>
</section>
```

**After (Dark + Light):**
```jsx
<section className={`rounded-2xl border ${isDarkMode ? "border-slate-700/70 bg-[#111827]" : "border-[#FF7100]/30 bg-[#FFFFFF]"} p-5`}>
  <h2 className={`${isDarkMode ? "text-slate-300" : "text-[#053668]"}`}>Title</h2>
  <p className={`${isDarkMode ? "text-slate-400" : "text-[#FF7100]"}`}>Content</p>
</section>
```

---

## ✨ Notes

- Theme preference persists in localStorage
- Light mode should be the alternative to dark mode
- All sidebar pages should eventually support both themes
- Admin dashboard (AdminDashboard) serves as the primary template for theming approach
- Users can toggle theme anytime using the Sun/Moon button in the header

---

## 🚀 Next Steps

1. Apply theme support to remaining admin sidebar pages (listed above)
2. Test all pages in both dark and light modes
3. Ensure text contrast meets accessibility standards
4. Update any CSS files to work with theme context
5. Consider adding theme selection to user preferences
