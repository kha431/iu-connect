"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return 'الآن';
  if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
  if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
  return `قبل ${Math.floor(diffInSeconds / 86400)} يوم`;
}

export default function ItemDetailsPage({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItem() {
      const { data } = await supabase.from('listings').select('*').eq('id', params.id).single();
      if (data) setItem(data);
      setLoading(false);
    }
    fetchItem();
  }, [params.id]);

  if (loading) return <div className="text-center py-20 font-bold text-xl">جاري فتح الإعلان... ⏳</div>;
  if (!item) return <div className="text-center py-20 font-bold text-xl text-red-500">الإعلان غير موجود أو تم حذفه!</div>;

  return (
    <div className="max-w-3xl mx-auto mt-4 pb-20">
      
      <Link href="/market" className="text-gray-500 font-bold hover:text-primary mb-4 inline-block">
        ← العودة للسوق
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        <div className="w-full bg-gray-100 aspect-video flex items-center justify-center relative border-b border-gray-200">
          {item.image_url ? (
            <img src={item.image_url} alt={item.title} className="w-full h-full object-contain" />
          ) : (
            <span className="text-8xl">📦</span>
          )}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">
            {item.category}
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-primary leading-tight">{item.title}</h1>
            <div className="text-2xl md:text-3xl font-extrabold text-[#25D366] whitespace-nowrap bg-green-50 px-4 py-2 rounded-xl">
              {item.price > 0 ? `${item.price} ريال` : 'على السوم'}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2"><span>👤</span> البائع: طالب ({item.user_id?.slice(0,4)})</div>
            <div className="flex items-center gap-2"><span>🕒</span> {timeAgo(item.created_at)}</div>
            <div className="flex items-center gap-2"><span>📍</span> الجامعة الإسلامية</div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-800">تفاصيل الإعلان:</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-lg bg-gray-50 p-4 rounded-xl border border-gray-100 min-h-[100px]">
              {item.description}
            </p>
          </div>

          <div className="pt-4">
            <Link 
              href={`https://wa.me/966${item.user_id?.slice(0, 9)}?text=بخصوص إعلانك: ${item.title}`} 
              target="_blank"
              className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white font-bold text-xl py-4 rounded-xl hover:bg-[#1ebd5a] transition-all shadow-lg shadow-green-200"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              تواصل مع البائع عبر واتساب
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}