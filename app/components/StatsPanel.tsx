import { CrownIcon } from "./CrownIcon";

type StatsPanelProps = {
  totalGuests: number;
  checkedInCount: number;
  vipCount: number;
};

export function StatsPanel({ totalGuests, checkedInCount, vipCount }: StatsPanelProps) {
  return (
    <div className="bg-[var(--surface)] rounded-sm border border-[var(--gold-dim)] overflow-hidden">
      <div className="bg-gradient-to-b from-[var(--surface-elevated)] to-[var(--surface)] border-b border-[var(--gold-dim)] p-4 text-center">
        <CrownIcon className="w-8 h-8 mx-auto text-[var(--gold)]" />
      </div>
      <div className="p-6">
        <h2 className="font-display text-[10px] tracking-[0.3em] uppercase text-[var(--muted)] text-center mb-6">
          Registry Overview
        </h2>
        <div className="space-y-5">
          <div className="text-center">
            <p className="text-3xl text-[var(--foreground)]">{totalGuests}</p>
            <p className="text-xs uppercase tracking-widest text-[var(--muted)] mt-1">
              Invited Guests
            </p>
          </div>
          <div className="h-px bg-[var(--border)]" />
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl text-[var(--gold)]">{checkedInCount}</p>
              <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] mt-1">
                Arrived
              </p>
            </div>
            <div>
              <p className="text-2xl text-[var(--foreground)]">{totalGuests - checkedInCount}</p>
              <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] mt-1">
                Awaited
              </p>
            </div>
          </div>
          <div className="h-px bg-[var(--border)]" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <CrownIcon className="w-4 h-4 text-[var(--gold)]" />
              <p className="text-2xl text-[var(--gold)]">{vipCount}</p>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] mt-1">
              VIP Guests
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
