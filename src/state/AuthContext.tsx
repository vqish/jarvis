import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { FirebaseAuthService, UserProfile } from '../services/firebase/auth';
import { isFirebaseConfigured } from '../lib/firebase';
import { RepositoryManager } from '../services/repositories/RepositoryManager';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isFirebaseReady: boolean;
  isLoading: boolean;
  authError: string | null;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';

  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const isFirebaseReady = isFirebaseConfigured();

  useEffect(() => {
    if (!isFirebaseReady) {
      setIsLoading(false);
      RepositoryManager.setMode('LOCAL');
      return;
    }

    const unsubscribe = FirebaseAuthService.onAuthChange((fbUser, profile) => {
      setFirebaseUser(fbUser);
      setUser(profile);
      setIsLoading(false);

      if (fbUser) {
        RepositoryManager.setMode('FIREBASE');
      } else {
        RepositoryManager.setMode('LOCAL');
      }
    });

    return () => unsubscribe();
  }, [isFirebaseReady]);

  const login = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      const profile = await FirebaseAuthService.login(email, pass);
      setUser(profile);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.error('[AuthContext] Login error:', err);
      setAuthError(err.message || 'Failed to authenticate.');
      throw err;
    }
  };

  const register = async (email: string, pass: string, displayName: string) => {
    setAuthError(null);
    try {
      const profile = await FirebaseAuthService.register(email, pass, displayName);
      setUser(profile);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.error('[AuthContext] Registration error:', err);
      setAuthError(err.message || 'Failed to create account.');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await FirebaseAuthService.logout();
      setUser(null);
      setFirebaseUser(null);
      RepositoryManager.setMode('LOCAL');
    } catch (err: any) {
      console.error('[AuthContext] Logout error:', err);
    }
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthError(null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: Boolean(user || firebaseUser),
        isFirebaseReady,
        isLoading,
        authError,
        isAuthModalOpen,
        authModalMode,

        login,
        register,
        logout,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
