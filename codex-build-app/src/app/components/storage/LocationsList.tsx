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

  useEffect(() => {
    let active = true;
    fetchLocations()
      .then((locs) => {
        if (!active) return;
        setLocations(locs);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error(err);
        if (!active) return;
        setError(err.message ?? "Failed to load locations");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [setLocations]);

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
