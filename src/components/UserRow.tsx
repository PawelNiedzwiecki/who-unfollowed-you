import Avatar from "./Avatar";

interface UserRowProps {
  username: string;
  index: number;
}

export default function UserRow({ username, index }: UserRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:bg-surface-hover">
      <span className="w-8 shrink-0 text-right font-mono text-xs text-text-muted">
        {index}
      </span>
      <Avatar username={username} />
      <span className="min-w-0 flex-1 truncate font-mono text-sm text-text">
        {username}
      </span>
      <a
        href={`https://www.instagram.com/${username}/`}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-md border border-border px-3 py-1 text-xs font-medium text-text-muted transition-colors hover:border-accent hover:text-accent"
      >
        View ↗
      </a>
    </div>
  );
}
