"use client";

import AuthGuard from '@/components/AuthGuard';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <AuthGuard>
      <div className="max-w-6xl mx-auto mt-10 p-8 mb-20">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-[#0f4c8a] mb-2">إعلاناتي 📦</h1>
          <p className="text-gray-500 font-medium">مرحباً بك في لوحة تحكم إعلاناتك</p>
        </div>
        
        <div className="bg-gray-50 rounded-3xl border border-gray-100 p-16 text-center">
           <span className="text-5xl mb-4 block">📭</span>
           <h2 className="text-xl font-bold text-gray-700">لا يوجد لديك إعلانات حالياً</h2>
           <p className="text-gray-500 mt-2 mb-6">ابدأ ببيع أشيائك الزائدة الآن!</p>
           <Link href="/market/new" className="bg-[#0f4c8a] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#0c3a6b] transition inline-block">
             + أضف إعلانك الأول
           </Link>
        </div>
      </div>
    </AuthGuard>
  );
}