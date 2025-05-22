'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { StorageLocation } from '../types';

export interface LocationStore {
  locations: StorageLocation[];
  setLocations: (locations: StorageLocation[]) => void;
  addLocation: (loc: StorageLocation) => void;
  updateLocation: (loc: StorageLocation) => void;
  removeLocation: (id: string) => void;
}

const LocationStoreContext = createContext<LocationStore | undefined>(undefined);

export function LocationStoreProvider({ children }: { children: ReactNode }) {
  const [locations, setLocationsState] = useState<StorageLocation[]>([]);

  // Use useCallback for stable function references
  const setLocations = useCallback((l: StorageLocation[]) => setLocationsState(l), []);
  
  const addLocation = useCallback((loc: StorageLocation) =>
    setLocationsState(prev => [...prev, loc]), []);
  
  const updateLocation = useCallback((loc: StorageLocation) =>
    setLocationsState(prev =>
      prev.map(l => (l._id === loc._id ? loc : l)),
    ), []);
  
  const removeLocation = useCallback((id: string) =>
    setLocationsState(prev => prev.filter(l => l._id !== id)), []);

  const value: LocationStore = {
    locations,
    setLocations,
    addLocation,
    updateLocation,
    removeLocation,
  };

  return (
    <LocationStoreContext.Provider value={value}>
      {children}
    </LocationStoreContext.Provider>
  );
}

export function useLocationStore(): LocationStore {
  const context = useContext(LocationStoreContext);
  if (!context) {
    throw new Error('useLocationStore must be used within LocationStoreProvider');
  }
  return context;
}
