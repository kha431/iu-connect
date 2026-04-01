"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function GroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchGroups();
  }, []);

  async function fetchGroups() {
    // نجيب المجموعات ومعاها عدد المنضمين
    const { data } = await supabase
      .from('groups')
      .select('*, group_members(user_id)')
      .order('created_at', { ascending: false });
    if (data) setGroups(data);
    setLoading(false);
  }

  const getTypeStyles = (type: string) => {
    switch(type) {
      case 'ride': return { label: 'مشوار 🚗', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'split': return { label: 'قطة 🍕', color: 'bg-green-50 text-green-700 border-green-200' };
      case 'study': return { label: 'مذاكرة 📚', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      default: return { label: 'أخرى 🤝', color: 'bg-gray-50 text-gray-700 border-gray-200' };
    }
  };

  const handleJoin = async (groupId: string, whatsappLink: string) => {
    if (!user) {
      alert("يجب تسجيل الدخول أولاً للانضمام!");
      return;
    }

    // تسجيل الطالب في المجموعة بقاعدة البيانات
    const { error } = await supabase
      .from('group_members')
      .insert({ group_id: groupId, user_id: user.id });

    // إذا ما فيه خطأ (أو الخطأ عبارة عن إنه مسجل مسبقاً)، نفتح له الواتساب ونحدث الصفحة
    if (!error || error.code === '23505') { 
      window.open(whatsappLink, '_blank');
      fetchGroups(); // تحديث الأرقام فوراً
    } else {
      alert("حدث خطأ أثناء الانضمام.");
    }
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-purple-500 opacity-20"></div>
        <div>
          <h1 className="text-2xl font-bold text-primary mb-1">المجموعات الطلابية 👥</h1>
          <p className="text-gray-500 text-sm">طالع مشوار؟ بتطلبون أكل وبتقطون؟ أو تبحث عن قروب مذاكرة؟ نسّق هنا!</p>
        </div>
        <Link href="/groups/new" className="bg-secondary hover:bg-yellow-600 text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 w-full sm:w-auto justify-center z-10">
          <span className="text-xl">+</span> إنشاء مجموعة
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500 font-medium">جاري تحميل المجموعات... ⏳</div>
      ) : groups.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
          <span className="text-6xl block mb-4">🪑</span>
          <h3 className="text-xl font-bold text-primary mb-2">لا توجد مجموعات نشطة حالياً!</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => {
            const style = getTypeStyles(group.type);
            const whatsappNumber = group.whatsapp?.startsWith('0') ? '966' + group.whatsapp.slice(1) : group.whatsapp;
            const whatsappLink = `https://wa.me/${whatsappNumber}?text=السلام عليكم، بخصوص مجموعة (${group.title}) في منصة IU Connect... أنا حاب أنضم معكم!`;
            
            // حساب الأرقام (المنضمين والمتبقي)
            const currentMembersCount = group.group_members?.length || 0;
            const maxMembers = group.max_members;
            const isFull = maxMembers > 0 && currentMembersCount >= maxMembers;
            const isUserJoined = user ? group.group_members?.some((m: any) => m.user_id === user.id) : false;

            return (
              <div key={group.id} className={`bg-white rounded-xl shadow-sm border ${isFull ? 'border-red-200' : 'border-gray-100'} p-5 flex flex-col hover:shadow-md transition h-full relative`}>
                
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-3 py-1 rounded-md text-xs font-bold border ${style.color}`}>
                    {style.label}
                  </span>
                  
                  {/* عرض العداد */}
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg border ${isFull ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                    {maxMembers === 0 ? (
                      `المنضمين: ${currentMembersCount} (مفتوح ♾️)`
                    ) : (
                      `المنضمين: ${currentMembersCount} من ${maxMembers} ${isFull ? '(مكتمل 🛑)' : `(باقي ${maxMembers - currentMembersCount})`}`
                    )}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-primary mb-2 line-clamp-1">{group.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {group.description}
                </p>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-400">{new Date(group.created_at).toLocaleDateString('ar-SA')}</span>
                  
                  {/* زر الانضمام يتغير حسب الحالة */}
                  {isFull && !isUserJoined ? (
                    <button disabled className="bg-gray-100 text-gray-400 cursor-not-allowed text-sm font-bold py-2 px-4 rounded-lg flex items-center gap-2">
                      مكتمل 🛑
                    </button>
                  ) : isUserJoined ? (
                    <button onClick={() => window.open(whatsappLink, '_blank')} className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                      <span>💬</span> أنت منضم (تواصل)
                    </button>
                  ) : (
                    <button onClick={() => handleJoin(group.id, whatsappLink)} className="bg-[#25D366] hover:bg-[#1ebd5a] text-white text-sm font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                      <span>👋</span> انضمام
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}