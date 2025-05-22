"use client";

import { useRouter } from "next/navigation";
import { LocationForm } from "../../../components/storage/LocationForm";
import { useLocationStore } from "../../../store/locationStore";
import type { StorageLocation } from "../../../types";
import styles from "./page.module.css";

export default function NewStoragePage() {
  const router = useRouter();
  const { addLocation } = useLocationStore();

  const handleSubmitSuccess = (loc: StorageLocation) => {
    addLocation(loc);
    router.push("/storage");
  };

  return (
    <div className={styles.page}>
      <h1>Add New Storage Location</h1>
      <div className={styles.formWrapper}>
        <LocationForm onSubmitSuccess={handleSubmitSuccess} />
      </div>
    </div>
  );
}
