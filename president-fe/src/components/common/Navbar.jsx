import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Settings, User, LogOut, ChevronDown, Sun, Moon } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const NAV_LINKS = [
  { label: 'Dashboard',        to: '/dashboard'   },
  { label: 'Vendor',           to: '/vendor'      },
  { label: 'Sponsorship',      to: '/sponsorship' },
  { label: 'Stall Allocation', to: '/stall'       },
  { label: 'About',            to: '/about'       },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen]   = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function closeAll() {
    setProfileOpen(false)
    setSettingsOpen(false)
  }

  return (
    <header className="bg-primary-900 dark:bg-primary-950 border-b border-primary-800 dark:border-primary-900 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">

          {/* Left — Brand */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-tertiary tracking-tight select-none">
              Nexora
            </span>
          </div>

          {/* Center — Navigation links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-secondary-600 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right — Settings + Profile */}
          <div className="flex items-center gap-1">

            {/* Settings dropdown */}
            <div className="relative">
              <button
                onClick={() => { setSettingsOpen((v) => !v); setProfileOpen(false) }}
                className="p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Settings"
              >
                <Settings size={20} />
              </button>

              {settingsOpen && (
                <div className="absolute right-0 mt-1 w-56 bg-white dark:bg-primary-900 rounded-md shadow-lg border border-gray-200 dark:border-primary-700 py-2 z-10">
                  <p className="px-4 py-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Appearance
                  </p>
                  <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Sun size={15} className="text-secondary-600" />
                      <span>Light</span>
                    </div>

                    {/* Toggle switch */}
                    <button
                      onClick={toggleTheme}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        isDark ? 'bg-secondary-600' : 'bg-gray-300'
                      }`}
                      role="switch"
                      aria-checked={isDark}
                    >
                      <span
                        className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${
                          isDark ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>

                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span>Dark</span>
                      <Moon size={15} className="text-primary-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen((v) => !v); setSettingsOpen(false) }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="User menu"
              >
                <div className="w-7 h-7 rounded-full bg-secondary-600 flex items-center justify-center">
                  <User size={15} className="text-white" />
                </div>
                <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
                <ChevronDown size={14} className="text-white/50" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-primary-900 rounded-md shadow-lg border border-gray-200 dark:border-primary-700 py-1 z-10">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-primary-800">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut size={15} />
                    Sign out
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Click-outside overlay */}
      {(settingsOpen || profileOpen) && (
        <div className="fixed inset-0 z-0" onClick={closeAll} />
      )}
    </header>
  )
}
