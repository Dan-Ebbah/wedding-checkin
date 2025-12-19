export function OrnateDivider() {
  return (
    <div className="flex items-center justify-center gap-4 my-6">
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--gold-dim)]" />
      <div className="flex items-center gap-2">
        <span className="text-[var(--gold)] text-sm">&#9830;</span>
        <span className="text-[var(--gold)] text-lg">&#9733;</span>
        <span className="text-[var(--gold)] text-sm">&#9830;</span>
      </div>
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--gold-dim)]" />
    </div>
  );
}
