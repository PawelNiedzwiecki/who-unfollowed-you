import { motion } from "motion/react";

interface StatCardProps {
  label: string;
  value: number;
  accent?: boolean;
}

export default function StatCard({ label, value, accent }: StatCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-surface px-4 py-3">
      <span className="text-xs font-medium text-text-muted">{label}</span>
      <motion.span
        className={`font-mono text-2xl font-medium ${accent ? "text-accent" : "text-text"}`}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
      >
        {value.toLocaleString()}
      </motion.span>
    </div>
  );
}
