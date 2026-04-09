import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'

export default function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  function toggleDesktopSidebar() {
    setSidebarCollapsed((current) => !current)
  }

  function openMobileSidebar() {
    setMobileSidebarOpen(true)
  }

  function closeMobileSidebar() {
    setMobileSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-primary-950 transition-colors duration-200 lg:flex">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={closeMobileSidebar}
        onToggleDesktop={toggleDesktopSidebar}
      />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Navbar
          sidebarCollapsed={sidebarCollapsed}
          onToggleDesktopSidebar={toggleDesktopSidebar}
          onOpenMobileSidebar={openMobileSidebar}
        />
        <main className="flex-1 px-4 py-8 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
