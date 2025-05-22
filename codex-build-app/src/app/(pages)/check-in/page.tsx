"use client";

import { useState } from "react";
import { ManualBarcodeEntry } from "../../components/check-in/ManualBarcodeEntry";
import { BarcodeScanner } from "../../components/check-in/BarcodeScanner";
import Link from "next/link";
import { Button } from "../../components/ui/Button";
import { addItem as addItemApi } from "../../lib/storageService";
import { useItemStore } from "../../store/itemStore";

export default function CheckInPage() {
  const { addItem } = useItemStore();
  const [error, setError] = useState<string | null>(null);

  const handleBarcode = async (barcode: string, source: "scan" | "manual") => {
    setError(null);
    try {
      const defaultName = `Item ${barcode}`;
      const defaultQuantity = 1;
      const newItem = await addItemApi({
        barcode,
        name: defaultName,
        quantity: defaultQuantity,
        scannedAt: new Date(),
        source,
      });
      addItem(newItem);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Failed to add item");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h1>Check-In Page</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <BarcodeScanner onBarcodeScanned={(b) => handleBarcode(b, "scan")}/>
      <ManualBarcodeEntry onSubmit={(b) => handleBarcode(b, "manual")}/>
      <Link href="/history" style={{ alignSelf: "flex-start" }}>
        <Button type="button" variant="secondary">
          View History
        </Button>
      </Link>
    </div>
  );
}
