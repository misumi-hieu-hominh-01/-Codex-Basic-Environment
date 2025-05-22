import type { StorageLocation } from "../../types";

interface LocationCardProps {
  /** Location data to display */
  location: StorageLocation;
}

export function LocationCard({ location }: LocationCardProps) {
  const { imageUrl, name, description } = location;

  return (
    <div>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={name}
          style={{ width: "100%", height: "auto" }}
        />
      )}
      <h3>{name}</h3>
      {description && <p>{description}</p>}
    </div>
  );
}
