"use client";

import Image from "next/image";
import styles from "./LocationCard.module.css";
import type { StorageLocation } from "../../types";

interface LocationCardProps {
  /** Location data to display */
  location: StorageLocation;
  /** Called when the edit button is clicked */
  onEdit?: (loc: StorageLocation) => void;
  /** Called when the delete button is clicked */
  onDelete?: (loc: StorageLocation) => void;
}

const DEFAULT_IMAGE_URL = "/defaultS.png"; // Path to the default image in the public folder

export function LocationCard({
  location,
  onEdit,
  onDelete,
}: LocationCardProps) {
  const { imageUrl, name, description } = location;
  const displayImageUrl = imageUrl || DEFAULT_IMAGE_URL;

  return (
    <div className={styles.card}>
      {(onEdit || onDelete) && (
        <div className={styles.actions}>
          {onEdit && (
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Edit location"
              onClick={() => onEdit(location)}
            >
              🖋️
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Delete location"
              onClick={() => onDelete(location)}
            >
              🗑
            </button>
          )}
        </div>
      )}
      <Image 
        className={styles.image} 
        src={displayImageUrl} 
        alt={name}
        width={150}
        height={150}
        style={{ objectFit: 'cover' }}
      />
      <h3 className={styles.name}>{name}</h3>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}
