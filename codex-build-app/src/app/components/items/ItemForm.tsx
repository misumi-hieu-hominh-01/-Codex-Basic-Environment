"use client";

import { useState, FormEvent } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { updateItem } from "../../lib/storageService";
import { useItemStore } from "../../store/itemStore";
import type { Item } from "../../types";

interface ItemFormProps {
  item: Item;
  onSubmitSuccess?: (item: Item) => void;
}

export function ItemForm({ item, onSubmitSuccess }: ItemFormProps) {
  const [barcode, setBarcode] = useState(item.barcode);
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { updateItem: updateItemInStore } = useItemStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const updated = await updateItem(item._id, {
        barcode,
        name,
        quantity,
      });
      updateItemInStore(updated);
      onSubmitSuccess?.(updated);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to update item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
    >
      <label>
        Barcode
        <Input
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          required
        />
      </label>
      <label>
        Name
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Quantity
        <Input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
        />
      </label>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
