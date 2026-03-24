const variants = {
  primary:   'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
  secondary: 'bg-white dark:bg-primary-800 text-primary-900 dark:text-gray-200 border border-gray-300 dark:border-primary-700 hover:bg-gray-50 dark:hover:bg-primary-700 focus:ring-secondary-500',
  danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  loading = false,
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium
        transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant] ?? variants.primary}
        ${className}
      `}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : null}
      {children}
    </button>
  )
}
