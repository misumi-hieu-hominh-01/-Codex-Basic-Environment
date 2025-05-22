import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      <Link
        href="/"
        className={`${styles.link} ${pathname === "/" ? styles.active : ""}`}
      >
        Home
      </Link>
      <Link
        href="/check-in"
        className={`${styles.link} ${
          pathname.startsWith("/check-in") ? styles.active : ""
        }`}
      >
        Check-in
      </Link>
      <Link
        href="/history"
        className={`${styles.link} ${
          pathname.startsWith("/history") ? styles.active : ""
        }`}
      >
        History
      </Link>
      <Link
        href="/storage"
        className={`${styles.link} ${
          pathname.startsWith("/storage") ? styles.active : ""
        }`}
      >
        Storage
      </Link>
    </nav>
  );
}
