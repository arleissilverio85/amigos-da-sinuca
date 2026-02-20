import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';

type SessionContextType = {
  session: Session | null;
  loading: boolean;
  loginAsGuest: () => void;
  logout: () => void;
};

const SessionContext = createContext<SessionContextType>({ 
  session: null, 
  loading: true,
  loginAsGuest: () => {},
  logout: () => {}
});

// Sessão mockada para desenvolvimento
const MOCK_USER: any = {
  id: '12345',
  email: 'jogador@sinuca.com',
  user_metadata: {
    full_name: 'Jogador Pro',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pool'
  }
};

const MOCK_SESSION: Session = {
  access_token: 'abc',
  refresh_token: 'def',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  user: MOCK_USER,
  token_type: 'bearer'
};

export const SessionContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulando carregamento inicial
    const savedSession = localStorage.getItem('pool_session');
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    }
    setLoading(false);
  }, []);

  const loginAsGuest = () => {
    setSession(MOCK_SESSION);
    localStorage.setItem('pool_session', JSON.stringify(MOCK_SESSION));
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem('pool_session');
  };

  return (
    <SessionContext.Provider value={{ session, loading, loginAsGuest, logout }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);