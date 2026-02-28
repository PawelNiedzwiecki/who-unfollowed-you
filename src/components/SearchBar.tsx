import { MagnifyingGlassIcon } from "@phosphor-icons/react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search usernames…",
}: SearchBarProps) {
  return (
    <div className="relative">
      <MagnifyingGlassIcon
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
        weight="regular"
        aria-hidden="true"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-surface py-2 pl-10 pr-4 text-sm text-text placeholder-text-muted outline-none transition-colors focus:border-accent"
      />
    </div>
  );
}
