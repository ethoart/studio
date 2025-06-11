
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import type { DocumentData } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { User as AppUser, UserRole } from '@/types';

interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isAdminUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      setLoading(true); 

      if (fbUser) {
        let finalUserRole: UserRole = 'customer'; // Default role
        let finalIsAdmin = false;
        let finalUserName: string | null | undefined = fbUser.displayName;
        let finalUserCreatedAt: AppUser['createdAt'] = undefined;

        // Fetch user profile from Firestore
        const userDocRef = doc(db, 'users', fbUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data() as DocumentData; // Use DocumentData for broader typing
          // Firestore role is the primary source of truth if the document exists
          finalUserRole = (userData.role as UserRole) || 'customer'; 
          finalUserName = userData.name || fbUser.displayName;
          finalUserCreatedAt = userData.createdAt;
        } else if (fbUser.email === "admin@example.com") {
          // If Firestore document doesn't exist, check if it's the special admin email
          finalUserRole = 'admin';
        }
        // If no Firestore doc and not the special admin email, role remains 'customer' from default

        // Determine admin status based on the final resolved role
        if (finalUserRole === 'admin' || finalUserRole === 'super admin') {
          finalIsAdmin = true;
        }

        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          name: finalUserName,
          role: finalUserRole,
          createdAt: finalUserCreatedAt,
        });
        setIsAdminUser(finalIsAdmin);

      } else {
        // No Firebase user logged in
        setUser(null);
        setIsAdminUser(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, isAdminUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
