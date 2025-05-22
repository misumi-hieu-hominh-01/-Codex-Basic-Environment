import type { StorageLocation } from "../../types";
import styles from "./LocationCard.module.css";

interface LocationCardProps {
  /** Location data to display */
  location: StorageLocation;
}

const DEFAULT_IMAGE_URL = "/defaultS.png"; // Path to the default image in the public folder

export function LocationCard({ location }: LocationCardProps) {
  const { imageUrl, name, description } = location;
  const displayImageUrl = imageUrl || DEFAULT_IMAGE_URL;

  return (
    <div className={styles.card}>
      <img className={styles.image} src={displayImageUrl} alt={name} />
      <h3 className={styles.name}>{name}</h3>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}
