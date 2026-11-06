import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getUserProfile, updateUserProfile } from '../services/authService';
import { initializeDefaultCategories } from '../services/categoryService';
import { UserProfile, CurrencyCode } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  profile: UserProfile | null;
  currency: CurrencyCode;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  updateCurrency: (newCurrency: CurrencyCode) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (user: FirebaseUser) => {
    try {
      let userProfile = await getUserProfile(user.uid);

      if (!userProfile) {
        userProfile = {
          uid: user.uid,
          fullName: user.displayName || user.email?.split('@')[0] || 'Student',
          email: user.email || '',
          currency: 'EGP',
          photoURL: user.photoURL || undefined,
          createdAt: new Date().toISOString(),
        };
      }

      setProfile(userProfile);
      await initializeDefaultCategories(user.uid);
    } catch (err) {
      console.error('Failed to load profile or initialize categories:', err);
      // Keep the authenticated session usable even if profile/category loading fails.
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (!isActive) return;

      setCurrentUser(user);

      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        await fetchProfile(user);
      } finally {
        // Always release the loading screen, even if Firestore/profile setup fails.
        if (isActive) setLoading(false);
      }
    }, error => {
      console.error('Authentication state listener failed:', error);
      if (isActive) {
        setCurrentUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [fetchProfile]);

  const refreshProfile = useCallback(async () => {
    if (currentUser) {
      await fetchProfile(currentUser);
    }
  }, [currentUser, fetchProfile]);

  const updateCurrency = useCallback(
    async (newCurrency: CurrencyCode) => {
      if (!currentUser) return;
      await updateUserProfile(currentUser.uid, { currency: newCurrency });
      setProfile(prev => (prev ? { ...prev, currency: newCurrency } : null));
    },
    [currentUser]
  );

  const currency: CurrencyCode = profile?.currency || 'EGP';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        profile,
        currency,
        loading,
        refreshProfile,
        updateCurrency,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
