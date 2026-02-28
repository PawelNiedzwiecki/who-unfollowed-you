import { CheckCircleIcon, CloudArrowUpIcon } from "@phosphor-icons/react";
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
    <button
      type="button"
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
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

      {loaded ? (
        <>
          <CheckCircleIcon className="h-10 w-10 text-success" weight="regular" aria-hidden="true" />
          <span className="font-mono text-sm text-success">{file.name}</span>
        </>
      ) : (
        <>
          <CloudArrowUpIcon className="h-10 w-10 text-text-muted" weight="regular" aria-hidden="true" />
          <div className="text-center">
            <p className="text-sm font-medium text-text">{label}</p>
            <p className="mt-1 text-xs text-text-muted">{hint}</p>
          </div>
        </>
      )}
    </button>
  );
}
