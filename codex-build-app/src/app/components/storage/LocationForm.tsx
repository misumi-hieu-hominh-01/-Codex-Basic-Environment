"use client";

import { FormEvent, useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { addLocation, updateLocation } from "../../lib/storageService";
import { useLocationStore } from "../../store/locationStore";
import type { StorageLocation } from "../../types";
import styles from "./LocationForm.module.css";

const DEFAULT_IMAGE_URL = "/defaultS.png";

interface LocationFormProps {
  /** Existing location (for edit forms). */
  location?: StorageLocation;
  /** Callback fired when the location is successfully saved. */
  onSubmitSuccess?: (loc: StorageLocation) => void;
}

export function LocationForm({ location, onSubmitSuccess }: LocationFormProps) {
  const isEditing = Boolean(location);
  const [name, setName] = useState(location?.name ?? "");
  const [description, setDescription] = useState(location?.description ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(location?.imageUrl || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { addLocation: addToStore, updateLocation: updateInStore } =
    useLocationStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      let payload: FormData | Partial<StorageLocation>;
      if (file) {
        const formData = new FormData();
        formData.append("name", name);
        if (description) formData.append("description", description);
        formData.append("image", file);
        payload = formData;
      } else {
        payload = { name, description };
      }

      let saved: StorageLocation;
      if (isEditing && location) {
        saved = await updateLocation(location._id, payload);
        updateInStore(saved);
      } else {
        saved = await addLocation(payload);
        addToStore(saved);
      }

      onSubmitSuccess?.(saved);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Failed to save location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.field}>
        Name
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label className={styles.field}>
        Description
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <label className={styles.field}>
        Image
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0] || null;
            setFile(f);
            setPreview(f ? URL.createObjectURL(f) : null);
          }}
        />
        <img
          className={styles.preview}
          src={preview || DEFAULT_IMAGE_URL}
          alt="Preview"
        />
      </label>
      {error && <p className={styles.error}>{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading
          ? isEditing
            ? "Saving..."
            : "Creating..."
          : isEditing
          ? "Save Location"
          : "Create Location"}
      </Button>
    </form>
  );
}
