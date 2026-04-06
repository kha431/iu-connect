"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function NewMarketAdPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    whatsapp: '',
    category: 'حراج الكتب', // ✅ تم تعديل الخيار الافتراضي
    condition: 'مستعمل',
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        alert("يجب تسجيل الدخول أولاً لإضافة إعلان");
        router.push('/login');
      }
    };
    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!userId) {
      alert("خطأ في المصادقة، يرجى تسجيل الدخول مجدداً");
      setLoading(false);
      return;
    }

    let finalImageUrl = '';

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images') 
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error("خطأ رفع الصورة:", uploadError);
        alert("لم نتمكن من رفع الصورة، تأكد من إنشاء مجلد باسم images في Supabase Storage وأنه متاح للعامة (Public).");
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
        
      finalImageUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase
      .from('market_items') 
      .insert([
        { 
          title: formData.title, 
          description: formData.description, 
          // ✅ السعر هنا إذا كان فاضي بينحفظ كـ 0 (يعني على السوم)
          price: parseFloat(formData.price) || 0,
          category: formData.category,
          condition: formData.condition,
          whatsapp: formData.whatsapp,
          image_url: finalImageUrl, 
          user_id: userId
        }
      ]);

    if (error) {
      console.error("تفاصيل الخطأ:", error);
      alert("حدث خطأ أثناء الإنشاء: " + error.message);
      setLoading(false);
    } else {
      router.push('/market'); 
      router.refresh();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 mb-20 font-sans">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        
        <h1 className="text-2xl font-extrabold text-[#0f4c8a] mb-8 text-center flex items-center justify-center gap-2">
           إضافة إعلان جديد 🛒
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* صورة الإعلان */}
          <div>
            <label className="block text-[#0f4c8a] font-bold mb-2 text-sm">صورة الإعلان</label>
            <label className="border-2 border-dashed border-[#0f4c8a]/30 bg-blue-50/30 rounded-xl p-6 flex flex-col justify-center items-center cursor-pointer hover:bg-blue-50 transition w-full h-32 relative overflow-hidden">
              {imageFile ? (
                 <div className="text-center z-10">
                    <span className="text-3xl block mb-2">✅</span>
                    <span className="text-green-600 font-bold text-sm">تم اختيار الصورة بنجاح</span>
                 </div>
              ) : (
                 <div className="text-center text-gray-500 z-10 flex flex-col items-center">
                    <span className="text-3xl block mb-2">📸</span>
                    <span className="font-medium text-sm">اضغط هنا لاختيار صورة من جهازك</span>
                 </div>
              )}
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>

          {/* عنوان الإعلان */}
          <div>
            <label className="block text-[#0f4c8a] font-bold mb-2 text-sm">عنوان الإعلان</label>
            <input
              type="text"
              required
              className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-[#0f4c8a] transition"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* السعر والواتساب */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {/* ✅ تم إزالة required من هنا، وتوضيح أنه اختياري */}
              <label className="block text-[#0f4c8a] font-bold mb-2 text-sm">السعر (اختياري - اتركه فارغاً للسوم)</label>
              <input
                type="number"
                placeholder="مثال: 50"
                className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-[#0f4c8a] transition"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[#0f4c8a] font-bold mb-2 text-sm">رقم الواتساب</label>
              <input
                type="text"
                required
                placeholder="05XXXXXXXX"
                className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-[#0f4c8a] transition text-left"
                dir="ltr"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              />
            </div>
          </div>

          {/* القسم والحالة */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#0f4c8a] font-bold mb-2 text-sm">القسم</label>
              <select
                className="w-full p-3 rounded-lg border border-gray-200 outline-none bg-white focus:border-[#0f4c8a]"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {/* ✅ تم حذف المحلات التجارية من هنا */}
                <option value="حراج الكتب">حراج الكتب 📚</option>
                <option value="السيارات والدراجات والسكوترات">السيارات والدراجات والسكوترات 🚗</option>
                <option value="حراج الأجهزة">حراج الأجهزة 💻</option>
                <option value="حراج الأثاث">حراج الأثاث 🛏️</option>
                <option value="مستلزمات شخصية">مستلزمات شخصية 👔</option>
                <option value="أطعمة ومشروبات">أطعمة ومشروبات 🍔</option>
                <option value="أخرى">أخرى 📦</option>
              </select>
            </div>
            <div>
              <label className="block text-[#0f4c8a] font-bold mb-2 text-sm">الحالة</label>
              <select
                className="w-full p-3 rounded-lg border border-gray-200 outline-none bg-white focus:border-[#0f4c8a]"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              >
                <option value="جديد">جديد</option>
                <option value="مستعمل أخو الجديد">مستعمل أخو الجديد ✨</option>
                <option value="مستعمل">مستعمل</option>
              </select>
            </div>
          </div>

          {/* التفاصيل */}
          <div>
            <label className="block text-[#0f4c8a] font-bold mb-2 text-sm">التفاصيل</label>
            <textarea
              required
              rows={4}
              className="w-full p-3 rounded-lg border border-gray-100 bg-gray-50 outline-none focus:border-[#0f4c8a] transition resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0f4c8a] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#0c3a6b] transition shadow-md disabled:opacity-70"
          >
            {loading ? 'جاري النشر ورفع الصورة...' : 'نشر الإعلان 🚀'}
          </button>
        </form>

      </div>
    </div>
  );
}