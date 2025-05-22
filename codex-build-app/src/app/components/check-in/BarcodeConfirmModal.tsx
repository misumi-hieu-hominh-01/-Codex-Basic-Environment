"use client";

import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import styles from "./BarcodeConfirmModal.module.css";

interface BarcodeConfirmModalProps {
  barcode: string;
  isOpen: boolean;
  onConfirm: (quantity: number) => void;
  onTryAgain?: () => void;
  onClose?: () => void;
}

export function BarcodeConfirmModal({
  barcode,
  isOpen,
  onConfirm,
  onTryAgain,
  onClose,
}: BarcodeConfirmModalProps) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) setQuantity(1);
  }, [isOpen]);

  const decrease = () => setQuantity((q) => Math.max(1, q - 1));
  const increase = () => setQuantity((q) => q + 1);

  const handleConfirm = () => {
    onConfirm(quantity);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={styles.modal}>
      <div
        className={styles.content}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleConfirm();
          }
        }}
      >
        <div className={styles.barcodeInfo}>
          <span className={styles.icon}>✔</span>
          <p className={styles.message}>
            Detected barcode:
            <br />
            <strong>{barcode}</strong>
          </p>
        </div>
        <div className={styles.quantityRow}>
          <button
            type="button"
            onClick={decrease}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className={styles.qtyButton}
          >
            -
          </button>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, Number(e.target.value)))
            }
            className={styles.qtyInput}
          />
          <button
            type="button"
            onClick={increase}
            aria-label="Increase quantity"
            className={styles.qtyButton}
          >
            +
          </button>
        </div>
        <div className={styles.actions}>
          <Button onClick={handleConfirm} autoFocus>
            Confirm
          </Button>
          {onTryAgain && (
            <Button variant="secondary" onClick={onTryAgain}>
              Try Again
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
