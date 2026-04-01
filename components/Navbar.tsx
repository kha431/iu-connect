"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, setUser } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <nav className="bg-primary text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-2 sm:px-4">
        
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/" className="text-xl sm:text-2xl font-bold flex items-center gap-2 hover:opacity-80 transition">
            <span>🕌</span> <span className="hidden lg:inline">IU Connect</span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4 border-r border-white/20 pr-3 sm:pr-4 text-xs sm:text-base overflow-x-auto whitespace-nowrap">
            <Link href="/market" className={`font-medium transition ${isActive('/market') ? 'text-secondary' : 'text-gray-200 hover:text-white'}`}>السوق</Link>
            <Link href="/groups" className={`font-medium transition ${isActive('/groups') ? 'text-secondary' : 'text-gray-200 hover:text-white'}`}>المجموعات</Link>
            <Link href="/lost" className={`font-medium transition ${isActive('/lost') ? 'text-secondary' : 'text-gray-200 hover:text-white'}`}>المفقودات</Link>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              {/* زر حسابي الجديد */}
              <Link href="/profile" className={`hidden sm:flex items-center gap-1 font-bold transition ${isActive('/profile') ? 'text-secondary' : 'text-gray-200 hover:text-white'}`}>
                <span>👤</span> إعلاناتي
              </Link>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition">
                خروج
              </button>
            </div>
          ) : (
            <Link href="/login" className="bg-secondary hover:bg-yellow-600 text-white px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition">
              دخول
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}