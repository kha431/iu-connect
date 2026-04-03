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
    category: 'حراج الأجهزة',
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

    const { error } = await supabase
      .from('market_items') // ✅ تأكدنا أن هذا الاسم مطابق للجدول في SQL أعلاه
      .insert([
        { 
          title: formData.title, 
          description: formData.description, 
          price: parseFloat(formData.price) || 0,
          category: formData.category,
          condition: formData.condition,
          whatsapp: formData.whatsapp,
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
        
        <h1 className="text-2xl font-extrabold text-[#1a4b77] mb-8 text-center flex items-center justify-center gap-2">
           إضافة إعلان جديد 🛒
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* صورة الإعلان */}
          <div>
            <label className="block text-[#1a4b77] font-bold mb-2 text-sm">صورة الإعلان</label>
            <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex justify-center items-center cursor-pointer hover:bg-gray-50 transition w-full h-24">
              <span className="text-gray-600 font-medium flex items-center gap-2">
                اضغط لرفع صورة 📸
              </span>
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
            {imageFile && <p className="text-sm text-green-600 mt-2 text-center font-bold">✅ تم اختيار الصورة</p>}
          </div>

          {/* عنوان الإعلان */}
          <div>
            <label className="block text-[#1a4b77] font-bold mb-2 text-sm">عنوان الإعلان</label>
            <input
              type="text"
              required
              className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-[#1a4b77] transition"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* السعر والواتساب */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#1a4b77] font-bold mb-2 text-sm">السعر (0 = على السوم)</label>
              <input
                type="number"
                required
                className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-[#1a4b77] transition"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[#1a4b77] font-bold mb-2 text-sm">رقم الواتساب</label>
              <input
                type="text"
                required
                placeholder="05XXXXXXXX"
                className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-[#1a4b77] transition text-left"
                dir="ltr"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              />
            </div>
          </div>

          {/* القسم والحالة */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#1a4b77] font-bold mb-2 text-sm">القسم</label>
              <select
                className="w-full p-3 rounded-lg border border-gray-200 outline-none bg-white"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="حراج الكتب">حراج الكتب 📚</option>
                <option value="السيارات والدراجات">السيارات والدراجات 🚗</option>
                <option value="حراج الأجهزة">حراج الأجهزة 💻</option>
                <option value="حراج الأثاث">حراج الأثاث 🛏️</option>
                <option value="مستلزمات شخصية">مستلزمات شخصية 👔</option>
                <option value="أطعمة ومشروبات">أطعمة ومشروبات 🍔</option>
                <option value="أخرى">أخرى 📦</option>
              </select>
            </div>
            <div>
              <label className="block text-[#1a4b77] font-bold mb-2 text-sm">الحالة</label>
              <select
                className="w-full p-3 rounded-lg border border-gray-200 outline-none bg-white"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              >
                <option value="جديد">جديد</option>
                <option value="مستعمل أخو الجديد">مستعمل أخو الجديد ✨</option> {/* ✅ تمت الإضافة */}
                <option value="مستعمل">مستعمل</option>
              </select>
            </div>
          </div>

          {/* التفاصيل */}
          <div>
            <label className="block text-[#1a4b77] font-bold mb-2 text-sm">التفاصيل</label>
            <textarea
              required
              rows={4}
              className="w-full p-3 rounded-lg border border-gray-100 bg-gray-50 outline-none focus:border-[#1a4b77] transition resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a4b77] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#123656] transition shadow-md disabled:opacity-70"
          >
            {loading ? 'جاري النشر...' : 'نشر الإعلان 🚀'}
          </button>
        </form>

      </div>
    </div>
  );
}