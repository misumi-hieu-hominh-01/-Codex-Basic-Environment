"use client";

import { useEffect, useState } from "react";
import {
  fetchItems,
  deleteItem as deleteItemApi,
} from "../../lib/storageService";
import type { Item } from "../../types";
import { useItemStore } from "../../store/itemStore";
import { HistoryItemCard } from "../../components/history/HistoryItemCard";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { ItemForm } from "../../components/items/ItemForm";
import styles from "./page.module.css";

/**
 * Displays the history of scanned items in a responsive grid of cards.
 */

export default function HistoryPage() {
  const { items, setItems, updateItem, removeItem } = useItemStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editItem, setEditItem] = useState<Item | null>(null);

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

  const handleEdit = (item: Item) => {
    setEditItem(item);
  };

  const handleEditSuccess = () => {
    setEditItem(null);
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
  const filtered = sorted.filter((it) => {
    const term = search.toLowerCase();
    const locName =
      typeof it.location === "object" && it.location ? it.location.name : "";
    return (
      it.barcode.toLowerCase().includes(term) ||
      it.name.toLowerCase().includes(term) ||
      locName.toLowerCase().includes(term)
    );
  });

  return (
    <div className={styles.page}>
      <h1>Item History</h1>
      <Input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className={styles.grid}>
        {filtered.map((item) => (
          <HistoryItemCard
            key={item._id}
            item={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <Modal isOpen={Boolean(editItem)} onClose={() => setEditItem(null)}>
        {editItem && (
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Edit Item</h2>
            <ItemForm item={editItem} onSubmitSuccess={handleEditSuccess} />
          </div>
        )}
      </Modal>
    </div>
  );
}
