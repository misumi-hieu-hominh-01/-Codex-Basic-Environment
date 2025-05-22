import type { Item } from "../../types";

interface HistoryItemCardProps {
  item: Item;
}

export function HistoryItemCard({ item }: HistoryItemCardProps) {
  const {
    barcode,
    name,
    quantity,
    scannedAt,
    location,
  } = item;

  const locationName =
    typeof location === "object" && location ? location.name : undefined;

  return (
    <div style={{ border: "1px solid rgba(0,0,0,0.1)", padding: "0.75rem", borderRadius: 6 }}>
      <h3 style={{ marginBottom: "0.5rem" }}>{name}</h3>
      <div>
        <strong>Barcode:</strong> {barcode}
      </div>
      <div>
        <strong>Quantity:</strong> {quantity}
      </div>
      <div>
        <strong>Scanned:</strong> {new Date(scannedAt).toLocaleString()}
      </div>
      {locationName && (
        <div>
          <strong>Location:</strong> {locationName}
        </div>
      )}
    </div>
  );
}
