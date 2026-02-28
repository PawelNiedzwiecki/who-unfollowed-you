import { CheckCircleIcon, CloudArrowUpIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";

interface UploadZoneProps {
  label: string;
  hint: string;
  file: File | null;
  onFile: (file: File) => void;
}

export default function UploadZone({
  label,
  hint,
  file,
  onFile,
}: UploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) onFile(dropped);
    },
    [onFile],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) onFile(selected);
    },
    [onFile],
  );

  const loaded = file !== null;

  return (
    <motion.button
      type="button"
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      animate={{
        scale: dragging ? 1.03 : 1,
      }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      className={`flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors ${
        loaded
          ? "border-success bg-success/10"
          : dragging
            ? "border-accent bg-accent/10"
            : "border-border hover:border-accent/50"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".html,.json"
        onChange={handleChange}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {loaded ? (
          <motion.div
            key="loaded"
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <CheckCircleIcon className="h-10 w-10 text-success" weight="regular" aria-hidden="true" />
            <span className="font-mono text-sm text-success">{file.name}</span>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <motion.span animate={{ color: dragging ? "var(--color-accent)" : "var(--color-text-muted)" }} transition={{ duration: 0.2 }}>
              <CloudArrowUpIcon className="h-10 w-10" weight="regular" aria-hidden="true" />
            </motion.span>
            <div className="text-center">
              <p className="text-sm font-medium text-text">{label}</p>
              <p className="mt-1 text-xs text-text-muted">{hint}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
