import type { Item } from "../../types";
import styles from "./HistoryItemCard.module.css";

/**
 * Displays a single item from the history list in a card format.
 */

interface HistoryItemCardProps {
  item: Item;
  onCheckIn?: (item: Item) => void;
  onDelete?: (item: Item) => void;
}

export function HistoryItemCard({
  item,
  onCheckIn,
  onDelete,
}: HistoryItemCardProps) {
  const { barcode, name, quantity, scannedAt, location } = item;
  const locationName =
    typeof location === "object" && location ? location.name : undefined;

  return (
    <div className={styles.card}>
      <h3 className={styles.name}>{name}</h3>
      <div className={styles.meta}>
        <span className={styles.label}>Barcode:</span> {barcode}
      </div>
      <div className={styles.meta}>
        <span className={styles.label}>Quantity:</span> {quantity}
      </div>
      <div className={styles.meta}>
        <span className={styles.label}>Scanned:</span>{" "}
        {new Date(scannedAt).toLocaleString()}
      </div>
      {locationName && (
        <div className={styles.meta}>
          <span className={styles.label}>Location:</span> {locationName}
        </div>
      )}
      {(onCheckIn || onDelete) && (
        <div className={styles.actions}>
          {onCheckIn && !locationName && (
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Check in item"
              onClick={() => onCheckIn(item)}
            >
              📦
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Delete item"
              onClick={() => onDelete(item)}
            >
              🗑
            </button>
          )}
        </div>
      )}
    </div>
  );
}
