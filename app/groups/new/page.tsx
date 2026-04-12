"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function NewGroupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [userId, setUserId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    whatsapp: '',
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        alert("يجب تسجيل الدخول أولاً لإنشاء مجموعة");
        router.push('/login');
      }
    };
    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    
    if (!userId) {
      alert("حدث خطأ في المصادقة، يرجى تسجيل الدخول مجدداً");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('groups')
      .insert([
        { 
          title: formData.title, 
          description: formData.description, 
          whatsapp: formData.whatsapp,
          type: 'other', 
          participants: 1, 
          joined_numbers: [],
          user_id: userId // 
        }
      ]);

    if (error) {
      console.error("تفاصيل الخطأ:", error);
      alert("رفض السيرفر الإنشاء والسبب: " + error.message);
      setLoading(false);
    } else {
      router.push('/groups');
      router.refresh();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 mb-20 font-sans">
      <div className="mb-8">
        <Link href="/groups" className="text-[#0f4c8a] font-bold flex items-center gap-2 hover:underline">
          <span>➡️</span> العودة للمجموعات
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h1 className="text-3xl font-extrabold text-[#0f4c8a] mb-2">إنشاء مجموعة جديدة 👥</h1>
        <p className="text-gray-500 mb-8">نسّق مع زملائك في الجامعة لأي نشاط، مشوار، أو مذاكرة جماعية.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">عنوان المجموعة *</label>
            <input
              type="text"
              required
              placeholder="مثال: قطة مشويات في الوحدة 22"
              className="w-full p-4 rounded-2xl border border-gray-200 outline-none focus:border-[#0f4c8a] transition"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">التفاصيل *</label>
            <textarea
              required
              rows={4}
              placeholder="اكتب هنا الوقت، المكان، وأي تفاصيل تهم زملائك..."
              className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:border-[#0f4c8a] transition"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">رابط قروب أو رقم الواتساب *</label>
            <input
              type="text"
              required
              placeholder="05xxxxxxxx"
              className="w-full p-4 rounded-2xl border border-gray-200 outline-none focus:border-[#0f4c8a] transition text-left"
              dir="ltr"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            />
            <p className="text-xs text-gray-400 mt-2">سيتمكن الطلاب من التواصل معك مباشرة عبر هذا الرقم.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#cca01d] text-white py-5 rounded-2xl font-extrabold text-xl hover:bg-[#b38b17] transition shadow-lg disabled:opacity-50"
          >
            {loading ? 'جاري النشر...' : 'انشر المجموعة الآن 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
}