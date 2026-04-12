"use client";

import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state: any) => state.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 
  if (!mounted) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-12 h-12 border-4 border-[#0f4c8a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <span className="text-6xl mb-4">🔒</span>
        <h1 className="text-3xl font-bold text-[#0f4c8a]">سجل دخولك أولاً!</h1>
        <p className="text-gray-500">يجب عليك تسجيل الدخول للوصول إلى هذه الصفحة</p>
        <Link href="/login" className="mt-4 bg-[#fbc02d] text-[#0f4c8a] px-10 py-3 rounded-xl font-bold text-lg hover:bg-yellow-500 transition shadow-md">
          دخول
        </Link>
      </div>
    );
  }

  // 
  return <>{children}</>;
}