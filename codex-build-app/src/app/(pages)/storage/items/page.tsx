"use client";

import { useEffect, useState } from "react";
import {
  fetchItems,
  deleteItem as deleteItemApi,
} from "../../../lib/storageService";
import type { Item } from "../../../types";
import { useItemStore } from "../../../store/itemStore";
import { HistoryItemCard } from "../../../components/history/HistoryItemCard";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { ItemForm } from "../../../components/items/ItemForm";
import styles from "./page.module.css";

export default function StorageItemsPage() {
  const { items, setItems, removeItem } = useItemStore();
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
      .catch((err: any) => {
        console.error(err);
        if (!active) return;
        setError(err.message ?? "Failed to load items");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [setItems]);

  const storedItems = items.filter((it) => it.location);

  const sorted = [...storedItems].sort(
    (a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime()
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

  const handleDelete = async (item: Item) => {
    if (!confirm("Delete this item?")) return;
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

  return (
    <div className={styles.page}>
      <h1>Storage Items</h1>
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
            onEdit={(it) => setEditItem(it)}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <Modal isOpen={Boolean(editItem)} onClose={() => setEditItem(null)}>
        {editItem && (
          <div style={{ padding: "1rem" }}>
            <h2>Edit Item</h2>
            <ItemForm item={editItem} onSubmitSuccess={() => setEditItem(null)} />
          </div>
        )}
      </Modal>
    </div>
  );
}
