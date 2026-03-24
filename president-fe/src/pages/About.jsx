import { Info } from 'lucide-react'

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-full bg-secondary-100 dark:bg-secondary-900/20 flex items-center justify-center mb-4">
        <Info size={28} className="text-secondary-600" />
      </div>
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">About</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Information about Nexora and this platform.</p>
    </div>
  )
}
