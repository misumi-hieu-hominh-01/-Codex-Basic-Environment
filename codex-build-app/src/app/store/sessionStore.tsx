'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface Session {
  sessionId: string;
}

export interface SessionStore {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

const SessionContext = createContext<SessionStore | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(null);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('session') : null;
    if (stored) {
      try {
        setSessionState(JSON.parse(stored));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  const setSession = (sess: Session | null) => {
    setSessionState(sess);
    if (typeof window === 'undefined') return;
    if (sess) {
      localStorage.setItem('session', JSON.stringify(sess));
    } else {
      localStorage.removeItem('session');
    }
  };

  const value: SessionStore = { session, setSession };
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionStore {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
}
