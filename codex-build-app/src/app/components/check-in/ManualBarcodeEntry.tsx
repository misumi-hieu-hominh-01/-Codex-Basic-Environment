'use client';

import { useState, FormEvent } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface ManualBarcodeEntryProps {
  onSubmit?: (barcode: string) => void;
}

export function ManualBarcodeEntry({ onSubmit }: ManualBarcodeEntryProps) {
  const [barcode, setBarcode] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!barcode) return;
    onSubmit?.(barcode);
    setBarcode('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
      <Input
        value={barcode}
        onChange={e => setBarcode(e.target.value)}
        placeholder="Enter barcode"
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
