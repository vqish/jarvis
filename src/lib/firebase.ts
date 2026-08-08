import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * Clean environment string values from accidental trailing spaces or surrounding quotes
 */
const cleanEnv = (val?: string): string => {
  if (!val) return '';
  return val.trim().replace(/^["']|["']$/g, '');
};

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const firebaseConfig: FirebaseConfig = {
  apiKey: cleanEnv(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: cleanEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: cleanEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: cleanEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanEnv(import.meta.env.VITE_FIREBASE_APP_ID),
};

export interface FirebaseDiagnostics {
  apiKey: 'PRESENT' | 'MISSING';
  authDomain: 'PRESENT' | 'MISSING';
  projectId: 'PRESENT' | 'MISSING';
  storageBucket: 'PRESENT' | 'MISSING';
  messagingSenderId: 'PRESENT' | 'MISSING';
  appId: 'PRESENT' | 'MISSING';
  isComplete: boolean;
  statusMessage: string;
}

/**
 * Returns safe environment variable diagnostic states without ever revealing secret values.
 */
export function getFirebaseDiagnostics(): FirebaseDiagnostics {
  const d = {
    apiKey: (firebaseConfig.apiKey ? 'PRESENT' : 'MISSING') as 'PRESENT' | 'MISSING',
    authDomain: (firebaseConfig.authDomain ? 'PRESENT' : 'MISSING') as 'PRESENT' | 'MISSING',
    projectId: (firebaseConfig.projectId ? 'PRESENT' : 'MISSING') as 'PRESENT' | 'MISSING',
    storageBucket: (firebaseConfig.storageBucket ? 'PRESENT' : 'MISSING') as 'PRESENT' | 'MISSING',
    messagingSenderId: (firebaseConfig.messagingSenderId ? 'PRESENT' : 'MISSING') as 'PRESENT' | 'MISSING',
    appId: (firebaseConfig.appId ? 'PRESENT' : 'MISSING') as 'PRESENT' | 'MISSING',
  };

  const isComplete =
    d.apiKey === 'PRESENT' &&
    d.authDomain === 'PRESENT' &&
    d.projectId === 'PRESENT' &&
    d.appId === 'PRESENT';

  return {
    ...d,
    isComplete,
    statusMessage: isComplete
      ? 'Firebase configuration is complete.'
      : 'Firebase configuration is incomplete. Check .env.local and restart the Vite server.',
  };
}

/**
 * Validates whether all required Firebase credentials are present in the environment.
 */
export function isFirebaseConfigured(): boolean {
  return getFirebaseDiagnostics().isComplete;
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    console.info('[Firebase] Successfully initialized with project ID:', firebaseConfig.projectId);
  } catch (error) {
    console.error('[Firebase] Initialization error:', error);
  }
} else {
  console.warn(
    '[Firebase] Configuration is missing or incomplete in .env.local.\n' +
    'JARVIS is currently operating in Local/Offline Mode with in-memory persistence.'
  );
}

export { app, auth, db };
