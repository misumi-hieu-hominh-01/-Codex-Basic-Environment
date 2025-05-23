"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export interface Session {
  sessionId: string;
  expiresAt?: number; // Timestamp when the session expires
}

export interface SessionStore {
  session: Session | null;
  setSession: (session: Session | null) => void;
  logout: () => void;
}

const SessionContext = createContext<SessionStore | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load session from localStorage on client-side only
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem("session");
      if (stored) {
        const parsedSession = JSON.parse(stored) as Session;

        // Check if the session has expired
        if (parsedSession.expiresAt && Date.now() > parsedSession.expiresAt) {
          // Session expired, remove it
          localStorage.removeItem("session");
        } else {
          setSessionState(parsedSession);
        }
      }
    } catch (error) {
      console.error("Error loading session from localStorage:", error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const setSession = (sess: Session | null) => {
    setSessionState(sess);

    if (typeof window === "undefined") return;

    try {
      if (sess) {
        const sessionStr = JSON.stringify(sess);
        localStorage.setItem("session", sessionStr);
      } else {
        localStorage.removeItem("session");
      }
    } catch (error) {
      console.error("Error saving session to localStorage:", error);
    }
  };

  const logout = () => {
    setSessionState(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("session");
    }
  };

  const value: SessionStore = {
    session,
    setSession,
    logout,
  };

  // Wait for client-side initialization before rendering children
  // This prevents hydration mismatch warnings
  return (
    <SessionContext.Provider value={value}>
      {/* Phần này render giống hệt nhau trên server & client */}
      {!isInitialized ? (
        <div style={{ visibility: "hidden" }}>Loading session...</div>
      ) : (
        children
      )}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionStore {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
}
