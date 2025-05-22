import type { Item } from "../../types";
import styles from "./HistoryItemCard.module.css";

/**
 * Displays a single item from the history list in a card format.
 */

interface HistoryItemCardProps {
  item: Item;
  onEdit?: (item: Item) => void;
  onDelete?: (item: Item) => void;
}

export function HistoryItemCard({ item, onEdit, onDelete }: HistoryItemCardProps) {
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
      {(onEdit || onDelete) && (
        <div className={styles.actions}>
          {onEdit && (
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Edit item"
              onClick={() => onEdit(item)}
            >
              ✎
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
