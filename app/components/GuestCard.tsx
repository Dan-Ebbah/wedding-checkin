import { Guest } from "../types/guest";
import { CrownIcon } from "./CrownIcon";

type GuestCardProps = {
  guest: Guest;
  onCheckIn: (id: number) => void;
  onRemove: (id: number) => void;
};

export function GuestCard({ guest, onCheckIn, onRemove }: GuestCardProps) {
  return (
    <div
      className={`guest-card flex items-center justify-between p-5 rounded-sm border border-[var(--border)] bg-[var(--background)] ${
        guest.vip ? "vip-card" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => onCheckIn(guest.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            guest.checkedIn
              ? "bg-[var(--gold)] border-[var(--gold)]"
              : "border-[var(--border)] hover:border-[var(--gold-dim)]"
          }`}
          aria-label={guest.checkedIn ? "Uncheck guest" : "Check in guest"}
        >
          {guest.checkedIn && (
            <svg
              className="w-3 h-3 text-[var(--background)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        <div>
          <div className="flex items-center gap-3">
            <span
              className={`text-lg ${
                guest.checkedIn
                  ? "text-[var(--muted)]"
                  : "text-[var(--foreground)]"
              }`}
            >
              {guest.name}
            </span>
            {guest.vip && (
              <div className="flex items-center gap-1 px-2 py-1 bg-[var(--gold)] bg-opacity-10 rounded-sm">
                <CrownIcon className="w-3 h-3 text-[var(--white)]" />
                <span className="text-[10px] uppercase tracking-wider text-[var(--white)] font-medium">
                  VIP
                </span>
              </div>
            )}
          </div>
          {guest.checkedIn && (
            <p className="text-xs text-[var(--gold-dim)] mt-1 italic">
              Arrived
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-center min-w-[70px]">
          <p className="text-[10px] uppercase tracking-widest text-[var(--muted)]">
            Table
          </p>
          <p className="text-2xl font-display text-[var(--gold)]">
            {guest.table}
          </p>
        </div>

        <button
          onClick={() => onRemove(guest.id)}
          className="p-2 text-[var(--muted)] hover:text-red-400 transition-colors"
          aria-label="Remove guest"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
