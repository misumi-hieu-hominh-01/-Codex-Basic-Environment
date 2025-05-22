"use client";

import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import type { StorageLocation } from "../../types";
import styles from "./DeleteLocationModal.module.css";

interface DeleteLocationModalProps {
  location: StorageLocation | null;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: (loc: StorageLocation) => void;
  deleting?: boolean;
}

export function DeleteLocationModal({
  location,
  isOpen,
  onCancel,
  onConfirm,
  deleting = false,
}: DeleteLocationModalProps) {
  if (!location) return null;

  return (
    <Modal isOpen={isOpen} onClose={onCancel} className={styles.modal}>
      <div className={styles.content}>
        <h2 className={styles.title}>Confirm Deletion</h2>
        <p className={styles.message}>
          Are you sure you want to delete this storage location? This action cannot be undone.
        </p>
        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onCancel}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => onConfirm(location)}
            disabled={deleting}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
