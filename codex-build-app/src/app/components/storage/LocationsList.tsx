"use client";

import { useEffect, useState } from "react";
import { LocationCard } from "./LocationCard";
import { fetchLocations } from "../../lib/storageService";
import { useLocationStore } from "../../store/locationStore";
import type { StorageLocation } from "../../types";

interface LocationsListProps {
  /**
   * Optional callback fired when a location is selected. If provided, each
   * location card becomes clickable and the location object is passed to this
   * callback when clicked.
   */
  onSelectLocation?: (loc: StorageLocation) => void;
}

export function LocationsList({ onSelectLocation }: LocationsListProps) {
  const { locations, setLocations } = useLocationStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false); // Local flag to prevent refetching

  useEffect(() => {
    // Skip fetching if we've already loaded successfully
    if (hasLoaded) return;
    
    let active = true;
    
    const loadLocations = async () => {
      try {
        const locs = await fetchLocations();
        if (!active) return;
        setLocations(locs);
        setHasLoaded(true); // Mark as loaded
      } catch (err) {
        console.error(err);
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load locations");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadLocations();

    return () => {
      active = false;
    };
  }, [setLocations, hasLoaded]); // hasLoaded prevents re-runs after initial load // setLocations is now stable with useCallback

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  if (locations.length === 0) {
    return <div>No locations available.</div>;
  }

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      {locations.map((loc) => (
        <div
          key={loc._id}
          role={onSelectLocation ? "button" : undefined}
          onClick={() => onSelectLocation?.(loc)}
          style={onSelectLocation ? { cursor: "pointer" } : undefined}
        >
          <LocationCard location={loc} />
        </div>
      ))}
    </div>
  );
}
