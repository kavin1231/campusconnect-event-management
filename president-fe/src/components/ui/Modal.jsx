import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ isOpen, title, onClose, children, className = '' }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    function handleEsc(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal backdrop"
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        className={`
          relative w-full max-w-2xl rounded-xl border border-gray-200 dark:border-primary-700
          bg-white dark:bg-primary-900 shadow-xl
          ${className}
        `}
      >
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-primary-700 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-primary-800 dark:hover:text-white"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
