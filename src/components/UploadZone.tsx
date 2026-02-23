import { useCallback, useRef, useState } from "react";

interface UploadZoneProps {
  label: string;
  hint: string;
  file: File | null;
  onFile: (file: File) => void;
}

export default function UploadZone({ label, hint, file, onFile }: UploadZoneProps) {
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
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors ${
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
        accept=".html"
        onChange={handleChange}
        className="hidden"
      />

      {loaded ? (
        <>
          <svg
            className="h-10 w-10 text-success"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="font-mono text-sm text-success">{file.name}</span>
        </>
      ) : (
        <>
          <svg
            className="h-10 w-10 text-text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <div className="text-center">
            <p className="text-sm font-medium text-text">{label}</p>
            <p className="mt-1 text-xs text-text-muted">{hint}</p>
          </div>
        </>
      )}
    </div>
  );
}
