"use client";

import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import type { Item } from "../../types";
import styles from "./DeleteConfirmModal.module.css";

interface DeleteConfirmModalProps {
  item: Item | null;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: (item: Item) => void;
  deleting?: boolean;
}

export function DeleteConfirmModal({
  item,
  isOpen,
  onCancel,
  onConfirm,
  deleting = false,
}: DeleteConfirmModalProps) {
  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onCancel} className={styles.modal}>
      <div className={styles.content}>
        <h2 className={styles.title}>Confirm Deletion</h2>
        <p className={styles.message}>
          Are you sure you want to delete this item? This action cannot be undone.
        </p>
        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => onConfirm(item)}
            disabled={deleting}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
