"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddListingPage() {
  const router = useRouter();
  
  // هذا هو السحر: متغير يخلي الصفحة تنتظر وما تطردك مباشرة
  const [isChecking, setIsChecking] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('حراج الكتب');
  const [condition, setCondition] = useState('مستعمل نظيف');
  const [whatsapp, setWhatsapp] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // التأكد المباشر من السيرفر
  useEffect(() => {
    const verifyUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login'); // إذا فعلاً مو مسجل، اطرده
      } else {
        setUserId(session.user.id);
        setIsChecking(false); // إذا مسجل، افتح له الصفحة
      }
    };
    verifyUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('listings').insert([
      {
        user_id: userId,
        title,
        description,
        price: Number(price),
        category,
        condition,
        whatsapp,
        image_url: imageUrl
      }
    ]);

    setLoading(false);
    if (error) {
      alert('حدث خطأ أثناء الإضافة: ' + error.message);
    } else {
      router.push('/market');
    }
  };

  // شاشة الانتظار اللطيفة بدل الطرد الفوري
  if (isChecking) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <div className="text-xl font-bold text-primary animate-pulse">جاري تجهيز الصفحة...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-lg border border-gray-100 mb-20">
      <h1 className="text-3xl font-extrabold text-primary mb-8 text-center">إضافة إعلان جديد 📦</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-bold mb-2">عنوان الإعلان</label>
          <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-4 border rounded-xl bg-gray-50 focus:bg-white focus:border-primary outline-none transition" placeholder="مثال: ايباد برو 2022..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">القسم</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-4 border rounded-xl bg-gray-50 focus:bg-white focus:border-primary outline-none transition">
              <option>حراج الكتب</option>
              <option>حراج الأجهزة</option>
              <option>حراج الأثاث</option>
              <option>سيارات ودراجات</option>
              <option>مستلزمات شخصية</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">الحالة</label>
            <select value={condition} onChange={e => setCondition(e.target.value)} className="w-full p-4 border rounded-xl bg-gray-50 focus:bg-white focus:border-primary outline-none transition">
              <option>جديد لم يستخدم</option>
              <option>مستعمل أخو الجديد</option>
              <option>مستعمل نظيف</option>
              <option>مستعمل</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">السعر (ريال)</label>
            <input required type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-4 border rounded-xl bg-gray-50 focus:bg-white focus:border-primary outline-none transition" placeholder="مثال: 150" />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">رقم الواتساب</label>
            <input required type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="w-full p-4 border rounded-xl bg-gray-50 focus:bg-white focus:border-primary outline-none transition" placeholder="05XXXXXXXX" dir="ltr" />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">الوصف</label>
          <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full p-4 border rounded-xl bg-gray-50 focus:bg-white focus:border-primary outline-none transition h-32" placeholder="اكتب تفاصيل السلعة ومميزاتها..."></textarea>
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">رابط الصورة (اختياري)</label>
          <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full p-4 border rounded-xl bg-gray-50 focus:bg-white focus:border-primary outline-none transition" placeholder="ضع رابط الصورة هنا..." dir="ltr" />
        </div>

        <div className="flex gap-4 pt-4">
          <button disabled={loading} type="submit" className="flex-1 bg-primary text-white font-bold py-4 rounded-xl hover:bg-[#0c3a6b] transition disabled:opacity-70">
            {loading ? 'جاري النشر...' : 'نشر الإعلان 🚀'}
          </button>
          <Link href="/market" className="px-8 bg-gray-200 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-300 transition flex items-center justify-center">
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
}