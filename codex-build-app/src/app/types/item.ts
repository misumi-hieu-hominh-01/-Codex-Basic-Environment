import type { StorageLocation } from "./location";

export interface Item {
  _id: string;
  barcode: string;
  scannedAt: string | Date;
  metadata?: Record<string, unknown>;
  location?: StorageLocation | string | null;
  /**
   * Indicates how the item was added on the client.
   * Not persisted on the backend.
   */
  source?: "scan" | "manual";
}
