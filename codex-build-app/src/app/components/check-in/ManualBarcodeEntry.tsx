'use client';

import { useState, FormEvent } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { BarcodeConfirmModal } from './BarcodeConfirmModal';
import styles from './ManualBarcodeEntry.module.css';

interface ManualBarcodeEntryProps {
  onSubmit?: (barcode: string, quantity: number) => void;
}

export function ManualBarcodeEntry({ onSubmit }: ManualBarcodeEntryProps) {
  const [barcode, setBarcode] = useState('');
  const [pendingBarcode, setPendingBarcode] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!barcode) return;
    setPendingBarcode(barcode);
  };

  const handleConfirm = (qty: number) => {
    if (!pendingBarcode) return;
    onSubmit?.(pendingBarcode, qty);
    setBarcode('');
    setPendingBarcode(null);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="Enter barcode"
        />
        <Button type="submit">Submit</Button>
      </form>
      <BarcodeConfirmModal
        barcode={pendingBarcode ?? ''}
        isOpen={!!pendingBarcode}
        onConfirm={handleConfirm}
        onClose={() => setPendingBarcode(null)}
      />
    </>
  );
}
