"use client";

import { useState } from "react";
import { LocationsList } from "../../components/storage/LocationsList";
import { LocationForm } from "../../components/storage/LocationForm";
import { DeleteLocationModal } from "../../components/storage/DeleteLocationModal";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { deleteLocation as deleteLocationApi } from "../../lib/storageService";
import { useLocationStore } from "../../store/locationStore";
import type { StorageLocation } from "../../types";
import styles from "./page.module.css";
import modalStyles from "./new/page.module.css";

export default function StoragePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [editLocation, setEditLocation] = useState<StorageLocation | null>(
    null
  );
  const [deleteLocation, setDeleteLocation] = useState<StorageLocation | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);
  const { removeLocation } = useLocationStore();

  const handleSubmitSuccess = () => {
    setModalOpen(false);
  };

  const handleEditSuccess = () => {
    setEditLocation(null);
  };

  const confirmDelete = async (loc: StorageLocation) => {
    setDeleting(true);
    try {
      await deleteLocationApi(loc._id);
      removeLocation(loc._id);
      setDeleteLocation(null);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to delete location");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Storage Locations</h1>
        <div className={styles.controls}>
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="button" onClick={() => setModalOpen(true)}>
            <span className={styles.buttonTextShort}>Add</span>
            <span className={styles.buttonTextFull}>
              Add New Storage Location
            </span>
          </Button>
        </div>
      </div>
      <LocationsList
        searchQuery={search}
        onEdit={(loc) => setEditLocation(loc)}
        onDelete={(loc) => setDeleteLocation(loc)}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className={modalStyles.page}>
          <h3>Add New Storage Location</h3>
          <div className={modalStyles.formWrapper}>
            <LocationForm onSubmitSuccess={handleSubmitSuccess} />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(editLocation)}
        onClose={() => setEditLocation(null)}
      >
        <div className={modalStyles.page}>
          <h3>Edit Storage Location</h3>
          <div className={modalStyles.formWrapper}>
            {editLocation && (
              <LocationForm
                location={editLocation}
                onSubmitSuccess={handleEditSuccess}
              />
            )}
          </div>
        </div>
      </Modal>

      <DeleteLocationModal
        location={deleteLocation}
        isOpen={Boolean(deleteLocation)}
        onCancel={() => setDeleteLocation(null)}
        onConfirm={confirmDelete}
        deleting={deleting}
      />
    </div>
  );
}
