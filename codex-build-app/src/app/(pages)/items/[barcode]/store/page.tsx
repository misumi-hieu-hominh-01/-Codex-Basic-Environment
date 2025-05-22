"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LocationsList } from "../../../../components/storage/LocationsList";
import { LocationForm } from "../../../../components/storage/LocationForm";
import { Modal } from "../../../../components/ui/Modal";
import { Button } from "../../../../components/ui/Button";
import { useItemStore } from "../../../../store/itemStore";
import {
  fetchItems,
  updateItem as updateItemApi,
} from "../../../../lib/storageService";
import type { Item, StorageLocation } from "../../../../types";

export default function StoreItemPage() {
  const params = useParams<{ barcode: string }>();
  const router = useRouter();
  const { barcode } = params;

  const { items, updateItem } = useItemStore();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Load item details either from the store or API
  useEffect(() => {
    let active = true;
    const existing = items.find((i) => i.barcode === barcode);
    if (existing) {
      setItem(existing);
      setLoading(false);
      return;
    }

    fetchItems({ barcode: barcode as string })
      .then((res) => {
        if (!active) return;
        setItem(res[0] ?? null);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error(err);
        if (!active) return;
        setError(err.message ?? "Failed to load item");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [items, barcode]);

  const handleLocationSelect = async (loc: StorageLocation) => {
    if (!item) return;
    setError(null);
    try {
      const updated = await updateItemApi(item._id, { location: loc._id });
      updateItem(updated);
      router.push("/check-in");
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Failed to update item");
    }
  };

  const handleNewLocationSuccess = (loc: StorageLocation) => {
    setModalOpen(false);
    handleLocationSelect(loc);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!item) return <div>Item not found.</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h1>Store Item</h1>
      <div>
        <strong>Name:</strong> {item.name}
      </div>
      <div>
        <strong>Barcode:</strong> {item.barcode}
      </div>
      <div>
        <strong>Quantity:</strong> {item.quantity}
      </div>

      <Button type="button" onClick={() => setModalOpen(true)}>
        Create New Location
      </Button>

      <LocationsList onSelectLocation={handleLocationSelect} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div style={{ padding: "1rem" }}>
          <h2>Add New Location</h2>
          <LocationForm onSubmitSuccess={handleNewLocationSuccess} />
        </div>
      </Modal>
    </div>
  );
}
