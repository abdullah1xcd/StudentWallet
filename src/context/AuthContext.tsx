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
      let p = await getUserProfile(user.uid);
      if (!p) {
        // Fallback profile if record wasn't present
        p = {
          uid: user.uid,
          fullName: user.displayName || user.email?.split('@')[0] || 'Student',
          email: user.email || '',
          currency: 'EGP',
          photoURL: user.photoURL || undefined,
          createdAt: new Date().toISOString(),
        };
      }
      setProfile(p);
      // Auto-initialize categories if newly created
      await initializeDefaultCategories(user.uid);
    } catch (err) {
      console.error('Failed to load profile or initialize categories:', err);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Safety timeout: ensure loading state never hangs indefinitely under network/auth provider delays
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 4000);

    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (!isMounted) return;
      setCurrentUser(user);
      if (user) {
        try {
          await fetchProfile(user);
        } catch (e) {
          console.error('Error fetching profile:', e);
        } finally {
          if (isMounted) setLoading(false);
        }
      } else {
        setProfile(null);
        if (isMounted) setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
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
