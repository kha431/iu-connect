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
  
  // 🔴 حالة جديدة لفتح وإغلاق قائمة الجوال
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearUser();
    router.push('/login');
  };

  const isActive = (path: string) => pathname.startsWith(path);

  // دالة لإغلاق القائمة عند الضغط على أي رابط في الجوال
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-[#0f4c8a] text-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between" dir="rtl">
        
        {/* اليمين: الشعار وزر القائمة للجوال */}
        <div className="flex items-center gap-3">
          
          {/* 📱 زر القائمة (يظهر فقط في الجوال) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1 rounded-lg hover:bg-white/10 transition focus:outline-none"
          >
            {isMobileMenuOpen ? (
              // أيقونة الإغلاق (X)
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // أيقونة القائمة (الثلاث خطوط)
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* الشعار */}
          <Link href="/market" className="text-2xl sm:text-3xl font-extrabold tracking-tight hover:opacity-90 transition">
            IU Connect
          </Link>
          
          <div className="hidden md:block h-6 w-px bg-white/20 mx-2"></div>
          
          {/* 💻 روابط التنقل الرئيسية (تظهر فقط في الديسكتوب) */}
          <div className="hidden md:flex items-center gap-6 text-lg font-medium">
            <Link href="/market" className={`transition ${isActive('/market') ? 'text-[#fbc02d]' : 'opacity-80 hover:opacity-100 hover:text-[#fbc02d]'}`}>
              السوق
            </Link>
            <Link href="/groups" className={`transition ${isActive('/groups') ? 'text-[#fbc02d]' : 'opacity-80 hover:opacity-100 hover:text-[#fbc02d]'}`}>
              المجموعات
            </Link>
            <Link href="/lost" className={`transition ${isActive('/lost') ? 'text-[#fbc02d]' : 'opacity-80 hover:opacity-100 hover:text-[#fbc02d]'}`}>
              المفقودات
            </Link>
          </div>
        </div>

        {/* اليسار: الأزرار (إعلاناتي، خروج، دخول) */}
        <div className="flex items-center gap-2 sm:gap-4">
          {!mounted ? (
            <div className="w-24 h-10"></div>
          ) : user ? (
            <>
              {/* زر إعلاناتي: صغرنا البادينج شوي في الجوال عشان يكفي */}
              <Link 
                href="/profile" 
                className="flex items-center gap-1.5 sm:gap-2.5 bg-white/10 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-white/10 hover:bg-white/15 transition group"
              >
                <svg className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110 ${isActive('/profile') ? 'text-[#fbc02d]' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className={`font-bold text-sm sm:text-lg ${isActive('/profile') ? 'text-[#fbc02d]' : 'text-white'}`}>إعلاناتي</span>
              </Link>
              
              <button 
                onClick={handleLogout} 
                className="bg-red-600/90 text-white font-bold px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:bg-red-700 transition text-sm sm:text-base"
              >
                خروج
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-[#fbc02d] text-[#0f4c8a] font-bold px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl hover:bg-yellow-500 transition text-sm sm:text-lg shadow-sm">
              تسجيل الدخول
            </Link>
          )}
        </div>
      </div>

      {/* 📱 القائمة المنسدلة للجوال (تفتح فقط إذا ضغطت على الزر) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0c3a6b] border-t border-white/10 shadow-inner absolute w-full left-0 top-full" dir="rtl">
          <div className="px-4 pt-2 pb-4 space-y-2 flex flex-col">
            <Link 
              href="/market" 
              onClick={closeMobileMenu}
              className={`block px-4 py-3 rounded-lg font-bold text-lg transition ${isActive('/market') ? 'bg-white/10 text-[#fbc02d]' : 'text-white hover:bg-white/5'}`}
            >
              🛒 السوق
            </Link>
            <Link 
              href="/groups" 
              onClick={closeMobileMenu}
              className={`block px-4 py-3 rounded-lg font-bold text-lg transition ${isActive('/groups') ? 'bg-white/10 text-[#fbc02d]' : 'text-white hover:bg-white/5'}`}
            >
              👥 المجموعات
            </Link>
            <Link 
              href="/lost" 
              onClick={closeMobileMenu}
              className={`block px-4 py-3 rounded-lg font-bold text-lg transition ${isActive('/lost') ? 'bg-white/10 text-[#fbc02d]' : 'text-white hover:bg-white/5'}`}
            >
              🔍 المفقودات
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}