import { AnimatePresence, motion } from "framer-motion";

const toneMap = {
  success: {
    shell: "border-emerald-500/35 bg-emerald-500/15 text-emerald-100",
    dot: "bg-emerald-400",
  },
  error: {
    shell: "border-red-500/35 bg-red-500/15 text-red-100",
    dot: "bg-red-400",
  },
  warning: {
    shell: "border-amber-500/35 bg-amber-500/15 text-amber-100",
    dot: "bg-amber-400",
  },
  info: {
    shell: "border-blue-500/35 bg-blue-500/15 text-blue-100",
    dot: "bg-blue-400",
  },
};

export const FeedbackToast = ({ toast, onClose }) => {
  const tone = toneMap[toast?.type] || toneMap.info;

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="fixed top-5 right-5 z-[1600]"
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div
            className={`min-w-[260px] max-w-[360px] rounded-xl border px-4 py-3 shadow-xl ${tone.shell}`}
          >
            <div className="flex items-start gap-3">
              <span className={`mt-1 h-2.5 w-2.5 rounded-full ${tone.dot}`} />
              <p className="text-sm font-medium leading-5">{toast.message}</p>
              <button
                type="button"
                className="ml-auto text-xs opacity-70 hover:opacity-100"
                onClick={onClose}
                aria-label="Dismiss notification"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const FeedbackPanel = ({
  type = "info",
  title,
  message,
  actionLabel,
  onAction,
}) => {
  const tone = toneMap[type] || toneMap.info;

  return (
    <div className={`rounded-xl border px-5 py-4 ${tone.shell}`}>
      <p className="text-sm font-semibold">{title}</p>
      {message && <p className="mt-1 text-sm opacity-90">{message}</p>}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-3 rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold hover:bg-white/10 transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
