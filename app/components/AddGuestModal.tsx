"use client";

import { useState } from "react";

type AddGuestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (guest: { name: string; table: string; vip: boolean }) => void;
};

export function AddGuestModal({ isOpen, onClose, onAdd }: AddGuestModalProps) {
  const [name, setName] = useState("");
  const [table, setTable] = useState("");
  const [vip, setVip] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      table: table.trim() || "Unassigned",
      vip,
    });

    setName("");
    setTable("");
    setVip(false);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-[var(--surface)] border border-[var(--gold-dim)] rounded-sm p-6 w-full max-w-md mx-4">
        <h2 className="font-display text-lg tracking-[0.2em] uppercase text-[var(--gold)] text-center mb-6">
          Add Guest
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
              Guest Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--gold-dim)] transition-colors"
              placeholder="Enter guest name"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
              Table Number
            </label>
            <input
              type="text"
              value={table}
              onChange={(e) => setTable(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--gold-dim)] transition-colors"
              placeholder="Enter table number"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setVip(!vip)}
              className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center transition-all ${
                vip
                  ? "bg-[var(--gold)] border-[var(--gold)]"
                  : "border-[var(--border)] hover:border-[var(--gold-dim)]"
              }`}
            >
              {vip && (
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
            <label className="text-sm text-[var(--foreground)]">VIP Guest</label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-[var(--background)] border border-[var(--border)] rounded-sm text-[var(--muted)] hover:border-[var(--gold-dim)] transition-colors font-display text-xs tracking-[0.2em] uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[var(--gold)] rounded-sm text-[var(--background)] hover:bg-[var(--gold-light)] transition-colors font-display text-xs tracking-[0.2em] uppercase"
            >
              Add Guest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
