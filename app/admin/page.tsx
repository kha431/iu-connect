"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({ market: 0, groups: 0, lost: 0 });

  // 🔴🔴 غيّر هذا الإيميل وحط إيميلك الشخصي اللي مسجل فيه بالموقع!
  const ADMIN_EMAIL = "k8235411@gmail.com";

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      
      // إذا مو مسجل دخول، أو إيميله مو إيميل المدير -> اطرده للصفحة الرئيسية!
      if (!user || user.email !== ADMIN_EMAIL) {
        router.push('/');
        return;
      }
      setIsAdmin(true);

      // جلب الإحصائيات السريعة للموقع
      const { count: mCount } = await supabase.from('market_items').select('*', { count: 'exact', head: true });
      const { count: gCount } = await supabase.from('groups').select('*', { count: 'exact', head: true });
      const { count: lCount } = await supabase.from('lost_found').select('*', { count: 'exact', head: true });
      setStats({ market: mCount || 0, groups: gCount || 0, lost: lCount || 0 });

      // جلب آخر عمليات البحث (عقلية رائد الأعمال)
      const { data: searchData } = await supabase.from('search_logs').select('*').order('created_at', { ascending: false }).limit(20);
      if (searchData) setLogs(searchData);
    }
    checkAdmin();
  }, [router]);

  if (!isAdmin) return <div className="text-center py-20 text-[#0f4c8a] font-bold">جاري التحقق من الصلاحيات الأمنية... 🕵️‍♂️</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4 sm:p-8 mb-20 font-sans">
      
      <div className="bg-gradient-to-r from-gray-900 to-[#0f4c8a] rounded-3xl p-8 mb-8 text-white shadow-xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold mb-2">مركز القيادة (Admin) 👑</h1>
          <p className="text-gray-200">مرحباً بك يا مدير المنصة. الأرقام تتحدث هنا.</p>
        </div>
        <span className="text-6xl drop-shadow-lg">📈</span>
      </div>

      {/* إحصائيات المنصة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="text-4xl mb-2">🛒</div>
          <h3 className="text-gray-500 font-bold mb-1">إعلانات السوق</h3>
          <p className="text-3xl font-extrabold text-[#0f4c8a]">{stats.market}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="text-4xl mb-2">👥</div>
          <h3 className="text-gray-500 font-bold mb-1">المجموعات الطلابية</h3>
          <p className="text-3xl font-extrabold text-[#0f4c8a]">{stats.groups}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="text-4xl mb-2">🔍</div>
          <h3 className="text-gray-500 font-bold mb-1">المفقودات</h3>
          <p className="text-3xl font-extrabold text-[#0f4c8a]">{stats.lost}</p>
        </div>
      </div>

      {/* سجلات بحث الطلاب (الكنز الحقيقي) */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-[#0f4c8a] mb-6 flex items-center gap-2">
          <span>🎯</span> ماذا يبحث الطلاب الآن؟
        </h2>
        
        {logs.length === 0 ? (
          <p className="text-gray-500 text-center py-10">لا توجد عمليات بحث حتى الآن.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {logs.map((log) => (
              <div key={log.id} className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl flex items-center gap-3 hover:bg-gray-100 transition">
                <span className="font-bold text-gray-800">{log.term}</span>
                <span className="text-xs text-gray-400">{new Date(log.created_at).toLocaleTimeString('ar-SA')}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}