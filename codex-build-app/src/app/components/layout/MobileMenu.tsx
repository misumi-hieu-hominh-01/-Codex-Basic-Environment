"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./MobileMenu.module.css";

export function MobileMenu() {
  const pathname = usePathname();

  return (
    <nav className={styles.mobileNav} aria-label="Bottom navigation">
      <Link
        href="/"
        className={`${styles.item} ${pathname === "/" ? styles.active : ""}`}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          className={styles.icon}
          viewBox="0 0 24 24"
        >
          <path
            d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V9.5z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className={styles.label}>Home</span>
      </Link>
      <Link
        href="/check-in"
        className={`${styles.item} ${
          pathname.startsWith("/check-in") ? styles.active : ""
        }`}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          className={styles.icon}
          viewBox="0 0 24 24"
        >
          <path
            d="M12 5v14M5 12h14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className={styles.label}>Check-in</span>
      </Link>
      <Link
        href="/history"
        className={`${styles.item} ${
          pathname.startsWith("/history") ? styles.active : ""
        }`}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          className={styles.icon}
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <polyline
            points="12 7 12 12 15 15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className={styles.label}>History</span>
      </Link>
      <Link
        href="/storage"
        className={`${styles.item} ${
          pathname.startsWith("/storage") ? styles.active : ""
        }`}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          className={styles.icon}
          viewBox="0 0 24 24"
        >
          <path
            d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d="M3.3 7l8.7 5 8.7-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
        <span className={styles.label}>Storage</span>
      </Link>
    </nav>
  );
}
