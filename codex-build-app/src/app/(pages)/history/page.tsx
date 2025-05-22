"use client";

import { useEffect, useState } from "react";
import { fetchItems } from "../../lib/storageService";
import { useItemStore } from "../../store/itemStore";
import { HistoryItemCard } from "../../components/history/HistoryItemCard";
import styles from "./page.module.css";

/**
 * Displays the history of scanned items in a responsive grid of cards.
 */

export default function HistoryPage() {
  const { items, setItems } = useItemStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchItems()
      .then((data) => {
        if (!active) return;
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (!active) return;
        let message = "Failed to load items";
        if (err instanceof Error) {
          message = err.message;
        } else if (typeof err === "string") {
          message = err;
        }
        setError(message);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [setItems]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (items.length === 0) return <div>No items found.</div>;

  const sorted = [...items].sort(
    (a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime()
  );

  return (
    <div className={styles.page}>
      <h1>Item History</h1>
      <div className={styles.grid}>
        {sorted.map((item) => (
          <HistoryItemCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}
