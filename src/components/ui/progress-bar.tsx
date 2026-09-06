export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={`h-2 w-full rounded-full bg-ivory-200 overflow-hidden ${className ?? ""}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold transition-all duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
