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

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const isAdmin = user && user.email === ADMIN_EMAIL;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearUser();
    router.push('/login');
  };

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <nav className="bg-[#0f4c8a] text-white shadow-md relative z-50">
      
      {/*  */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between" dir="rtl">
        <div className="flex items-center gap-3">
          
          {/* الشعار */}
          <Link href="/market" className="text-2xl sm:text-3xl font-extrabold tracking-tight hover:opacity-90 transition">
            IU Connect
          </Link>
          
          <div className="hidden md:block h-6 w-px bg-white/20 mx-2"></div>
          
          {/* */}
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

        {/* */}
        <div className="flex items-center gap-2 sm:gap-4">
          {!mounted ? (
            <div className="w-24 h-10"></div>
          ) : user ? (
            <>
              {/* */}
              {isAdmin && (
                <Link href="/admin" className="flex items-center gap-1 sm:gap-2 bg-[#fbc02d]/20 px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-[#fbc02d]/50 hover:bg-[#fbc02d]/30 transition">
                  <span className={`font-bold text-sm sm:text-base ${isActive('/admin') ? 'text-white' : 'text-[#fbc02d]'}`}>👑 الإدارة</span>
                </Link>
              )}

              <Link href="/profile" className="flex items-center gap-1.5 sm:gap-2.5 bg-white/10 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-white/10 hover:bg-white/15 transition group">
                <span className={`font-bold text-sm sm:text-lg ${isActive('/profile') ? 'text-[#fbc02d]' : 'text-white'}`}>إعلاناتي</span>
              </Link>
              <button onClick={handleLogout} className="bg-red-600/90 text-white font-bold px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:bg-red-700 transition text-sm sm:text-base">
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

      {/*  */}
      <div className="md:hidden flex items-center justify-around bg-[#0c3a6b] px-1 py-1.5 border-t border-white/10 shadow-inner" dir="rtl">
        <Link href="/market" className={`flex-1 text-center py-2 font-bold text-sm transition ${isActive('/market') ? 'text-[#fbc02d] bg-white/5 rounded-lg' : 'text-white hover:text-gray-200'}`}>
          🛒 السوق
        </Link>
        
        <div className="w-px h-5 bg-white/20"></div>
        
        <Link href="/groups" className={`flex-1 text-center py-2 font-bold text-sm transition ${isActive('/groups') ? 'text-[#fbc02d] bg-white/5 rounded-lg' : 'text-white hover:text-gray-200'}`}>
          👥 المجموعات
        </Link>
        
        <div className="w-px h-5 bg-white/20"></div>
        
        <Link href="/lost" className={`flex-1 text-center py-2 font-bold text-sm transition ${isActive('/lost') ? 'text-[#fbc02d] bg-white/5 rounded-lg' : 'text-white hover:text-gray-200'}`}>
          🔍 المفقودات
        </Link>
      </div>
      
    </nav>
  );
}