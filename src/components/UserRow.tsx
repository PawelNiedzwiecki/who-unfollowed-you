import { motion } from "motion/react";
import Avatar from "./Avatar";

interface UserRowProps {
  username: string;
  index: number;
  animationDelay?: number;
}

export default function UserRow({
  username,
  index,
  animationDelay = 0,
}: UserRowProps) {
  return (
    <motion.div
      className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.22,
        ease: "easeOut",
        delay: animationDelay / 1000,
      }}
      whileHover={{ backgroundColor: "var(--color-surface-hover)" }}
    >
      <span className="w-8 shrink-0 text-right font-mono text-xs text-text-muted">
        {index}
      </span>
      <Avatar username={username} />
      <span className="min-w-0 flex-1 truncate font-mono text-sm text-text">
        {username}
      </span>
      <motion.a
        href={`https://www.instagram.com/${username}/`}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-md border border-border px-3 py-1 text-xs font-medium text-text-muted transition-colors hover:border-accent hover:text-accent"
        whileTap={{ scale: 0.93 }}
      >
        View ↗
      </motion.a>
    </motion.div>
  );
}
