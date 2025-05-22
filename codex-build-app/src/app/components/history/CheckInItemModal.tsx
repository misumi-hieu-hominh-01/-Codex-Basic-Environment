"use client";

import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { LocationsList } from "../storage/LocationsList";
import { LocationForm } from "../storage/LocationForm";
import { updateItem } from "../../lib/storageService";
import { useItemStore } from "../../store/itemStore";
import type { Item, StorageLocation } from "../../types";
import styles from "./CheckInItemModal.module.css";

interface CheckInItemModalProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
}

export function CheckInItemModal({
  item,
  isOpen,
  onClose,
}: CheckInItemModalProps) {
  const { updateItem: updateItemInStore } = useItemStore();
  const [showNewStorage, setShowNewStorage] = useState(false);

  const handleSelect = async (loc: StorageLocation) => {
    try {
      const updated = await updateItem(item._id, { location: loc._id });
      updateItemInStore(updated);
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.message ?? "Failed to check in item");
    }
  };

  const handleNewLocation = (loc: StorageLocation) => {
    setShowNewStorage(false);
    handleSelect(loc);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Choose Storage</h2>
          <button
            type="button"
            aria-label="Close"
            className={styles.closeButton}
            onClick={onClose}
          >
            ✖
          </button>
        </div>
        <Button type="button" onClick={() => setShowNewStorage(true)}>
          Create New Storage
        </Button>
        <div className={styles.listWrapper}>
          <LocationsList onSelectLocation={handleSelect} />
        </div>
      </Modal>

      <Modal isOpen={showNewStorage} onClose={() => setShowNewStorage(false)}>
        <div className={styles.nestedContent}>
          <h3>Add New Storage Location</h3>
          <LocationForm onSubmitSuccess={handleNewLocation} />
        </div>
      </Modal>
    </>
  );
}
