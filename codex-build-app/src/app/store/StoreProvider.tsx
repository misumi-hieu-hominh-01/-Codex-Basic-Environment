'use client'

import { ReactNode } from 'react';
import { ItemStoreProvider } from './itemStore';
import { LocationStoreProvider } from './locationStore';

export function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <ItemStoreProvider>
      <LocationStoreProvider>{children}</LocationStoreProvider>
    </ItemStoreProvider>
  );
}
