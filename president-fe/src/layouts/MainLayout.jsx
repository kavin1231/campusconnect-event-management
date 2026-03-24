import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-primary-950 transition-colors duration-200">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <Outlet />
      </main>
    </div>
  )
}
