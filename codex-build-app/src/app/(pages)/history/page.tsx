"use client";

import { useEffect, useState } from "react";
import {
  fetchItems,
  deleteItem as deleteItemApi,
} from "../../lib/storageService";
import type { Item } from "../../types";
import { useItemStore } from "../../store/itemStore";
import { HistoryItemCard } from "../../components/history/HistoryItemCard";
import { CheckInItemModal } from "../../components/history/CheckInItemModal";
import { Input } from "../../components/ui/Input";
import { ToggleSwitch } from "../../components/ui/ToggleSwitch";
import styles from "./page.module.css";

/**
 * Displays the history of scanned items in a responsive grid of cards.
 */

export default function HistoryPage() {
  const { items, setItems, removeItem } = useItemStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showStored, setShowStored] = useState(false);
  const [checkInItem, setCheckInItem] = useState<Item | null>(null);

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

  const handleCheckIn = (item: Item) => {
    setCheckInItem(item);
  };

  const handleDelete = async (item: Item) => {
    if (!confirm("Delete this entry?")) return;
    try {
      await deleteItemApi(item._id);
      removeItem(item._id);
    } catch (err: any) {
      console.error(err);
      alert(err.message ?? "Failed to delete item");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (items.length === 0) return <div>No items found.</div>;

  const sorted = [...items].sort(
    (a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime(),
  );
  const searchFiltered = sorted.filter((it) => {
    const term = search.toLowerCase();
    const locName =
      typeof it.location === "object" && it.location ? it.location.name : "";
    return (
      it.barcode.toLowerCase().includes(term) ||
      it.name.toLowerCase().includes(term) ||
      locName.toLowerCase().includes(term)
    );
  });
  const filtered = searchFiltered.filter((it) => {
    const hasLocation = !!(
      it.location !== undefined && it.location !== null && it.location !== ""
    );
    return showStored ? hasLocation : !hasLocation;
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Item History</h1>
        <div className={styles.controls}>
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ToggleSwitch
            checked={showStored}
            onChange={setShowStored}
            labels={["Show: Not Stored", "Show: Stored"]}
          />
        </div>
      </div>
      <div className={styles.grid}>
        {filtered.map((item) => (
          <HistoryItemCard
            key={item._id}
            item={item}
            onCheckIn={handleCheckIn}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <CheckInItemModal
        isOpen={Boolean(checkInItem)}
        item={checkInItem!}
        onClose={() => setCheckInItem(null)}
      />
    </div>
  );
}
