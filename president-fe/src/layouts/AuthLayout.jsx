export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-700 to-secondary-500 dark:from-primary-950 dark:to-primary-900 px-4 transition-colors duration-200">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
