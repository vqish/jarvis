import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../../lib/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
}

export class FirebaseAuthService {
  /**
   * Register a new user with Email and Password
   * Automatically creates the user profile document in Firestore: users/{uid}
   */
  static async register(
    email: string,
    pass: string,
    displayName: string
  ): Promise<UserProfile> {
    if (!auth || !db) {
      throw new Error('Firebase is not configured. Please configure .env.local.');
    }

    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const user = cred.user;

    if (displayName) {
      await updateProfile(user, { displayName });
    }

    const now = new Date().toISOString();
    const profile: UserProfile = {
      uid: user.uid,
      email: user.email || email,
      displayName: displayName || user.displayName || 'Jarvis Student',
      photoURL: user.photoURL || undefined,
      createdAt: now,
      updatedAt: now,
    };

    // Store in Firestore users/{uid}
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, profile, { merge: true });

    return profile;
  }

  /**
   * Log in an existing user with Email and Password
   */
  static async login(email: string, pass: string): Promise<UserProfile> {
    if (!auth || !db) {
      throw new Error('Firebase is not configured. Please configure .env.local.');
    }

    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const user = cred.user;

    // Fetch existing user profile
    const profile = await this.getUserProfile(user.uid);
    if (profile) return profile;

    // Fallback profile if document does not exist yet
    const now = new Date().toISOString();
    const fallbackProfile: UserProfile = {
      uid: user.uid,
      email: user.email || email,
      displayName: user.displayName || 'Jarvis Student',
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(doc(db, 'users', user.uid), fallbackProfile, { merge: true });
    return fallbackProfile;
  }

  /**
   * Log out the current user
   */
  static async logout(): Promise<void> {
    if (!auth) return;
    await signOut(auth);
  }

  /**
   * Retrieve the user profile document from Firestore: users/{uid}
   */
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    if (!db) return null;
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
    } catch (e) {
      console.warn('[FirebaseAuthService] Could not fetch user profile:', e);
    }
    return null;
  }

  /**
   * Listen to Firebase auth state changes
   */
  static onAuthChange(
    callback: (user: FirebaseUser | null, profile: UserProfile | null) => void
  ): () => void {
    if (!auth) {
      callback(null, null);
      return () => {};
    }

    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await this.getUserProfile(user.uid);
        callback(user, profile);
      } else {
        callback(null, null);
      }
    });
  }
}
