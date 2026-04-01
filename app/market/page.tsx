"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

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
    <div className="space-y-6 mt-4">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-1">سوق الطلاب 🛒</h1>
          <p className="text-gray-500 text-sm">كل شيء تحتاجه لدراستك وسكنك، بأسعار تناسب الطلاب.</p>
        </div>
        <Link href="/market/new" className="bg-secondary hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm w-full sm:w-auto text-center">
          + عرض غرض للبيع
        </Link>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="relative">
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="عن ماذا تبحث؟ (كتاب، آيفون، طاولة...)" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-12 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary transition"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500 font-medium">جاري التحميل... ⏳</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
          <span className="text-6xl block mb-4">🔍</span>
          <h3 className="text-xl font-bold text-primary">لم نجد أي نتائج للبحث!</h3>
          <p className="text-gray-500 mt-2">جرب البحث بكلمات أخرى أو تغيير القسم.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
              <div className="h-48 bg-gray-50 flex items-center justify-center relative">
                {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" /> : <span className="text-4xl">📦</span>}
                <span className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded-md text-[10px] font-bold text-primary border border-gray-100">{item.category}</span>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-primary line-clamp-1">{item.title}</h3>
                  <span className="text-secondary font-bold">{item.price} ريال</span>
                </div>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">{item.description}</p>
                <Link href={`https://wa.me/966${item.user_id?.slice(0, 9)}`} className="block w-full bg-[#25D366] text-white text-center font-bold py-2.5 rounded-lg hover:bg-[#1ebd5a] transition">تواصل عبر واتساب</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}