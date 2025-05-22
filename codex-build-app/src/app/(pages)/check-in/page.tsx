"use client";

import { useState } from "react";
import { ManualBarcodeEntry } from "../../components/check-in/ManualBarcodeEntry";
import { BarcodeScanner } from "../../components/check-in/BarcodeScanner";
import Link from "next/link";
import { Button } from "../../components/ui/Button";
import { addItem as addItemApi } from "../../lib/storageService";
import { useItemStore } from "../../store/itemStore";
import styles from "./page.module.css";

export default function CheckInPage() {
  const { addItem } = useItemStore();
  const [error, setError] = useState<string | null>(null);

  const handleBarcode = async (
    barcode: string,
    quantity: number,
    source: "scan" | "manual"
  ) => {
    setError(null);
    try {
      const defaultName = `Item ${barcode}`;
      const newItem = await addItemApi({
        barcode,
        name: defaultName,
        quantity,
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
    <div className={styles.page}>
      <h1>Check-In</h1>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.content}>
        <div className={styles.scanner}>
          <BarcodeScanner onBarcodeScanned={(b, q) => handleBarcode(b, q, "scan")}/>
        </div>
        <div className={styles.controls}>
          <ManualBarcodeEntry onSubmit={(b, q) => handleBarcode(b, q, "manual")}/>
          <Link href="/history">
            <Button type="button" variant="secondary">View History</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
