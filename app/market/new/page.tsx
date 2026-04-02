"use client";

import AuthGuard from '@/components/AuthGuard';
import Link from 'next/link';

export default function AddListingPage() {
  return (
    <AuthGuard>
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-lg border border-gray-100 mb-20 text-center">
        <h1 className="text-3xl font-extrabold text-[#0f4c8a] mb-8">إضافة إعلان جديد 📦</h1>
        <div className="bg-green-50 text-green-700 p-6 rounded-xl font-bold">
           🎉 تم التحقق بنجاح! أنت مسجل دخول ويمكنك إضافة الإعلان.
        </div>
        <Link href="/market" className="mt-8 px-8 bg-gray-200 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-300 transition inline-block">
          العودة للسوق
        </Link>
      </div>
    </AuthGuard>
  );
}