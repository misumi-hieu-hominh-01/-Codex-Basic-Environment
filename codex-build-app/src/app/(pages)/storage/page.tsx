"use client";

import Link from "next/link";
import { LocationsList } from "../../components/storage/LocationsList";
import { Button } from "../../components/ui/Button";

export default function StoragePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h1>Storage Locations</h1>
      <Link href="/storage/new">
        <Button type="button">Add New Storage Location</Button>
      </Link>
      <LocationsList />
    </div>
  );
}
