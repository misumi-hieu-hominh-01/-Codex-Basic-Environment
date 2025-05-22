"use client";

import { useState } from "react";
import { LocationsList } from "../../components/storage/LocationsList";
import { LocationForm } from "../../components/storage/LocationForm";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import type { StorageLocation } from "../../types";
import styles from "./page.module.css";
import modalStyles from "./new/page.module.css";

export default function StoragePage() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmitSuccess = (_loc: StorageLocation) => {
    setModalOpen(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Storage Locations</h1>
        <Button type="button" onClick={() => setModalOpen(true)}>
          Add New Storage Location
        </Button>
      </div>
      <LocationsList />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className={modalStyles.page}>
          <h3>Add New Storage Location</h3>
          <div className={modalStyles.formWrapper}>
            <LocationForm onSubmitSuccess={handleSubmitSuccess} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
