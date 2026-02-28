import { MoonIcon, SunIcon } from "@phosphor-icons/react";

interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="cursor-pointer rounded-lg border border-border p-2 text-text-muted transition-colors hover:border-accent hover:text-accent"
    >
      {theme === "dark" ? (
        <SunIcon className="h-4 w-4" weight="regular" aria-hidden="true" />
      ) : (
        <MoonIcon className="h-4 w-4" weight="regular" aria-hidden="true" />
      )}
    </button>
  );
}
