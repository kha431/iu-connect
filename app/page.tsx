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

  return (
    <div className="space-y-12 pb-16 mt-4">
      
      {/* البانر + البحث (The Hook) */}
      <section className="bg-primary text-white rounded-3xl p-8 md:p-14 shadow-xl text-center space-y-8 relative overflow-hidden">
        <h1 className="text-3xl md:text-5xl font-extrabold relative z-10">حراج الجامعة الإسلامية 🛒</h1>
        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto relative z-10">بيع واشتري كتب، إلكترونيات، وأثاث بأسعار طلابية، وتواصل مع البائع مباشرة.</p>
        
        {/* شريط البحث الكبير */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex bg-white rounded-2xl p-2 shadow-lg relative z-10">
          <input 
            type="text" 
            placeholder="عن ماذا تبحث؟ (مثال: كتاب تفسير، آيفون...)" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 text-gray-800 outline-none text-lg rounded-r-2xl"
          />
          <button type="submit" className="bg-secondary text-white font-bold px-8 py-3 rounded-xl hover:bg-yellow-600 transition">
            بحث 🔍
          </button>
        </form>
      </section>

      {/* تصنيفات سريعة */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: 'إلكترونيات', icon: '💻', color: 'bg-blue-50 text-blue-600' },
          { name: 'كتب دراسية', icon: '📚', color: 'bg-emerald-50 text-emerald-600' },
          { name: 'أثاث سكن', icon: '🛏️', color: 'bg-amber-50 text-amber-600' },
          { name: 'ملابس', icon: '👕', color: 'bg-purple-50 text-purple-600' },
        ].map(cat => (
          <div key={cat.name} className={`${cat.color} p-4 rounded-2xl flex flex-col items-center justify-center gap-2 font-bold cursor-pointer hover:shadow-md transition`} onClick={() => router.push(`/market`)}>
            <span className="text-3xl">{cat.icon}</span>
            <span>{cat.name}</span>
          </div>
        ))}
      </section>

      {/* أحدث الإعلانات */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">وصل حديثاً 🔥</h2>
          <Link href="/market" className="text-secondary font-bold hover:underline">المزيد في السوق ←</Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {latestListings.map((item) => (
            <Link href={`/market/${item.id}`} key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition">
              <div className="h-32 md:h-48 bg-gray-100 overflow-hidden relative">
                {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" /> : <span className="text-4xl absolute inset-0 flex justify-center items-center">📦</span>}
                <span className="absolute top-2 left-2 bg-black/60 text-white px-2 py-0.5 rounded text-[10px] font-bold">{item.category}</span>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-primary line-clamp-1">{item.title}</h3>
                <div className="text-[#25D366] font-extrabold text-lg my-1">{item.price} ريال</div>
                <div className="text-xs text-gray-400 mt-2 flex justify-between">
                  <span>👤 طالب</span>
                  <span>{timeAgo(item.created_at)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}