import { NavLink } from 'react-router-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { SIDEBAR_LINKS } from './sidebarConfig'

function SidebarLink({ item, collapsed, onNavigate }) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-secondary-600 text-white'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-primary-800/70'
        }`
      }
      title={collapsed ? item.label : undefined}
    >
      <Icon size={18} className="flex-shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </NavLink>
  )
}

export default function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleDesktop,
}) {
  const widthClass = collapsed ? 'w-20' : 'w-72'

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onCloseMobile}
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-40 border-r border-gray-200 bg-white dark:border-primary-800 dark:bg-primary-950 transition-transform duration-200 lg:relative lg:translate-x-0',
          widthClass,
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-primary-800">
          {!collapsed && (
            <span className="text-lg font-semibold tracking-tight text-primary-900 dark:text-white">
              President Panel
            </span>
          )}

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="hidden rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-primary-800 dark:hover:text-white lg:inline-flex"
              onClick={onToggleDesktop}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            <button
              type="button"
              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-primary-800 dark:hover:text-white lg:hidden"
              onClick={onCloseMobile}
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <nav className="space-y-1 p-3">
          {SIDEBAR_LINKS.map((item) => (
            <SidebarLink
              key={item.to}
              item={item}
              collapsed={collapsed}
              onNavigate={onCloseMobile}
            />
          ))}
        </nav>
      </aside>
    </>
  )
}
