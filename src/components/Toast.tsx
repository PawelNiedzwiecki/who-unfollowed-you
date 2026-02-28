import { WarningIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";

interface ToastProps {
  message: string | null;
}

export default function Toast({ message }: ToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          role="alert"
          className="fixed bottom-6 left-1/2 z-50 flex items-center gap-2.5 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-text shadow-lg"
          initial={{ opacity: 0, y: 16, x: "-50%", scale: 0.95 }}
          animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
          exit={{ opacity: 0, y: 10, x: "-50%", scale: 0.95 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
        >
          <WarningIcon className="h-4 w-4 shrink-0 text-amber-400" weight="fill" aria-hidden="true" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
