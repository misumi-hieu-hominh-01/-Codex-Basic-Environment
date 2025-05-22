import type { StorageLocation } from "../../types";
import styles from "./LocationCard.module.css";

interface LocationCardProps {
  /** Location data to display */
  location: StorageLocation;
}

export function LocationCard({ location }: LocationCardProps) {
  const { imageUrl, name, description } = location;

  return (
    <div className={styles.card}>
      {imageUrl && (
        <img className={styles.image} src={imageUrl} alt={name} />
      )}
      <h3 className={styles.name}>{name}</h3>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}
