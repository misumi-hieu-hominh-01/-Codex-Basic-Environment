"use client";

import { useState } from "react";
import { ManualBarcodeEntry } from "../../components/check-in/ManualBarcodeEntry";
import { BarcodeScanner } from "../../components/check-in/BarcodeScanner";
import { addItem as addItemApi } from "../../lib/storageService";
import { useItemStore } from "../../store/itemStore";

export default function CheckInPage() {
  const { addItem } = useItemStore();
  const [error, setError] = useState<string | null>(null);

  const handleBarcode = async (barcode: string, source: "scan" | "manual") => {
    setError(null);
    try {
      const newItem = await addItemApi({
        barcode,
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
    <div>
      <h1>Check-In Page</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <BarcodeScanner onBarcodeScanned={(b) => handleBarcode(b, "scan")}/>
      <ManualBarcodeEntry onSubmit={(b) => handleBarcode(b, "manual")}/>
    </div>
  );
}
