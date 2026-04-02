"use client";

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, clearUser } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearUser();
    router.push('/login');
  };

  return (
    <nav className="bg-[#0f4c8a] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between" dir="rtl">
        
        {/* اليمين: الشعار والعنوان (بدون إيموجي) */}
        <div className="flex items-center gap-2">
          <Link href="/" className="text-3xl font-extrabold tracking-tight hover:opacity-90 transition">
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

        {/* اليسار: إجراءات المستخدم (خروج + إعلاناتي بأيقونة واضحة) */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* أيقونة الملف الشخصي وإعلاناتي (تم تحسينها) */}
              <Link href="/profile" className="flex items-center gap-2.5 bg-white/10 px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/15 transition group">
                {/* أيقونة مستخدم واضحة كـ SVG بدلاً من الإيموجي الباهت */}
                <svg 
                  className="w-6 h-6 text-secondary group-hover:scale-110 transition-transform" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-bold text-lg">إعلاناتي</span>
              </Link>
              
              {/* زر الخروج الأحمر */}
              <button 
                onClick={handleLogout}
                className="bg-red-600/90 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-red-700 transition"
              >
                خروج
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-secondary text-primary-dark font-bold px-6 py-2.5 rounded-xl hover:bg-[#fbc02d] transition text-lg">
              تسجيل الدخول
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}