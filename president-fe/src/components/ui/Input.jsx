export default function Input({ label, id, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          w-full px-3 py-2 rounded-md border text-sm
          bg-white dark:bg-primary-800
          border-gray-300 dark:border-primary-700
          text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent
          disabled:bg-gray-100 dark:disabled:bg-primary-900 disabled:cursor-not-allowed
          transition-colors
          ${error ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}
