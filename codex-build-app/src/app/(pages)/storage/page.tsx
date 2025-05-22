"use client";

import Link from "next/link";
import { LocationsList } from "../../components/storage/LocationsList";
import { Button } from "../../components/ui/Button";
import styles from "./page.module.css";

export default function StoragePage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Storage Locations</h1>
        <Link href="/storage/new">
          <Button type="button">Add New Storage Location</Button>
        </Link>
      </div>
      <LocationsList />
    </div>
  );
}
