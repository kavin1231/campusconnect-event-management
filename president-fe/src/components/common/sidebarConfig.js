import {
  LayoutGrid,
  BarChart3,
  CalendarDays,
  CalendarClock,
  Building2,
  Store,
  Handshake,
  Tent,
  Users,
  ClipboardList,
  Info,
} from 'lucide-react'

export const SIDEBAR_LINKS = [
  { label: 'Overview', to: '/overview', icon: LayoutGrid },
  { label: 'Dashboard', to: '/dashboard', icon: BarChart3 },
  { label: 'My Events', to: '/my-events', icon: CalendarDays },
  { label: 'Conflict Calendar', to: '/conflict-calendar', icon: CalendarClock },
  { label: 'Venues', to: '/venues', icon: Building2 },
  { label: 'Vendor', to: '/vendor', icon: Store },
  { label: 'Sponsorship', to: '/sponsorship', icon: Handshake },
  { label: 'Stall Allocation', to: '/stall', icon: Tent },
  { label: 'Staffing', to: '/staffing', icon: Users },
  { label: 'My Requests', to: '/my-requests', icon: ClipboardList },
  { label: 'About', to: '/about', icon: Info },
]
