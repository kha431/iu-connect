"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'الآن';
  if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
  if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
  return `قبل ${Math.floor(diffInSeconds / 86400)} يوم`;
}

export default function MarketPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");

  useEffect(() => {
    async function fetchItems() {
      const { data } = await supabase.from('listings').select('*').order('created_at', { ascending: false });
      if (data) setItems(data);
      setLoading(false);
    }
    fetchItems();
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "الكل" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["الكل", "إلكترونيات", "كتب دراسية", "أثاث", "ملابس", "أخرى"];

  return (
    <div className="max-w-4xl mx-auto space-y-4 mt-4 pb-16">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 sticky top-0 z-10">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="ابحث عن السلعة... (تحديث فوري)" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary transition text-lg"
          />
          <Link href="/market/new" className="bg-primary text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center whitespace-nowrap hover:bg-[#0c3a6b] transition">
            + إضافة
          </Link>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pt-4 scrollbar-hide">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
             <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 animate-pulse">
               <div className="w-32 h-32 bg-gray-200 rounded-lg"></div>
               <div className="flex-1 space-y-3 py-2">
                 <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                 <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                 <div className="h-4 bg-gray-200 rounded w-1/2 mt-4"></div>
               </div>
             </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 text-gray-500 font-medium">لم نجد سلع مطابقة لبحثك!</div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <Link href={`/market/${item.id}`} key={item.id} className="block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition group">
              <div className="flex p-3 gap-4">
                <div className="w-32 h-32 sm:w-40 sm:h-40 shrink-0 bg-gray-100 rounded-lg overflow-hidden relative">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                  )}
                  <span className="absolute bottom-1 right-1 bg-black/60 text-white px-2 py-0.5 rounded text-[10px]">
                    📸 1
                  </span>
                </div>
                
                <div className="flex flex-col flex-1 py-1">
                  <h3 className="font-bold text-lg text-primary line-clamp-2 leading-tight">{item.title}</h3>
                  <div className="text-[#25D366] font-extrabold text-lg mt-1">{item.price > 0 ? `${item.price} ريال` : 'على السوم'}</div>
                  
                  <div className="mt-auto flex justify-between items-end text-xs text-gray-500 font-medium">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <span>👤</span> طالب ({item.user_id?.slice(0, 4)})
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <span>📍</span> الجامعة الإسلامية
                      </div>
                    </div>
                    <div className="text-left">
                      <div>🕒 {timeAgo(item.created_at)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}