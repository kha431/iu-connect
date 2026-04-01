"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function timeAgo(dateString: string) {
  const diff = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
  return `قبل ${Math.floor(diff / 86400)} يوم`;
}

export default function HomePage() {
  const router = useRouter();
  const [latestListings, setLatestListings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchLatest() {
      const { data } = await supabase.from('listings').select('*').order('created_at', { ascending: false }).limit(6);
      if (data) setLatestListings(data);
    }
    fetchLatest();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) router.push(`/market?q=${searchTerm}`);
  };

  const categories = [
    { name: 'حراج الكتب', icon: '📚', color: 'bg-emerald-50 text-emerald-600' },
    { name: 'سيارات ودراجات', icon: '🚗', color: 'bg-red-50 text-red-600' },
    { name: 'حراج الأجهزة', icon: '💻', color: 'bg-blue-50 text-blue-600' },
    { name: 'حراج الأثاث', icon: '🛏️', color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="space-y-12 pb-16 mt-4">
      
      {/* البانر الرئيسي */}
      <section className="bg-primary text-white rounded-3xl p-8 md:p-14 shadow-xl text-center space-y-8 relative overflow-hidden">
        <h1 className="text-3xl md:text-5xl font-extrabold relative z-10">منصة الجامعة الإسلامية 🕌</h1>
        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto relative z-10">
          مكانك الأول للبيع والشراء، البحث عن شركاء للمذاكرة، أو الإعلان عن المفقودات.
        </p>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex bg-white rounded-2xl p-2 shadow-lg relative z-10">
          <input 
            type="text" 
            placeholder="ابحث عن كتب، أجهزة، أو أي غرض..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 text-gray-800 outline-none text-lg rounded-r-2xl"
          />
          <button type="submit" className="bg-secondary text-white font-bold px-8 py-3 rounded-xl hover:bg-yellow-600 transition">
            بحث 🔍
          </button>
        </form>
      </section>

      {/* تصنيفات السوق السريعة */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map(cat => (
          <div key={cat.name} className={`${cat.color} p-4 rounded-2xl flex flex-col items-center justify-center gap-2 font-bold cursor-pointer hover:shadow-md transition`} onClick={() => router.push(`/market`)}>
            <span className="text-3xl">{cat.icon}</span>
            <span className="text-sm text-center">{cat.name}</span>
          </div>
        ))}
      </section>

      {/* أحدث إعلانات السوق */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">وصل حديثاً في السوق 🔥</h2>
          <Link href="/market" className="text-secondary font-bold hover:underline">المزيد ←</Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {latestListings.map((item) => (
            <Link href={`/market/${item.id}`} key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition">
              <div className="h-32 md:h-48 bg-gray-100 overflow-hidden relative">
                {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" /> : <span className="text-4xl absolute inset-0 flex justify-center items-center">📦</span>}
                <span className="absolute top-2 left-2 bg-black/60 text-white px-2 py-0.5 rounded text-[10px] font-bold">{item.category}</span>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-primary text-sm md:text-base line-clamp-1">{item.title}</h3>
                <div className="text-[#25D366] font-extrabold text-sm md:text-lg my-1">{item.price} ريال</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* الأقسام الأخرى (توازن الموقع) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        
        {/* المجموعات */}
        <Link href="/groups" className="relative bg-gradient-to-br from-sky-500 to-blue-700 rounded-3xl p-8 overflow-hidden group hover:shadow-xl transition">
          <div className="relative z-10 text-white space-y-4">
            <span className="text-4xl block">👥</span>
            <h2 className="text-3xl font-bold">المجموعات الدراسية</h2>
            <p className="text-blue-100 max-w-xs">لا تذاكر لحالك! ابحث عن زملاء يشاركونك نفس التخصص أو المادة، وكونوا فريق دراسي ناجح.</p>
            <div className="inline-block bg-white/20 px-6 py-2 rounded-lg font-bold backdrop-blur-sm group-hover:bg-white/30 transition">
              تصفح المجموعات ←
            </div>
          </div>
        </Link>

        {/* المفقودات */}
        <Link href="/lost-found" className="relative bg-gradient-to-br from-rose-500 to-red-700 rounded-3xl p-8 overflow-hidden group hover:shadow-xl transition">
          <div className="relative z-10 text-white space-y-4">
            <span className="text-4xl block">🔎</span>
            <h2 className="text-3xl font-bold">المفقودات</h2>
            <p className="text-red-100 max-w-xs">ضيعت مفتاح غرفتك؟ أو لقيت بطاقة جامعية طايحة؟ أعلن عنها هنا وخلنا نتعاون نرجعها لأصحابها.</p>
            <div className="inline-block bg-white/20 px-6 py-2 rounded-lg font-bold backdrop-blur-sm group-hover:bg-white/30 transition">
              قسم المفقودات ←
            </div>
          </div>
        </Link>

      </section>

    </div>
  );
}