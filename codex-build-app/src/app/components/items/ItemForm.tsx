"use client";

import { useEffect, useState, FormEvent } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { updateItem, fetchLocations } from "../../lib/storageService";
import { useItemStore } from "../../store/itemStore";
import { useLocationStore } from "../../store/locationStore";
import type { Item, StorageLocation } from "../../types";

interface ItemFormProps {
  item: Item;
  onSubmitSuccess?: (item: Item) => void;
}

export function ItemForm({ item, onSubmitSuccess }: ItemFormProps) {
  const [barcode, setBarcode] = useState(item.barcode);
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity);
  const [metadata, setMetadata] = useState(
    item.metadata ? JSON.stringify(item.metadata, null, 2) : ""
  );
  const [locationId, setLocationId] = useState(
    typeof item.location === "object" && item.location
      ? item.location._id
      : typeof item.location === "string"
      ? item.location
      : ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { updateItem: updateItemInStore } = useItemStore();
  const { locations, setLocations } = useLocationStore();

  useEffect(() => {
    if (locations.length === 0) {
      fetchLocations()
        .then((locs) => setLocations(locs))
        .catch((err) => console.error(err));
    }
  }, [locations.length, setLocations]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let meta: Item["metadata"] | undefined;
      if (metadata.trim()) {
        meta = JSON.parse(metadata);
      }
      const updated = await updateItem(item._id, {
        barcode,
        name,
        quantity,
        metadata: meta,
        location: locationId || null,
      });
      updateItemInStore(updated);
      onSubmitSuccess?.(updated);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Failed to update item");
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
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
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
      <label>
        Metadata
        <textarea
          value={metadata}
          onChange={(e) => setMetadata(e.target.value)}
          rows={3}
          style={{
            padding: "0.5rem",
            border: "1px solid rgba(0,0,0,0.2)",
            borderRadius: "6px",
          }}
        />
      </label>
      <label>
        Location
        <select
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          style={{
            padding: "0.5rem",
            border: "1px solid rgba(0,0,0,0.2)",
            borderRadius: "6px",
          }}
        >
          <option value="">Unassigned</option>
          {locations.map((loc) => (
            <option key={loc._id} value={loc._id}>
              {loc.name}
            </option>
          ))}
        </select>
      </label>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
