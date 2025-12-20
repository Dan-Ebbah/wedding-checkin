"use client";

import { useState, ChangeEvent } from "react";
import * as XLSX from "xlsx";
import { Guest, GuestRow } from "./types/guest";
import { useGuestStorage } from "./hooks/useGuestStorage";
import {
  CrownIcon,
  OrnateDivider,
  GuestCard,
  StatsPanel,
  FileUpload,
  SearchBar,
  AddGuestModal,
  Pagination,
} from "./components";

const GUESTS_PER_PAGE = 10;

export default function Home() {
  const {
    guests,
    initialized,
    loading,
    error,
    addGuest,
    addGuests,
    removeGuest,
    toggleCheckIn,
  } = useGuestStorage();

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.target;
    const file = inputEl.files?.[0];
    if (!file) return;

    const isCSV = file.name.toLowerCase().endsWith(".csv");
    const reader = new FileReader();

    reader.onload = (evt) => {
      const result = evt.target?.result;
      if (result == null) return;

      try {
        let workbook: XLSX.WorkBook | null = null;

        if (isCSV && typeof result === "string") {
          workbook = XLSX.read(result, { type: "string" });
        } else if (!isCSV && result instanceof ArrayBuffer) {
          workbook = XLSX.read(result, { type: "array" });
        }

        if (!workbook) return;

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json<GuestRow>(worksheet, {
          header: 1,
        });

        const newGuests: Omit<Guest, "id">[] = jsonData.slice(1).map((row, index) => ({
          name: row?.[0]?.toString().trim() || `Guest ${index + 1}`,
          table: row?.[1] ? String(row[1]) : "Unassigned",
          checkedIn: false,
          vip: String(row?.[2] ?? "").toUpperCase() === "VIP",
        }));

        addGuests(newGuests);
      } catch (err) {
        console.error("Failed to parse uploaded file:", err);
        alert("Failed to parse uploaded file. Please check the format.");
      } finally {
        inputEl.value = "";
      }
    };

    reader.onerror = () => {
      alert("Failed to read file. Please try again.");
    };

    if (isCSV) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const handleAddGuest = (guest: { name: string; table: string; vip: boolean }) => {
    addGuest(guest);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const filteredGuests = guests.filter((guest) =>
    guest.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredGuests.length / GUESTS_PER_PAGE);
  const startIndex = (currentPage - 1) * GUESTS_PER_PAGE;
  const paginatedGuests = filteredGuests.slice(startIndex, startIndex + GUESTS_PER_PAGE);

  const checkedInCount = guests.filter((g) => g.checkedIn).length;
  const vipCount = guests.filter((g) => g.vip).length;

  if (!initialized || loading) {
    return (
      <main className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <CrownIcon className="w-12 h-12 text-[var(--gold)] mx-auto mb-4 animate-pulse" />
          <p className="text-[var(--muted)]">Loading guest registry...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] royal-pattern">
      {/* Error notification */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-900/80 text-red-200 px-4 py-2 rounded-sm text-sm z-50">
          {error}
        </div>
      )}

      {/* Royal Header */}
      <header className="relative pt-12 pb-8 px-4 text-center">
        <div className="flex justify-center mb-6">
          <CrownIcon className="w-10 h-10 text-[var(--gold)]" />
        </div>

        <p className="font-display text-xs tracking-[0.5em] uppercase text-[var(--gold-dim)] mb-4">
          The Wedding of
        </p>

        <h1 className="font-display text-4xl md:text-6xl text-[var(--foreground)] tracking-[0.15em] mb-2">
          ANGEL & NELSON
        </h1>

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
          <StatsPanel
            totalGuests={guests.length}
            checkedInCount={checkedInCount}
            vipCount={vipCount}
          />

          <FileUpload onFileUpload={handleFileUpload} />

          <button
            onClick={() => setShowAddModal(true)}
            className="w-full py-3 bg-[var(--surface)] rounded-sm border border-[var(--gold-dim)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--background)] transition-all font-display text-xs tracking-[0.2em] uppercase"
          >
            + Add Guest
          </button>
        </aside>

        {/* Main Content */}
        <div className="order-1 lg:order-2">
          <div className="bg-[var(--surface)] rounded-sm border border-[var(--border)]">
            {/* Search Header */}
            <div className="p-6 border-b border-[var(--border)]">
              <SearchBar value={searchQuery} onChange={handleSearchChange} />
            </div>

            {/* Guest List */}
            <div className="p-4">
              {filteredGuests.length === 0 ? (
                <div className="text-center py-20 text-[var(--muted)]">
                  <p className="text-xl italic">No guests found</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {paginatedGuests.map((guest) => (
                      <GuestCard
                        key={guest.id}
                        guest={guest}
                        onCheckIn={toggleCheckIn}
                        onRemove={removeGuest}
                      />
                    ))}
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                  {filteredGuests.length > GUESTS_PER_PAGE && (
                    <p className="text-center text-xs text-[var(--muted)] mt-4">
                      Showing {startIndex + 1}-{Math.min(startIndex + GUESTS_PER_PAGE, filteredGuests.length)} of {filteredGuests.length} guests
                    </p>
                  )}
                </>
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
          &quot;Two hearts, one crown&quot;
        </p>
      </footer>

      {/* Add Guest Modal */}
      <AddGuestModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddGuest}
      />
    </main>
  );
}
