'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Item } from '../types';

export interface ItemStore {
  items: Item[];
  setItems: (items: Item[]) => void;
  addItem: (item: Item) => void;
  updateItem: (item: Item) => void;
  removeItem: (id: string) => void;
}

const ItemStoreContext = createContext<ItemStore | undefined>(undefined);

export function ItemStoreProvider({ children }: { children: ReactNode }) {
  const [items, setItemsState] = useState<Item[]>([]);

  const setItems = useCallback((items: Item[]) => setItemsState(items), []);
  const addItem = useCallback(
    (item: Item) => setItemsState(prev => [...prev, item]),
    [],
  );
  const updateItem = useCallback(
    (item: Item) =>
      setItemsState(prev => prev.map(i => (i._id === item._id ? item : i))),
    [],
  );
  const removeItem = useCallback(
    (id: string) => setItemsState(prev => prev.filter(i => i._id !== id)),
    [],
  );

  const value: ItemStore = {
    items,
    setItems,
    addItem,
    updateItem,
    removeItem,
  };

  return (
    <ItemStoreContext.Provider value={value}>
      {children}
    </ItemStoreContext.Provider>
  );
}

export function useItemStore(): ItemStore {
  const context = useContext(ItemStoreContext);
  if (!context) {
    throw new Error('useItemStore must be used within ItemStoreProvider');
  }
  return context;
}
