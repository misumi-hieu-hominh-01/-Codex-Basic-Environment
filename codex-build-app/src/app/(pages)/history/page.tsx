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
import { DeleteConfirmModal } from "../../components/history/DeleteConfirmModal";
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
  const [deleteItem, setDeleteItem] = useState<Item | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = (item: Item) => {
    setDeleteItem(item);
  };

  const confirmDelete = async (item: Item) => {
    setDeleting(true);
    try {
      await deleteItemApi(item._id);
      removeItem(item._id);
      setDeleteItem(null);
    } catch (err: any) {
      console.error(err);
      alert(err.message ?? "Failed to delete item");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (items.length === 0) return <div>No items found.</div>;

  const sorted = [...items].sort(
    (a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime()
  );
  const searchFiltered = sorted.filter((it) => {
    const term = search.toLowerCase();
    const locName =
      typeof it.location === "object" && it.location ? it.location.name : "";
    return (
      (it.barcode && it.barcode.toLowerCase().includes(term)) ||
      (it.name && it.name.toLowerCase().includes(term)) ||
      (locName && locName.toLowerCase().includes(term))
    );
  });
  const filtered = searchFiltered.filter((it) => {
    const hasLocation = !!(
      it.location !== undefined &&
      it.location !== null &&
      it.location !== ""
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
            labels={["Stored", "Stored"]}
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
      <DeleteConfirmModal
        isOpen={Boolean(deleteItem)}
        item={deleteItem}
        onCancel={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
        deleting={deleting}
      />
    </div>
  );
}
