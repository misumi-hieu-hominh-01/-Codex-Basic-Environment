"use client";

import { useEffect, useState } from "react";
import { LocationCard } from "./LocationCard";
import { fetchLocations } from "../../lib/storageService";
import { useLocationStore } from "../../store/locationStore";
import styles from "./LocationsList.module.css";
import type { StorageLocation } from "../../types";

interface LocationsListProps {
  /**
   * Optional callback fired when a location is selected. If provided, each
   * location card becomes clickable and the location object is passed to this
   * callback when clicked.
   */
  onSelectLocation?: (loc: StorageLocation) => void;
  /** Search term used to filter locations by name or description */
  searchQuery?: string;
  /** Called when the edit icon on a card is clicked */
  onEdit?: (loc: StorageLocation) => void;
  /** Called when the delete icon on a card is clicked */
  onDelete?: (loc: StorageLocation) => void;
}

export function LocationsList({
  onSelectLocation,
  searchQuery,
  onEdit,
  onDelete,
}: LocationsListProps) {
  const { locations: storageLocations, setLocations } = useLocationStore();
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
        setError(
          err instanceof Error ? err.message : "Failed to load locations"
        );
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
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSkeleton} aria-hidden="true" />
      </div>
    );
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  const term = searchQuery?.toLowerCase() ?? "";
  const filtered = storageLocations.filter((loc) => {
    return (
      loc.name.toLowerCase().includes(term) ||
      (loc.description && loc.description.toLowerCase().includes(term))
    );
  });

  if (filtered.length === 0) {
    return (
      <div className={styles.emptyState}>
        <svg
          className={styles.emptyIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <p className={styles.emptyText}>No locations found</p>
        <p className={styles.emptySubtext}>
          Try adjusting your search or add a new location
        </p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {filtered.map((loc) => (
        <div
          key={loc._id}
          role={onSelectLocation ? "button" : undefined}
          onClick={() => onSelectLocation?.(loc)}
          style={onSelectLocation ? { cursor: "pointer" } : undefined}
        >
          <LocationCard location={loc} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
}
