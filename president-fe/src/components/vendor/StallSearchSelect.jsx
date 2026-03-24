import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'

export default function StallSearchSelect({
  label,
  id,
  value,
  options,
  error,
  onChange,
  placeholder = 'Search stall',
}) {
  const rootRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')

  const selected = useMemo(
    () => options.find((option) => option.id === value) || null,
    [options, value]
  )

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    if (!normalized) {
      return options.slice(0, 5)
    }

    return options
      .filter((option) => {
        const byName = option.stall_name.toLowerCase().includes(normalized)
        const byId = String(option.id).includes(normalized)
        return byName || byId
      })
      .slice(0, 5)
  }, [options, query])

  useEffect(() => {
    setQuery(selected?.stall_name ?? '')
  }, [selected])

  useEffect(() => {
    function handleOutside(event) {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  return (
    <div className="flex flex-col gap-1" ref={rootRef}>
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      ) : null}

      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={15} />
        </div>

        <input
          id={id}
          type="text"
          value={query}
          placeholder={placeholder}
          onFocus={() => setIsOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value)
            setIsOpen(true)
            if (value !== null) {
              onChange(null)
            }
          }}
          className={`
            w-full rounded-md border bg-white py-2 pl-9 pr-9 text-sm
            text-gray-900 placeholder-gray-400 transition-colors
            focus:border-transparent focus:outline-none focus:ring-2 focus:ring-secondary-500
            dark:bg-primary-800 dark:text-white dark:placeholder-gray-500
            ${error ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-primary-700'}
          `}
          aria-autocomplete="list"
          aria-expanded={isOpen}
        />

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-primary-700"
          aria-label="Toggle stall options"
        >
          <ChevronDown size={16} className={isOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
        </button>

        {isOpen ? (
          <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-primary-700 dark:bg-primary-900">
            {filtered.length ? (
              filtered.map((option) => (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.id)
                      setQuery(option.stall_name)
                      setIsOpen(false)
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-primary-800"
                  >
                    <span>{option.stall_name}</span>
                    <span className="text-xs text-gray-400">#{option.id}</span>
                  </button>
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">No matching stalls</li>
            )}
          </ul>
        ) : null}
      </div>

      {error ? <p className="text-xs text-red-600 dark:text-red-400">{error}</p> : null}
    </div>
  )
}
