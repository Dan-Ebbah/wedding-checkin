"use client";

import { useState, useEffect, useCallback } from "react";
import { Guest } from "../types/guest";

const STORAGE_KEY = "guestList";

const defaultGuests: Guest[] = [
  { id: 1, name: "Lady Sarah Montgomery", table: "1", checkedIn: true, vip: true },
  { id: 2, name: "Mr. Michael Chen", table: "2", checkedIn: false, vip: false },
  { id: 3, name: "Countess Emily Davis", table: "1", checkedIn: false, vip: true },
  { id: 4, name: "Lord James Wilson", table: "3", checkedIn: true, vip: true },
  { id: 5, name: "Ms. Olivia Brown", table: "2", checkedIn: false, vip: false },
  { id: 6, name: "Duke of Cambridge", table: "1", checkedIn: false, vip: true },
];

function isValidGuest(g: unknown): g is Guest {
  return (
    typeof g === "object" &&
    g !== null &&
    "id" in g &&
    "name" in g &&
    "table" in g &&
    "checkedIn" in g &&
    "vip" in g &&
    typeof (g as Guest).id === "number" &&
    typeof (g as Guest).name === "string" &&
    typeof (g as Guest).table === "string" &&
    typeof (g as Guest).checkedIn === "boolean" &&
    typeof (g as Guest).vip === "boolean"
  );
}

export function useGuestStorage() {
  const [guests, setGuests] = useState<Guest[]>(defaultGuests);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load guests from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.every(isValidGuest)) {
          setGuests(parsed);
        }
      }
    } catch (err) {
      console.error("Failed to load guest list from storage:", err);
      setError("Failed to load saved guest list");
    } finally {
      setInitialized(true);
    }
  }, []);

  // Persist guests to localStorage on any change after initialization
  useEffect(() => {
    if (!initialized) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
      setError(null);
    } catch (err) {
      console.error("Failed to save guest list to storage:", err);
      setError("Failed to save guest list");
    }
  }, [guests, initialized]);

  const getNextId = useCallback(() => {
    return guests.reduce((max, g) => Math.max(max, g.id), 0) + 1;
  }, [guests]);

  const addGuest = useCallback((guest: Omit<Guest, "id" | "checkedIn">) => {
    setGuests((prev) => [
      ...prev,
      { ...guest, id: prev.reduce((max, g) => Math.max(max, g.id), 0) + 1, checkedIn: false },
    ]);
  }, []);

  const addGuests = useCallback((newGuests: Omit<Guest, "id">[]) => {
    setGuests((prev) => {
      let nextId = prev.reduce((max, g) => Math.max(max, g.id), 0) + 1;
      const guestsWithIds = newGuests.map((g) => ({ ...g, id: nextId++ }));
      return [...prev, ...guestsWithIds];
    });
  }, []);

  const removeGuest = useCallback((id: number) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const toggleCheckIn = useCallback((id: number) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, checkedIn: !g.checkedIn } : g))
    );
  }, []);

  return {
    guests,
    initialized,
    error,
    getNextId,
    addGuest,
    addGuests,
    removeGuest,
    toggleCheckIn,
  };
}
