"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function LostFoundPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      const { data } = await supabase
        .from('lost_found')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setItems(data);
      setLoading(false);
    }
    fetchItems();
  }, []);

  return (
    <div className="space-y-6 mt-4">
      {/* رأس الصفحة */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-400 to-yellow-500 opacity-20"></div>
        <div>
          <h1 className="text-2xl font-bold text-primary mb-1">المفقودات والموجودات 🔍</h1>
          <p className="text-gray-500 text-sm">ضيعت شيء؟ أو لقيت شيء في القاعة؟ نزله هنا عشان يرجع لصاحبه.</p>
        </div>
        <Link 
          href="/lost/new" 
          className="bg-secondary hover:bg-yellow-600 text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 w-full sm:w-auto justify-center z-10"
        >
          <span className="text-xl">+</span> أضف بلاغ
        </Link>
      </div>

      {/* عرض البلاغات */}
      {loading ? (
        <div className="text-center py-20 text-gray-500 font-medium">جاري تحميل البلاغات... ⏳</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
          <span className="text-6xl block mb-4">🎒</span>
          <h3 className="text-xl font-bold text-primary mb-2">لا توجد بلاغات حالياً!</h3>
          <p className="text-gray-500">الحمد لله، كل شيء في مكانه.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const isLost = item.type === 'lost';
            const whatsappNumber = item.whatsapp?.startsWith('0') ? '966' + item.whatsapp.slice(1) : item.whatsapp;
            const whatsappLink = `https://wa.me/${whatsappNumber}?text=السلام عليكم، بخصوص إعلان (${item.title}) في قسم المفقودات بمنصة IU Connect...`;

            return (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition">
                
                {/* مكان الصورة */}
                <div className="h-40 bg-gray-50 border-b border-gray-100 flex items-center justify-center relative">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl">{isLost ? '❓' : '🎁'}</span>
                  )}
                  {/* شريط الحالة */}
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-md text-xs font-bold shadow-sm ${
                    item.is_resolved ? 'bg-gray-800 text-white' : 
                    isLost ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    {item.is_resolved ? '✅ تم الحل' : isLost ? '💔 مفقود' : '🎁 موجود (لقيته)'}
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-primary mb-1 line-clamp-1">{item.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-3 font-medium">
                    <span>📍 المكان:</span>
                    <span className="text-gray-700">{item.location || 'غير محدد'}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 bg-gray-50 p-2 rounded-lg">
                    {item.description}
                  </p>
                  
                  <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString('ar-SA')}</span>
                    
                    {!item.is_resolved && (
                      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] hover:bg-[#1ebd5a] text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center gap-1 transition-colors">
                        <span>💬</span> تواصل
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}