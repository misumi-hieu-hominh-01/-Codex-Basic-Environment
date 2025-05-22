"use client";

import { useRouter } from "next/navigation";
import { LocationForm } from "../../../components/storage/LocationForm";
import { useLocationStore } from "../../../store/locationStore";
import type { StorageLocation } from "../../../types";

export default function NewStoragePage() {
  const router = useRouter();
  const { addLocation } = useLocationStore();

  const handleSubmitSuccess = (loc: StorageLocation) => {
    addLocation(loc);
    router.push("/storage");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h1>Add New Storage Location</h1>
      <LocationForm onSubmitSuccess={handleSubmitSuccess} />
    </div>
  );
}
