"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({ market: 0, groups: 0, lost: 0 });
  
  // بيانات الجداول للإدارة
  const [activeTab, setActiveTab] = useState<'market' | 'groups' | 'lost'>('market');
  const [items, setItems] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== ADMIN_EMAIL) {
        router.push('/');
        return;
      }
      setIsAdmin(true);
      fetchStatsAndLogs();
      fetchItems('market'); // افتراضياً نجلب بيانات السوق أول ما يفتح
    }
    checkAdmin();
  }, [router]);

  // جلب الإحصائيات وسجلات البحث
  const fetchStatsAndLogs = async () => {
    const { count: mCount } = await supabase.from('market_items').select('*', { count: 'exact', head: true });
    const { count: gCount } = await supabase.from('groups').select('*', { count: 'exact', head: true });
    const { count: lCount } = await supabase.from('lost_found').select('*', { count: 'exact', head: true });
    setStats({ market: mCount || 0, groups: gCount || 0, lost: lCount || 0 });

    const { data: searchData } = await supabase.from('search_logs').select('*').order('created_at', { ascending: false }).limit(20);
    if (searchData) setLogs(searchData);
  };

  // جلب البيانات حسب التبويب النشط
  const fetchItems = async (table: 'market' | 'groups' | 'lost') => {
    setLoadingItems(true);
    let tableName = table === 'market' ? 'market_items' : table === 'lost' ? 'lost_found' : 'groups';
    const { data } = await supabase.from(tableName).select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
    setLoadingItems(false);
  };

  // تغيير التبويب
  const handleTabChange = (tab: 'market' | 'groups' | 'lost') => {
    setActiveTab(tab);
    fetchItems(tab);
  };

  // ✨ دالة الحذف الخاصة بالمدير
  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا العنصر نهائياً؟')) return;

    let tableName = activeTab === 'market' ? 'market_items' : activeTab === 'lost' ? 'lost_found' : 'groups';
    
    // محاولة الحذف
    const { error } = await supabase.from(tableName).delete().eq('id', id);
    
    if (error) {
      console.error(error);
      alert('تم رفض الحذف! (نحتاج نعطيك صلاحية المدير في قاعدة البيانات SQL، ببلغك كيف بعدين)');
    } else {
      alert('تم الحذف بنجاح! 🗑️');
      fetchItems(activeTab); // تحديث القائمة
      fetchStatsAndLogs();   // تحديث العدادات
    }
  };

  if (!isAdmin) return <div className="text-center py-20 text-[#0f4c8a] font-bold">جاري التحقق من الصلاحيات الأمنية... 🕵️‍♂️</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4 sm:p-8 mb-20 font-sans">
      
      <div className="bg-gradient-to-r from-gray-900 to-[#0f4c8a] rounded-3xl p-8 mb-8 text-white shadow-xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold mb-2">مركز القيادة (Admin) 👑</h1>
          <p className="text-gray-200">مرحباً بك يا مدير المنصة. لديك التحكم الكامل هنا.</p>
        </div>
        <span className="text-6xl drop-shadow-lg">🛡️</span>
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

      {/* سجلات بحث الطلاب */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
        <h2 className="text-2xl font-bold text-[#0f4c8a] mb-6 flex items-center gap-2">
          <span>🎯</span> ماذا يبحث الطلاب الآن؟
        </h2>
        {logs.length === 0 ? (
          <p className="text-gray-500 text-center py-4">لا توجد عمليات بحث حتى الآن.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {logs.map((log) => (
              <div key={log.id} className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl flex items-center gap-3">
                <span className="font-bold text-gray-800">{log.term}</span>
                <span className="text-xs text-gray-400">{new Date(log.created_at).toLocaleTimeString('ar-SA')}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 👑 أدوات الإدارة: التحكم في المحتوى */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-red-600 mb-6 flex items-center gap-2">
          <span>⚙️</span> إدارة المحتوى (حذف العناصر)
        </h2>

        {/* التبويبات */}
        <div className="flex gap-2 mb-6 border-b pb-4 overflow-x-auto">
          <button onClick={() => handleTabChange('market')} className={`px-6 py-2 rounded-lg font-bold transition whitespace-nowrap ${activeTab === 'market' ? 'bg-[#0f4c8a] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>🛒 السوق</button>
          <button onClick={() => handleTabChange('groups')} className={`px-6 py-2 rounded-lg font-bold transition whitespace-nowrap ${activeTab === 'groups' ? 'bg-[#0f4c8a] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>👥 المجموعات</button>
          <button onClick={() => handleTabChange('lost')} className={`px-6 py-2 rounded-lg font-bold transition whitespace-nowrap ${activeTab === 'lost' ? 'bg-[#0f4c8a] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>🔍 المفقودات</button>
        </div>

        {/* عرض العناصر للحذف */}
        {loadingItems ? (
          <div className="text-center py-10 text-gray-500">جاري تحميل البيانات...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-10 text-gray-500">لا يوجد عناصر في هذا القسم حالياً.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {items.map(item => (
              <div key={item.id} className="border rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50 hover:bg-red-50/30 transition">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                  <p className="text-xs text-gray-400 mt-2">ID: {item.id} | {new Date(item.created_at).toLocaleDateString('ar-SA')}</p>
                </div>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-100 text-red-600 font-bold px-6 py-2 rounded-lg hover:bg-red-600 hover:text-white transition whitespace-nowrap w-full md:w-auto"
                >
                  حذف 🗑️
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}