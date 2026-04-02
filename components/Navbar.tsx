"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const user = useAuthStore((state: any) => state.user);
  const clearUser = useAuthStore((state: any) => state.clearUser);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearUser();
    router.push('/login');
  };

  // دالة صغيرة تتأكد إذا الطالب في هذا القسم عشان تعطيه اللون الذهبي
  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <nav className="bg-[#0f4c8a] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between" dir="rtl">
        
        {/* اليمين: الشعار والعنوان */}
        <div className="flex items-center gap-2">
          <Link href="/market" className="text-3xl font-extrabold tracking-tight hover:opacity-90 transition">
            IU Connect
          </Link>
          <div className="h-6 w-px bg-white/20 mx-2"></div>
          
          {/* روابط التنقل الرئيسية (تتغير ألوانها حسب القسم النشط) */}
          <div className="hidden md:flex items-center gap-6 text-lg font-medium">
            <Link 
              href="/market" 
              className={`transition ${isActive('/market') ? 'text-[#fbc02d]' : 'opacity-80 hover:opacity-100 hover:text-[#fbc02d]'}`}
            >
              السوق
            </Link>
            <Link 
              href="/groups" 
              className={`transition ${isActive('/groups') ? 'text-[#fbc02d]' : 'opacity-80 hover:opacity-100 hover:text-[#fbc02d]'}`}
            >
              المجموعات
            </Link>
            <Link 
              href="/lost" 
              className={`transition ${isActive('/lost') ? 'text-[#fbc02d]' : 'opacity-80 hover:opacity-100 hover:text-[#fbc02d]'}`}
            >
              المفقودات
            </Link>
          </div>
        </div>

        {/* اليسار: الأزرار */}
        <div className="flex items-center gap-4">
          {!mounted ? (
            <div className="w-32 h-10"></div>
          ) : user ? (
            <>
              <Link 
                href="/profile" 
                className="flex items-center gap-2.5 bg-white/10 px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/15 transition group"
              >
                <svg 
                  className={`w-6 h-6 transition-transform group-hover:scale-110 ${isActive('/profile') ? 'text-[#fbc02d]' : 'text-white'}`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className={`font-bold text-lg ${isActive('/profile') ? 'text-[#fbc02d]' : 'text-white'}`}>إعلاناتي</span>
              </Link>
              
              <button 
                onClick={handleLogout} 
                className="bg-red-600/90 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-red-700 transition"
              >
                خروج
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-[#fbc02d] text-[#0f4c8a] font-bold px-6 py-2.5 rounded-xl hover:bg-yellow-500 transition text-lg shadow-sm">
              تسجيل الدخول
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}