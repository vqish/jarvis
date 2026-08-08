import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  CollectionReference,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

/**
 * User-Scoped Firestore Operations
 * 
 * All data collections are strictly nested under `users/{userId}/<collectionName>`
 * to guarantee complete privacy, clean tenant isolation, and security rule compliance.
 */
export class FirestoreService {
  /**
   * Helper to retrieve a user-scoped collection reference
   */
  static getUserCollectionRef<T = DocumentData>(
    userId: string,
    collectionName: string
  ): CollectionReference<T> | null {
    if (!db) return null;
    return collection(db, 'users', userId, collectionName) as CollectionReference<T>;
  }

  /**
   * Fetch all documents in a user subcollection
   */
  static async fetchCollection<T>(userId: string, collectionName: string): Promise<T[]> {
    const colRef = this.getUserCollectionRef<T>(userId, collectionName);
    if (!colRef) return [];

    try {
      const snap = await getDocs(colRef);
      return snap.docs.map((d) => ({ ...d.data(), id: d.id })) as T[];
    } catch (error) {
      console.warn(`[FirestoreService] Error reading collection users/${userId}/${collectionName}:`, error);
      return [];
    }
  }

  /**
   * Set or overwrite a document under users/{userId}/{collectionName}/{docId}
   */
  static async setDocument<T extends Record<string, any>>(
    userId: string,
    collectionName: string,
    docId: string,
    data: T
  ): Promise<void> {
    if (!db) return;
    const docRef = doc(db, 'users', userId, collectionName, docId);
    await setDoc(docRef, data, { merge: true });
  }

  /**
   * Update specific fields in a document
   */
  static async updateDocument(
    userId: string,
    collectionName: string,
    docId: string,
    updates: Record<string, any>
  ): Promise<void> {
    if (!db) return;
    const docRef = doc(db, 'users', userId, collectionName, docId);
    await updateDoc(docRef, updates);
  }

  /**
   * Delete a document under users/{userId}/{collectionName}/{docId}
   */
  static async deleteDocument(
    userId: string,
    collectionName: string,
    docId: string
  ): Promise<void> {
    if (!db) return;
    const docRef = doc(db, 'users', userId, collectionName, docId);
    await deleteDoc(docRef);
  }
}
