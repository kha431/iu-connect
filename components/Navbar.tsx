"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function Navbar() {
  const router = useRouter();
  
  // نستخدم هذه الحالات عشان نمنع لخبطة الشاشة وتعارض الذاكرة
  const [isClient, setIsClient] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    setIsClient(true); // تأكيد إننا في متصفح الطالب

    // فحص حالة الدخول مباشرة من السيرفر (أضمن طريقة)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSessionActive(!!session);
    };
    checkSession();

    // رادار يراقب أي تغيير (دخول أو خروج) ويتحدث فوراً
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionActive(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearUser(); // تنظيف الذاكرة
    setSessionActive(false);
    router.push('/login');
  };

  return (
    <nav className="bg-[#0f4c8a] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between" dir="rtl">
        
        {/* اليمين: الشعار والعنوان (بدون إيموجي وبشكل نظيف) */}
        <div className="flex items-center gap-2">
          <Link href="/market" className="text-3xl font-extrabold tracking-tight hover:opacity-90 transition">
            IU Connect
          </Link>
          <div className="h-6 w-px bg-white/20 mx-2"></div>
          
          {/* روابط التنقل الرئيسية */}
          <div className="hidden md:flex items-center gap-6 text-lg font-medium">
            <Link href="/market" className="hover:text-secondary transition text-[#fbc02d]">السوق</Link>
            <Link href="/groups" className="hover:text-secondary transition opacity-80 hover:opacity-100">المجموعات</Link>
            <Link href="/lost" className="hover:text-secondary transition opacity-80 hover:opacity-100">المفقودات</Link>
          </div>
        </div>

        {/* اليسار: الأزرار */}
        <div className="flex items-center gap-4">
          {/* لا نعرض الأزرار إلا بعد التأكد من حالة الطالب لتجنب الرمش (Flickering) */}
          {isClient ? (
            sessionActive ? (
              <>
                <Link href="/profile" className="flex items-center gap-2.5 bg-white/10 px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/15 transition group">
                  <svg className="w-6 h-6 text-[#fbc02d] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-bold text-lg">إعلاناتي</span>
                </Link>
                
                <button onClick={handleLogout} className="bg-red-600/90 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-red-700 transition">
                  خروج
                </button>
              </>
            ) : (
              <Link href="/login" className="bg-[#fbc02d] text-[#0f4c8a] font-bold px-6 py-2.5 rounded-xl hover:bg-yellow-500 transition text-lg shadow-sm">
                تسجيل الدخول
              </Link>
            )
          ) : (
            <div className="w-32 h-10"></div> // مساحة فارغة مؤقتة للحفاظ على توازن التصميم
          )}
        </div>
      </div>
    </nav>
  );
}