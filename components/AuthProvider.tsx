"use client";

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state: any) => state.setUser);
  const clearUser = useAuthStore((state: any) => state.clearUser);

  useEffect(() => {
    // 1. 
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(session.user);
      else clearUser();
    });

    // 2. 
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUser(session.user);
      else clearUser();
    });

    return () => subscription.unsubscribe();
  }, [setUser, clearUser]);

  return <>{children}</>;
}