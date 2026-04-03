"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// مترجم لحالة العنصر 
const statusTranslator: Record<string, string> = {
  lost: "مفقود 💔",
  found: "موجود (لقيته) 💡"
};

export default function LostAndFoundPage() {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      // ✅ تم استخدام اسم الجدول الصحيح
      const { data, error } = await supabase
        .from('lost_found') 
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setItems(data);
      setLoading(false);
    };

    fetchItems();
  }, []);

  // دالة التصفية (البحث الذكي)
  const filteredItems = items.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    const title = item.title || '';
    const description = item.description || '';
    return title.toLowerCase().includes(searchLower) || description.toLowerCase().includes(searchLower);
  });

  // دالة تضبيط رقم الواتساب (من كودك الأصلي)
  const getWhatsappLink = (whatsapp: string, title: string) => {
    if (!whatsapp) return '#';
    const whatsappNumber = whatsapp.startsWith('0') ? '966' + whatsapp.slice(1) : whatsapp;
    return `https://wa.me/${whatsappNumber}?text=السلام عليكم، بخصوص إعلان (${title}) في قسم المفقودات بمنصة IU Connect...`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mb-20">
      
      {/* 🌟 البانر الترحيبي الفخم 🌟 */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8 flex flex-col md:flex-row justify-between items-center relative overflow-hidden gap-6">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-100 via-orange-50 to-red-100"></div>
        <div className="text-right flex-1 pt-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1e3264] mb-2">المفقودات والموجودات 🔍</h1>
          <p className="text-gray-500 text-sm md:text-base">ضيعت شيء غالي عليك؟ أو لقيت شيء مو لك؟ أعلن هنا وخلنا نتعاون نرجعه لصاحبه.</p>
        </div>
        <div className="w-full md:w-auto">
          <Link href="/lost/new" className="bg-[#cca01d] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#b38b17] transition shadow-md w-full md:w-auto text-center inline-block text-lg">
            + أضف بلاغ
          </Link>
        </div>
      </div>

      {/* ✨ شريط البحث الذكي ✨ */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <span className="text-gray-400 text-xl">🔍</span>
          </div>
          <input
            type="text"
            placeholder="ابحث عن مفقودات.. (مثال: محفظة، بطاقة جامعية، مفتاح سيارة)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pr-12 rounded-2xl border border-gray-200 focus:border-[#0f4c8a] focus:ring-2 focus:ring-[#0f4c8a]/20 outline-none transition shadow-sm text-gray-700 bg-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-[#0f4c8a] border-t-transparent rounded-full animate-spin"></div></div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
           <span className="text-6xl mb-4 block drop-shadow-md">🎒</span>
           <h2 className="text-xl font-bold text-gray-700">
             {searchTerm ? 'لا توجد نتائج تطابق بحثك' : 'لا يوجد إعلانات مفقودات حالياً'}
           </h2>
        </div>
      ) : (
        /* 🌟 شبكة الكروت المنسقة 🌟 */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isLost = item.type === 'lost';
            
            return (
            <div 
              key={item.id} 
              className="bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition duration-300 transform hover:-translate-y-1 flex flex-col h-full relative overflow-hidden group-card cursor-pointer"
              onClick={() => setSelectedItem(item)} // ✅ إرجاع ميزة النافذة المنبثقة
            >
              {/* ✅ حل مشكلة الصور المقصوصة (استخدام object-contain بدلاً من cover) */}
              <div className="h-52 bg-white border-b border-gray-100 flex items-center justify-center relative p-4 overflow-hidden">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="max-w-full max-h-full object-contain hover:scale-105 transition duration-500" />
                ) : (
                  <span className="text-6xl drop-shadow-md">{isLost ? '❓' : '🎁'}</span>
                )}
                {/* شريط الحالة */}
                <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm backdrop-blur-md ${
                  item.is_resolved ? 'bg-gray-800 text-white border border-gray-700' : 
                  isLost ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {item.is_resolved ? '✅ تم الحل' : isLost ? 'مفقود 💔' : 'معثور عليه 💡'}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-[#0f4c8a] mb-2 line-clamp-1">
                  {item.title}
                </h3>
                
                {item.location && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4 font-medium bg-gray-50 p-2 rounded-lg border border-gray-100 w-fit">
                    <span>📍</span>
                    <span className="text-gray-800 truncate">{item.location}</span>
                  </div>
                )}
                
                <p className="text-gray-500 mb-6 flex-grow line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                  <button className="bg-[#0f4c8a] text-white font-bold px-6 py-2 rounded-xl text-sm hover:bg-[#0c3a6b] transition shadow-sm flex items-center gap-1">
                    التفاصيل 👀
                  </button>
                  <span className="text-xs text-gray-400 font-medium">
                    {new Date(item.created_at).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {/* 🌟 النافذة المنبثقة (Modal) للتفاصيل 🌟 */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setSelectedItem(null)} 
              className="absolute top-4 left-4 text-gray-600 hover:text-red-500 transition bg-white/80 backdrop-blur shadow-md w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl z-10"
            >
              ✕
            </button>
            
            {/* عرض الصورة كاملة داخل النافذة */}
            {selectedItem.image_url && (
               <div className="w-full h-72 bg-white flex items-center justify-center p-4 border-b">
                 <img src={selectedItem.image_url} alt={selectedItem.title} className="max-w-full max-h-full object-contain" />
               </div>
            )}

            <div className="p-8">
              <div className="flex gap-3 mb-6 flex-wrap">
                <span className={`font-bold px-3 py-1 rounded-lg text-sm border ${
                    selectedItem.is_resolved ? 'bg-gray-100 text-gray-700 border-gray-200' :
                    selectedItem.type === 'lost' 
                      ? 'bg-red-50 text-red-700 border-red-100' 
                      : 'bg-green-50 text-green-700 border-green-100'
                  }`}>
                  {selectedItem.is_resolved ? '✅ تم إرجاع المفقود' : statusTranslator[selectedItem.type] || 'إعلان'}
                </span>
                {selectedItem.location && (
                  <span className="bg-gray-100 text-gray-600 font-bold px-3 py-1 text-sm rounded-lg border border-gray-200">
                    📍 المكان: {selectedItem.location}
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-extrabold text-[#0f4c8a] mb-4 leading-tight">{selectedItem.title}</h2>
              
              <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedItem.description}</p>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
                  <span>📞</span> طريقة التواصل
                </h4>
                <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <span className="font-bold text-[#0f4c8a]">صاحب الإعلان</span>
                  {selectedItem.is_resolved ? (
                     <span className="text-gray-500 font-bold bg-gray-200 px-4 py-2 rounded-lg text-sm border border-gray-300">تم إغلاق التواصل</span>
                  ) : selectedItem.whatsapp ? (
                    <a 
                      href={getWhatsappLink(selectedItem.whatsapp, selectedItem.title)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-[#25D366] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-green-600 transition flex items-center gap-2 shadow-sm"
                    >
                      تواصل واتساب 💬
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm font-bold bg-gray-100 px-4 py-2 rounded-lg border border-gray-200">لا يوجد رقم للتواصل</span>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}