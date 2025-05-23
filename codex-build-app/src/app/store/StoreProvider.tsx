"use client";

import { ReactNode } from "react";
import { ItemStoreProvider } from "./itemStore";
import { LocationStoreProvider } from "./locationStore";
import { SessionProvider } from "./sessionStore";

export function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ItemStoreProvider>
        <LocationStoreProvider>{children}</LocationStoreProvider>
      </ItemStoreProvider>
    </SessionProvider>
  );
}
