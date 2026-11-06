import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { UserProfile, CurrencyCode } from '../types';

const googleProvider = new GoogleAuthProvider();



export async function registerWithEmail(
  fullName: string,
  email: string,
  password: string,
  currency: CurrencyCode = 'EGP'
): Promise<UserProfile> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Set auth display name
  await updateProfile(user, { displayName: fullName });

  const profileData: Omit<UserProfile, 'uid'> = {
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    currency,
    createdAt: new Date().toISOString(),
  };

  const userDocRef = doc(db, 'users', user.uid);
  try {
    await setDoc(userDocRef, profileData);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}`);
  }

  return {
    uid: user.uid,
    ...profileData,
  };
}

export async function loginWithEmail(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle(): Promise<UserProfile> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Check if profile exists, if not initialize
  const userDocRef = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) {
      const cleanName = (user.displayName || user.email?.split('@')[0] || 'Student').trim();
      const profileData: Record<string, any> = {
        fullName: cleanName.length >= 2 ? cleanName : 'Student',
        email: (user.email || '').trim().toLowerCase(),
        currency: 'EGP',
        createdAt: new Date().toISOString(),
      };
      if (user.photoURL) {
        profileData.photoURL = user.photoURL;
      }
      await setDoc(userDocRef, profileData);
      return {
        uid: user.uid,
        fullName: profileData.fullName,
        email: profileData.email,
        currency: profileData.currency,
        photoURL: profileData.photoURL,
        createdAt: profileData.createdAt,
      };
    } else {
      const data = snap.data();
      return {
        uid: user.uid,
        fullName: data.fullName || user.displayName || 'Student',
        email: data.email || user.email || '',
        currency: (data.currency as CurrencyCode) || 'EGP',
        photoURL: data.photoURL || user.photoURL || undefined,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt,
      };
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const userDocRef = doc(db, 'users', userId);
  try {
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      uid: userId,
      fullName: data.fullName,
      email: data.email,
      currency: data.currency || 'EGP',
      photoURL: data.photoURL,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${userId}`);
  }
}

export async function updateUserProfile(
  userId: string,
  updates: { fullName?: string; currency?: CurrencyCode; photoURL?: string }
): Promise<void> {
  const userDocRef = doc(db, 'users', userId);
  const cleanUpdates: Record<string, any> = {
    updatedAt: new Date().toISOString(),
  };

  if (updates.fullName !== undefined) cleanUpdates.fullName = updates.fullName.trim();
  if (updates.currency !== undefined) cleanUpdates.currency = updates.currency;
  if (updates.photoURL !== undefined) cleanUpdates.photoURL = updates.photoURL;

  try {
    await updateDoc(userDocRef, cleanUpdates);
    if (auth.currentUser && updates.fullName) {
      await updateProfile(auth.currentUser, { displayName: updates.fullName });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
  }
}

export async function sendResetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function changeUserPassword(newPassword: string): Promise<void> {
  if (!auth.currentUser) throw new Error('No authenticated user');
  await updatePassword(auth.currentUser, newPassword);
}

export async function logoutUser(): Promise<void> {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem('studentwallet_manual_signout', 'true');
  }
  await signOut(auth);
}
