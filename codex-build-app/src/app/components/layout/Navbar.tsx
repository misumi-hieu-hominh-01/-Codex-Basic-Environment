import Link from 'next/link';
import styles from './Navbar.module.css';

export function Navbar() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.link}>
        Home
      </Link>
      <Link href="/check-in" className={styles.link}>
        Check-in
      </Link>
      <Link href="/history" className={styles.link}>
        History
      </Link>
      <Link href="/storage" className={styles.link}>
        Storage
      </Link>
    </nav>
  );
}
