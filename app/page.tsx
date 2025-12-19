"use client";

import { useState, useEffect } from "react";
import * as XLSX from 'xlsx';

const sampleGuests = [
  { id: 1, name: "Lady Sarah Montgomery", table: "1", checkedIn: true, vip: true },
  { id: 2, name: "Mr. Michael Chen", table: "2", checkedIn: false, vip: false },
  { id: 3, name: "Countess Emily Davis", table: "1", checkedIn: false, vip: true },
  { id: 4, name: "Lord James Wilson", table: "3", checkedIn: true, vip: true },
  { id: 5, name: "Ms. Olivia Brown", table: "2", checkedIn: false, vip: false },
  { id: 6, name: "Duke of Cambridge", table: "1", checkedIn: false, vip: true },
];

type Guest = {
  id: number;
  name: string;
  table: string;
  checkedIn: boolean;
  vip: boolean;
};

const CrownIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
  </svg>
);


const OrnateDivider = () => (
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

export default function Home() {
  // Start with sample; load from localStorage after mount to avoid hydration mismatch
  const [guests, setGuests] = useState<Guest[]>(sampleGuests);
  const [searchQuery, setSearchQuery] = useState("");
  const [initialized, setInitialized] = useState(false);

  // Load guests from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('guestList');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const valid = parsed.every((g: any) =>
            g && typeof g === 'object' && 'id' in g && 'name' in g && 'table' in g
          );
          if (valid) setGuests(parsed as Guest[]);
        }
      }
    } catch (_) {
      // ignore and keep sampleGuests
    } finally {
      setInitialized(true);
    }
  }, []);

  // Persist guests to localStorage on any change after initialization
  useEffect(() => {
    if (!initialized) return;
    try {
      localStorage.setItem('guestList', JSON.stringify(guests));
    } catch (_) {
      // ignore write errors (e.g., storage full or disabled)
    }
  }, [guests, initialized]);

  const handleRemoveGuest = (id: number) => {
    setGuests(guests.filter((g) => g.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.target;
    const file = inputEl.files?.[0];
    if (!file) return;

    const isCSV = file.name.toLowerCase().endsWith('.csv');
    const reader = new FileReader();

    reader.onload = (evt) => {
      const result = evt.target?.result;
      if (result == null) return;
      try {
        let workbook: XLSX.WorkBook | null = null;
        if (isCSV && typeof result === 'string') {
          workbook = XLSX.read(result, { type: 'string' });
        } else if (!isCSV && result instanceof ArrayBuffer) {
          workbook = XLSX.read(result, { type: 'array' });
        }
        if (!workbook) return;

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Compute next unique ID start to avoid collisions after deletions
        const nextIdStart = guests.reduce((max, g) => Math.max(max, g.id), 0) + 1;

        const newGuests: Guest[] = jsonData.slice(1).map((row, index) => ({
          id: nextIdStart + index,
          name: row?.[0] || `Guest ${nextIdStart + index}`,
          table: row?.[1] ? String(row[1]) : "Unassigned",
          checkedIn: false,
          vip: String(row?.[2] ?? '').toUpperCase() === 'VIP',
        }));

        setGuests((prev) => [...prev, ...newGuests]);
      } catch (err) {
        console.error('Failed to parse uploaded file', err);
      } finally {
        // Allow uploading the same file again if needed
        inputEl.value = '';
      }
    };

    if (isCSV) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const handleCheckIn = (id: number) => {
    setGuests(guests.map((g) => (g.id === id ? { ...g, checkedIn: !g.checkedIn } : g)));
  };

  const filteredGuests = guests.filter((guest) =>
    guest.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const checkedInCount = guests.filter((g) => g.checkedIn).length;
  const vipCount = guests.filter((g) => g.vip).length;

  return (
    <main className="min-h-screen bg-[var(--background)] royal-pattern">
      {/* Royal Header */}
      <header className="relative pt-12 pb-8 px-4 text-center">
        {/* Top ornament */}
        <div className="flex justify-center mb-6">
          <CrownIcon className="w-10 h-10 text-[var(--gold)]" />
        </div>

        {/* Subtitle */}
        <p className="font-display text-xs tracking-[0.5em] uppercase text-[var(--gold-dim)] mb-4">
          The Wedding of
        </p>

        {/* Names */}
        <h1 className="font-display text-4xl md:text-6xl text-[var(--foreground)] tracking-[0.15em] mb-2">
          ANGEL & NELSON
        </h1>

        {/* Date */}
        <p className="text-lg text-[var(--muted)] tracking-[0.15em] italic mt-4">
          20 DECEMBER 2025
        </p>

        <OrnateDivider />

        <p className="font-display text-sm tracking-[0.3em] uppercase text-[var(--gold)]">
          Guest Registry
        </p>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-16 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="space-y-6 order-2 lg:order-1">
          {/* Royal Crest / Stats */}
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
                  <p className="text-3xl text-[var(--foreground)]">{guests.length}</p>
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
                    <p className="text-2xl text-[var(--foreground)]">{guests.length - checkedInCount}</p>
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

          {/* Import */}
          <div className="bg-[var(--surface)] rounded-sm border border-[var(--border)] p-5">
            <h2 className="font-display text-[10px] tracking-[0.3em] uppercase text-[var(--muted)] text-center mb-4">
              Import Registry
            </h2>
            <label className="upload-zone block rounded-sm p-5 cursor-pointer bg-[var(--background)]">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="text-center">
                <svg
                  className="w-6 h-6 mx-auto mb-2 text-[var(--gold)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                <p className="text-sm text-[var(--foreground)]">Upload List</p>
                <p className="text-xs text-[var(--muted)] mt-1">CSV or Excel</p>
              </div>
            </label>
          </div>

          {/* Add Guest */}
          <button className="w-full py-3 bg-[var(--surface)] rounded-sm border border-[var(--gold-dim)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--background)] transition-all font-display text-xs tracking-[0.2em] uppercase">
            + Add Guest
          </button>
        </aside>

        {/* Main Content */}
        <div className="order-1 lg:order-2">
          <div className="bg-[var(--surface)] rounded-sm border border-[var(--border)]">
            {/* Search Header */}
            <div className="p-6 border-b border-[var(--border)]">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search the registry..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--gold-dim)] transition-colors"
                />
              </div>
            </div>

            {/* Guest List */}
            <div className="p-4">
              {filteredGuests.length === 0 ? (
                <div className="text-center py-20 text-[var(--muted)]">
                  <p className="text-xl italic">No guests found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredGuests.map((guest) => (
                    <div
                      key={guest.id}
                      className={`guest-card flex items-center justify-between p-5 rounded-sm border border-[var(--border)] bg-[var(--background)] ${
                        guest.vip ? "vip-card" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Check-in */}
                        <button
                          onClick={() => handleCheckIn(guest.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            guest.checkedIn
                              ? "bg-[var(--gold)] border-[var(--gold)]"
                              : "border-[var(--border)] hover:border-[var(--gold-dim)]"
                          }`}
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

                        {/* Guest Info */}
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
                        {/* Table */}
                        <div className="text-center min-w-[70px]">
                          <p className="text-[10px] uppercase tracking-widest text-[var(--muted)]">
                            Table
                          </p>
                          <p className="text-2xl font-display text-[var(--gold)]">
                            {guest.table}
                          </p>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => handleRemoveGuest(guest.id)}
                          className="p-2 text-[var(--muted)] hover:text-red-400 transition-colors"
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
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Royal Footer */}
      <footer className="py-10 text-center border-t border-[var(--border)]">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[var(--gold-dim)]" />
          <CrownIcon className="w-5 h-5 text-[var(--gold-dim)]" />
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[var(--gold-dim)]" />
        </div>
        <p className="font-display text-sm tracking-[0.3em] uppercase text-[var(--muted)]">
          A Royal Celebration
        </p>
        <p className="text-xs text-[var(--muted)] mt-2 italic">
          "Two hearts, one crown"
        </p>
      </footer>
    </main>
  );
}
