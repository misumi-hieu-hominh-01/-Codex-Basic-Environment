import type { StorageLocation } from "./location";

export interface Item {
  /** MongoDB identifier */
  _id: string;
  /** Item name stored in the backend */
  name: string;
  /** Quantity of the item */
  quantity: number;
  /** Barcode of the item */
  barcode: string;
  /** Date the barcode was scanned */
  scannedAt: string | Date;
  /** Date the item was checked in to a location */
  checkInTime?: string | Date | null;
  /** Arbitrary metadata associated with the item */
  metadata?: Record<string, unknown>;
  /**
   * The location may be populated with a StorageLocation when retrieved from
   * the backend, or just contain the location id as a string. It can also be
   * null when the item has no location.
   */
  location?: StorageLocation | string | null;
  /**
   * Indicates how the item was added on the client. Not persisted on the
   * backend.
   */
  source?: "scan" | "manual";
}
