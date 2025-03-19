'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebaseconfig';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseconfig';
import type { UserProfile } from '@/types/user';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Redirigir si el usuario ya está autenticado y trata de acceder a rutas restringidas
        const pathname = window.location.pathname;
        if (['/auth', '/auth/login', '/auth/register'].includes(pathname)) {
          router.push('/'); // Redirigir a la página principal u otra página adecuada
        }
        // Obtener datos adicionales del usuario desde Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile({
            uid: user.uid,
            email: user.email,
            ...userDoc.data(),
          } as UserProfile);
        }
      } else {
        setUserProfile(null);
        const pathname = window.location.pathname;
        if (!['/auth', '/auth/login', '/auth/register'].includes(pathname)) {
          router.push('/auth');
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
