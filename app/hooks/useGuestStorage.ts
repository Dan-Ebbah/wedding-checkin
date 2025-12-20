"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { Guest } from "../types/guest";
import { GuestRow } from "../types/database";

function mapRowToGuest(row: GuestRow): Guest {
  return {
    id: row.id,
    name: row.name,
    table: row.table_number,
    checkedIn: row.checked_in,
    vip: row.vip,
  };
}

export function useGuestStorage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch guests from Supabase on mount
  useEffect(() => {
    async function fetchGuests() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from("guests")
          .select("*")
          .order("created_at", { ascending: true });

        if (fetchError) {
          throw fetchError;
        }

        setGuests(data?.map(mapRowToGuest) || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch guests:", err);
        setError("Failed to load guest list");
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    }

    fetchGuests();
  }, []);

  const addGuest = useCallback(async (guest: Omit<Guest, "id" | "checkedIn">) => {
    try {
      const { data, error: insertError } = await supabase
        .from("guests")
        .insert({
          name: guest.name,
          table_number: guest.table,
          checked_in: false,
          vip: guest.vip,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      if (data) {
        setGuests((prev) => [...prev, mapRowToGuest(data)]);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to add guest:", err);
      setError("Failed to add guest");
    }
  }, []);

  const addGuests = useCallback(async (newGuests: Omit<Guest, "id">[]) => {
    try {
      const guestsToInsert = newGuests.map((g) => ({
        name: g.name,
        table_number: g.table,
        checked_in: g.checkedIn,
        vip: g.vip,
      }));

      const { data, error: insertError } = await supabase
        .from("guests")
        .insert(guestsToInsert)
        .select();

      if (insertError) throw insertError;

      if (data) {
        setGuests((prev) => [...prev, ...data.map(mapRowToGuest)]);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to add guests:", err);
      setError("Failed to import guests");
    }
  }, []);

  const removeGuest = useCallback(async (id: number) => {
    // Optimistic update
    const previousGuests = guests;
    setGuests((prev) => prev.filter((g) => g.id !== id));

    try {
      const { error: deleteError } = await supabase
        .from("guests")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;
      setError(null);
    } catch (err) {
      console.error("Failed to remove guest:", err);
      setError("Failed to remove guest");
      // Rollback on error
      setGuests(previousGuests);
    }
  }, [guests]);

  const toggleCheckIn = useCallback(async (id: number) => {
    const guest = guests.find((g) => g.id === id);
    if (!guest) return;

    const newCheckedIn = !guest.checkedIn;

    // Optimistic update
    setGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, checkedIn: newCheckedIn } : g))
    );

    try {
      const { error: updateError } = await supabase
        .from("guests")
        .update({ checked_in: newCheckedIn, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (updateError) throw updateError;
      setError(null);
    } catch (err) {
      console.error("Failed to update check-in status:", err);
      setError("Failed to update guest");
      // Rollback on error
      setGuests((prev) =>
        prev.map((g) => (g.id === id ? { ...g, checkedIn: !newCheckedIn } : g))
      );
    }
  }, [guests]);

  return {
    guests,
    initialized,
    loading,
    error,
    addGuest,
    addGuests,
    removeGuest,
    toggleCheckIn,
  };
}
