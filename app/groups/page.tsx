"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// ⏱️ دالة حساب الوقت (منذ كم دقيقة/ساعة)
function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'منذ لحظات';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes === 1) return 'منذ دقيقة';
  if (diffInMinutes === 2) return 'منذ دقيقتين';
  if (diffInMinutes < 11) return `منذ ${diffInMinutes} دقائق`;
  if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours === 1) return 'منذ ساعة';
  if (diffInHours === 2) return 'منذ ساعتين';
  if (diffInHours < 11) return `منذ ${diffInHours} ساعات`;
  if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'منذ يوم';
  if (diffInDays === 2) return 'منذ يومين';
  if (diffInDays < 11) return `منذ ${diffInDays} أيام`;
  if (diffInDays < 30) return `منذ ${diffInDays} يوم`;
  
  return date.toLocaleDateString('ar-SA'); // إذا مر أكثر من شهر، يعرض التاريخ العادي
}

export default function GroupsPage() {
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [joinedGroupIds, setJoinedGroupIds] = useState<number[]>([]);
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [myNumber, setMyNumber] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length > 2) {
        await supabase.from('search_logs').insert([{ term: searchTerm.trim() }]);
      }
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    const savedJoinedGroups = localStorage.getItem('iu_joined_groups');
    if (savedJoinedGroups) {
      setJoinedGroupIds(JSON.parse(savedJoinedGroups));
    }

    const fetchGroups = async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setGroups(data);
      setLoading(false);
    };

    fetchGroups();
  }, []);

  const handleConfirmJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myNumber.trim() || !selectedGroup) return;

    setIsJoining(true);

    const newCount = (selectedGroup.participants || 0) + 1;
    const currentNumbers = selectedGroup.joined_numbers || [];
    const updatedNumbers = [...currentNumbers, myNumber];

    const newJoinedList = [...joinedGroupIds, selectedGroup.id];
    setJoinedGroupIds(newJoinedList);
    localStorage.setItem('iu_joined_groups', JSON.stringify(newJoinedList));
    
    const updatedGroup = { ...selectedGroup, participants: newCount, joined_numbers: updatedNumbers };
    setGroups(prevGroups => prevGroups.map(g => g.id === selectedGroup.id ? updatedGroup : g));
    setSelectedGroup(updatedGroup);
    
    setShowJoinInput(false);
    setMyNumber('');

    const { error } = await supabase.rpc('join_group', {
      p_group_id: selectedGroup.id,
      p_phone_number: myNumber
    });

    setIsJoining(false);

    if (error) {
      console.error("RPC Error:", error);
      alert("حدث خطأ في السيرفر، يرجى المحاولة لاحقاً.");
    }
  };

  const filteredGroups = groups.filter((group) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      group.title?.toLowerCase().includes(searchLower) ||
      group.description?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mb-20">
      
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8 flex flex-col md:flex-row justify-between items-center relative overflow-hidden gap-6">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-100 via-blue-50 to-purple-100"></div>
        <div className="text-right flex-1 pt-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1e3264] mb-2">المجموعات الطلابية 👥</h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">ابحث عن أي شيء تحتاجه.. قروب مذاكرة، مشاوير مثل تبغى ترجع من وإلى الجامعة وتشوف أحد معاك يجي، تشتركوا في غسالة أو غرض، أو حتى ترفيه!</p>
        </div>
        <div className="w-full md:w-auto">
          <Link href="/groups/new" className="bg-[#cca01d] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#b38b17] transition shadow-md w-full md:w-auto text-center inline-block text-lg">
            + إنشاء مجموعة
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <span className="text-gray-400 text-xl">🔍</span>
          </div>
          <input
            type="text"
            placeholder="ابحث عن مجموعة.. (مثال: كرة طائرة، غسالة، مشوار)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pr-12 rounded-2xl border border-gray-200 focus:border-[#0f4c8a] focus:ring-2 focus:ring-[#0f4c8a]/20 outline-none transition shadow-sm text-gray-700 bg-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-[#0f4c8a] border-t-transparent rounded-full animate-spin"></div></div>
      ) : filteredGroups.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
           <span className="text-5xl mb-4 block">📭</span>
           <h2 className="text-xl font-bold text-gray-700">
             {searchTerm ? 'لا توجد نتائج تطابق بحثك' : 'لا يوجد مجموعات حالياً'}
           </h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => {
            const isJoined = joinedGroupIds.includes(group.id);
            return (
              <div 
                key={group.id} 
                onClick={() => { setSelectedGroup(group); setShowJoinInput(false); }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer flex flex-col h-full relative overflow-hidden group-card"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-gray-100 text-gray-600 text-sm font-bold px-3 py-1 rounded-lg">
                    المنضمين: {group.participants || 0} (مفتوح ∞)
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#0f4c8a] mb-3 line-clamp-2">{group.title}</h3>
                <p className="text-gray-500 mb-6 flex-grow line-clamp-2 bg-gray-50 p-4 rounded-xl">{group.description}</p>
                <div className="flex justify-between items-center mt-auto border-t pt-4">
                  {isJoined ? (
                    <span className="bg-green-50 text-green-700 font-bold px-4 py-2 rounded-xl text-sm border border-green-200 flex items-center gap-1">✅ أنت منضم (عرض)</span>
                  ) : (
                    <button className="bg-green-500 text-white font-bold px-6 py-2 rounded-xl text-sm hover:bg-green-600 transition shadow-sm flex items-center gap-1">انضمام 🤝</button>
                  )}
                  {/* 🕒 هنا تم استدعاء دالة الوقت الجديدة */}
                  <span className="text-gray-400 text-sm font-bold flex items-center gap-1">
                    🕒 {formatTimeAgo(group.created_at)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedGroup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button onClick={() => setSelectedGroup(null)} className="absolute top-6 left-6 text-gray-400 hover:text-red-500 transition bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl">✕</button>
            
            <div className="flex mb-6">
              <span className="bg-gray-100 text-gray-600 font-bold px-3 py-1 rounded-lg">المنضمين: {selectedGroup.participants || 0}</span>
            </div>

            <h2 className="text-2xl font-extrabold text-[#0f4c8a] mb-4 leading-tight">{selectedGroup.title}</h2>
            <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedGroup.description}</p>
            </div>
            
            <div className="border-t pt-6">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
                <span>👥</span> قائمة المتصلين والتنسيق
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <span className="font-bold text-[#0f4c8a]">👑 المنشئ الأساسي</span>
                  {selectedGroup.whatsapp ? (
                    <a href={`https://wa.me/${selectedGroup.whatsapp}`} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition flex flex-col items-center gap-1">
                      <span className="text-sm flex items-center gap-1">مراسلة 💬</span>
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full tracking-widest" dir="ltr">{selectedGroup.whatsapp}</span>
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">لا يوجد رقم</span>
                  )}
                </div>

                {selectedGroup.joined_numbers && selectedGroup.joined_numbers.map((num: string, index: number) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="font-bold text-gray-700">👤 زميل منضم ({index + 1})</span>
                    <a href={`https://wa.me/${num}`} target="_blank" rel="noopener noreferrer" className="text-[#25D366] px-4 py-2 rounded-lg font-bold hover:bg-green-50 transition border border-[#25D366] flex flex-col items-center gap-1">
                      <span className="text-sm flex items-center gap-1">مراسلة 💬</span>
                      <span className="text-xs bg-[#25D366]/10 px-2 py-0.5 rounded-full text-gray-600 tracking-widest" dir="ltr">{num}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              {joinedGroupIds.includes(selectedGroup.id) ? (
                 <div className="w-full bg-green-50 text-green-700 py-4 rounded-xl font-bold text-lg text-center border border-green-200">
                   ✅ أنت منضم وموجود في القائمة
                 </div>
              ) : showJoinInput ? (
                <form onSubmit={handleConfirmJoin} className="flex gap-2">
                  <input 
                    type="text" 
                    required 
                    placeholder="أدخل رقمك للتواصل (مثال: 05...)" 
                    value={myNumber}
                    onChange={(e) => setMyNumber(e.target.value)}
                    className="flex-1 p-4 border rounded-xl outline-none focus:border-green-500 text-left" dir="ltr"
                  />
                  <button type="submit" disabled={isJoining} className="bg-green-500 text-white px-8 rounded-xl font-extrabold text-lg hover:bg-green-600 transition shadow-sm disabled:opacity-70">
                    {isJoining ? 'جاري...' : 'تأكيد'}
                  </button>
                  <button type="button" onClick={() => setShowJoinInput(false)} className="bg-gray-100 text-gray-600 px-4 rounded-xl font-bold hover:bg-gray-200">إلغاء</button>
                </form>
              ) : (
                <button onClick={() => setShowJoinInput(true)} className="w-full bg-[#fbc02d] text-[#0f4c8a] py-4 rounded-xl font-extrabold text-lg hover:bg-yellow-500 transition shadow-sm">
                  انضم للمجموعة وسجل رقمك
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}