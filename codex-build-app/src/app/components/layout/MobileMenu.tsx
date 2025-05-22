"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./MobileMenu.module.css";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(prev => !prev);

  return (
    <div className={styles.container}>
      <button
        className={styles.toggle}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={toggle}
        type="button"
      >
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </button>
      {open && (
        <nav className={styles.menu} role="menu">
          <Link href="/" onClick={() => setOpen(false)} role="menuitem">
            Home
          </Link>
          <Link href="/check-in" onClick={() => setOpen(false)} role="menuitem">
            Check-In
          </Link>
          <Link href="/history" onClick={() => setOpen(false)} role="menuitem">
            History
          </Link>
          <Link href="/storage" onClick={() => setOpen(false)} role="menuitem">
            Storage
          </Link>
        </nav>
      )}
    </div>
  );
}
