import Link from "next/link";
import { Button } from "./components/ui/Button";

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        padding: "2rem",
      }}
    >
      <h1>Warehouse Dashboard</h1>
      <p>Welcome! Use the links below to manage your inventory.</p>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/check-in">
          <Button type="button">Check-in Items</Button>
        </Link>
        <Link href="/history">
          <Button type="button" variant="secondary">Item History</Button>
        </Link>
        <Link href="/storage">
          <Button type="button" variant="secondary">
            Manage Storage
          </Button>
        </Link>
      </div>
    </div>
  );
}
