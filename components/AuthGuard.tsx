"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      // الفحص الأكيد والمباشر من قاعدة البيانات
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
      }
      setIsChecking(false);
    };
    verifyUser();
  }, []);

  // شاشة الانتظار (تمنع الطرد السريع)
  if (isChecking) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 border-4 border-[#0f4c8a] border-t-transparent rounded-full animate-spin"></div>
        <div className="text-xl font-bold text-[#0f4c8a] animate-pulse">جاري التحقق من هويتك...</div>
      </div>
    );
  }

  // إذا السيرفر أكد إنك مو مسجل، يطلع القفل
  if (!isAuthenticated) {
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

  // إذا مسجل، يفتح له الصفحة بكل سلاسة
  return <>{children}</>;
}