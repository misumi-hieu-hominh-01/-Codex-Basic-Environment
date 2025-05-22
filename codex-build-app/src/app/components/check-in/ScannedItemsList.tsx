"use client";

import Link from "next/link";
import { useItemStore } from "../../store/itemStore";

export function ScannedItemsList() {
  const { items } = useItemStore();

  const pendingItems = items.filter((item) => !item.location);

  if (pendingItems.length === 0) {
    return <div>No pending items.</div>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {pendingItems.map((item) => (
        <li key={item._id} style={{ marginBottom: "1rem" }}>
          <div>
            <strong>Barcode:</strong> {item.barcode}
          </div>
          <div>
            <strong>Scanned:</strong>{" "}
            {new Date(item.scannedAt).toLocaleString()}
          </div>
          {item.source && (
            <div>
              <strong>Source:</strong> {item.source}
            </div>
          )}
          <Link href={`/items/${encodeURIComponent(item.barcode)}/store`}>
            Store Item
          </Link>
        </li>
      ))}
    </ul>
  );
}
