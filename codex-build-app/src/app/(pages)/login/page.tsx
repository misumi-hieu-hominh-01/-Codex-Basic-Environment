"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { login } from "../../lib/authService";
import { useSession } from "../../store/sessionStore";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const { setSession } = useSession();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { sessionId } = await login(loginId, password);

      // Set the session with the sessionId and 24 hour expiration
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
      setSession({ sessionId, expiresAt });

      // Small delay to ensure localStorage is updated before navigation
      setTimeout(() => {
        router.push("/sales-orders");
      }, 100);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1>Login</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          placeholder="Login ID"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className={styles.error}>{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
