"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

function timeAgo(dateString: string) {
  const diff = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
  return `قبل ${Math.floor(diff / 86400)} يوم`;
}

export default function ItemDetailsPage({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<any>(null);
  const [similarItems, setSimilarItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // استدعاء معلومات المستخدم والتوجيه
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    async function fetchItemAndSimilar() {
      // جلب الإعلان الحالي
      const { data: currentItem } = await supabase.from('listings').select('*').eq('id', params.id).single();
      if (currentItem) {
        setItem(currentItem);
        // جلب 3 إعلانات مشابهة من نفس القسم
        const { data: similar } = await supabase
          .from('listings')
          .select('*')
          .eq('category', currentItem.category)
          .neq('id', currentItem.id)
          .limit(3);
        if (similar) setSimilarItems(similar);
      }
      setLoading(false);
    }
    fetchItemAndSimilar();
  }, [params.id]);

  // دالة التعامل مع ضغطة زر الواتساب (الإجبار على التسجيل)
  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      alert("عشان نحميك ونحمي البائع، لازم تسجل دخول أولاً للتواصل!");
      router.push('/login'); // تم التعديل إلى مسار تسجيل الدخول الصحيح
      return;
    }
    // إذا مسجل، يفتح الواتساب مباشرة
    window.open(`https://wa.me/966${item.whatsapp?.slice(1)}?text=بخصوص إعلانك: ${item.title}`, '_blank');
  };

  if (loading) return <div className="text-center py-20 font-bold text-xl animate-pulse">جاري تحميل الإعلان...</div>;
  if (!item) return <div className="text-center py-20 font-bold text-xl text-red-500">الإعلان غير موجود!</div>;

  return (
    <div className="max-w-4xl mx-auto mt-4 pb-24">
      
      <Link href="/market" className="text-gray-500 font-bold hover:text-primary mb-4 inline-block">← العودة للسوق</Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        {/* الصورة */}
        <div className="w-full bg-black/5 aspect-video md:aspect-[21/9] flex items-center justify-center relative">
          {item.image_url ? (
            <img src={item.image_url} className="w-full h-full object-contain" />
          ) : (
            <span className="text-6xl">📦</span>
          )}
        </div>

        {/* التفاصيل */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6 mb-6">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-primary mb-2">{item.title}</h1>
              <div className="flex gap-4 text-sm text-gray-500 font-medium">
                <span>🕒 {timeAgo(item.created_at)}</span>
                <span>📍 الجامعة الإسلامية</span>
                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{item.condition}</span>
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#25D366] bg-green-50 px-6 py-3 rounded-xl border border-green-100">
              {item.price > 0 ? `${item.price} ريال` : 'على السوم'}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-2">وصف الإعلان:</h3>
            <p className="text-gray-700 leading-relaxed text-lg bg-gray-50 p-6 rounded-xl border border-gray-100 whitespace-pre-wrap">
              {item.description}
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 mb-8 font-bold">
            <span className="text-2xl">👤</span>
            المعلن: طالب من الجامعة الإسلامية ({item.user_id?.slice(0,4)})
          </div>

          {/* زر الواتساب الذكي */}
          <button 
            onClick={handleContactClick}
            className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white font-extrabold text-2xl py-5 rounded-2xl hover:bg-[#1ebd5a] transition-all shadow-xl shadow-green-200/50"
          >
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            تواصل عبر واتساب
          </button>
        </div>
      </div>

      {/* قسم إعلانات مشابهة */}
      {similarItems.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-primary mb-4">إعلانات مشابهة قد تهمك 🏷️</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {similarItems.map((sim) => (
              <Link href={`/market/${sim.id}`} key={sim.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition">
                <div className="h-24 md:h-32 bg-gray-100 overflow-hidden relative">
                  {sim.image_url ? <img src={sim.image_url} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" /> : <span className="flex items-center justify-center h-full text-2xl">📦</span>}
                  <span className="absolute bottom-1 right-1 bg-black/60 text-white px-2 py-0.5 rounded text-[10px]">📸 1</span>
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-primary text-sm line-clamp-1">{sim.title}</h4>
                  <div className="text-[#25D366] font-bold text-sm mt-1">{sim.price} ريال</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}