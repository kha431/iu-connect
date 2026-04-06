"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';

export default function AdDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItem() {
      const { data, error } = await supabase
        .from('market_items') 
        .select('*')
        .eq('id', id)
        .single();

      if (data) setItem(data);
      setLoading(false);
    }
    if (id) fetchItem();
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-[#0f4c8a] border-t-transparent rounded-full animate-spin"></div></div>;

  if (!item) return (
    <div className="max-w-2xl mx-auto mt-20 text-center bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
      <span className="text-6xl block mb-4">🚫</span>
      <h2 className="text-2xl font-bold text-[#0f4c8a] mb-4">الإعلان غير موجود أو تم حذفه</h2>
      <button onClick={() => router.back()} className="bg-[#0f4c8a] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#0c3a6b]">العودة للسوق</button>
    </div>
  );

  const getWhatsappLink = (whatsapp: string, title: string) => {
    if (!whatsapp) return '#';
    const whatsappNumber = whatsapp.startsWith('0') ? '966' + whatsapp.slice(1) : whatsapp;
    return `https://wa.me/${whatsappNumber}?text=السلام عليكم، بخصوص إعلان (${title}) في السوق بمنصة IU Connect...`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 mb-20 font-sans">
      <button onClick={() => router.back()} className="mb-6 text-[#0f4c8a] font-bold flex items-center gap-2 hover:underline">
         <span>➡️</span> العودة للسوق 
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        <div className="h-64 sm:h-96 bg-gray-50 flex items-center justify-center p-4 border-b border-gray-100 relative">
           {item.image_url ? (
              <img src={item.image_url} alt={item.title} className="max-w-full max-h-full object-contain" />
           ) : (
              <span className="text-8xl drop-shadow-md">📦</span>
           )}
        </div>

        <div className="p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f4c8a] mb-3 leading-tight">{item.title}</h1>
              <div className="flex flex-wrap gap-2 text-sm font-bold">
                <span className="bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1 rounded-lg">🏷️ {item.category}</span>
                <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-lg">✨ {item.condition || 'غير محدد'}</span>
              </div>
            </div>
            {item.price > 0 && (
              <div className="bg-green-50 text-green-700 border border-green-200 px-6 py-3 rounded-2xl text-xl font-extrabold text-center min-w-[120px] w-full sm:w-auto">
                {item.price} ريال
              </div>
            )}
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
            <h3 className="font-bold text-lg text-gray-800 mb-3 border-b pb-2">التفاصيل</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{item.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-gray-100 pt-6">
             <div className="text-gray-400 font-medium text-sm flex items-center gap-2 w-full sm:w-auto">
               <span>🕒</span> تاريخ النشر: {new Date(item.created_at).toLocaleDateString('ar-SA')}
             </div>
             
             {item.whatsapp ? (
                <a href={getWhatsappLink(item.whatsapp, item.title)} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-[#25D366] text-white px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-green-600 transition flex flex-col items-center justify-center gap-1 shadow-md">
                  <span className="flex items-center gap-2">تواصل واتساب 💬</span>
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full w-full text-center tracking-widest" dir="ltr">{item.whatsapp}</span>
                </a>
              ) : (
                <span className="bg-gray-100 text-gray-500 px-8 py-3 rounded-xl font-bold w-full sm:w-auto text-center">لا يوجد رقم للتواصل</span>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}