interface StatCardProps {
  label: string;
  value: number;
  accent?: boolean;
}

export default function StatCard({ label, value, accent }: StatCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-surface px-4 py-3">
      <span className="text-xs font-medium text-text-muted">{label}</span>
      <span
        className={`font-mono text-2xl font-medium ${accent ? "text-accent" : "text-text"}`}
      >
        {value.toLocaleString()}
      </span>
    </div>
  );
}
