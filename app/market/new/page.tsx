"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";

export default function NewItemPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "حراج الأجهزة",
    condition: "مستعمل",
    description: "",
    whatsapp: ""
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("سجل دخولك أولاً!");
    setIsSubmitting(true);

    try {
      let imageUrl = null;
      if (imageFile) {
        const fileName = `${Math.random()}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage.from('iu_images').upload(`${user.id}/${fileName}`, imageFile);
        if (!uploadError) {
          const { data: publicUrl } = supabase.storage.from('iu_images').getPublicUrl(`${user.id}/${fileName}`);
          imageUrl = publicUrl.publicUrl;
        }
      }

      const { error: insertError } = await supabase.from('listings').insert({
        user_id: user.id,
        title: formData.title,
        price: Number(formData.price),
        category: formData.category,
        condition: formData.condition,
        description: formData.description,
        whatsapp: formData.whatsapp,
        image_url: imageUrl,
      });

      if (insertError) throw insertError;
      router.push('/market');
    } catch (err) {
      alert("حدث خطأ أثناء الإضافة.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-4">
      <h1 className="text-2xl font-bold text-primary mb-6">إضافة إعلان جديد 🛒</h1>
      <form onSubmit={onSubmit} className="space-y-5">
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">صورة الإعلان</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 relative">
            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            {imagePreview ? <img src={imagePreview} className="h-32 mx-auto rounded-lg" /> : <span>📸 اضغط لرفع صورة</span>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">عنوان الإعلان</label>
          <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">السعر (0 = على السوم)</label>
            <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">رقم الواتساب</label>
            <input required type="text" placeholder="05XXXXXXXX" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none text-left" dir="ltr" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">القسم</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none bg-white">
              <option value="حراج الكتب">📚 حراج الكتب</option>
              <option value="السيارات والدراجات والسكوترات">🚗 السيارات والدراجات</option>
              <option value="حراج الأجهزة">💻 حراج الأجهزة</option>
              <option value="حراج الأثاث">🛏️ حراج الأثاث</option>
              <option value="مستلزمات شخصية">👔 مستلزمات شخصية</option>
              <option value="أطعمة ومشروبات">🍔 أطعمة ومشروبات</option>
              <option value="أخرى">📦 أخرى</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">الحالة</label>
            <select value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none bg-white">
              <option value="جديد">جديد</option>
              <option value="مستعمل أخو الجديد">مستعمل أخو الجديد</option>
              <option value="مستعمل">مستعمل</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">الوصف</label>
          <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none resize-none"></textarea>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-[#0c3a6b] disabled:opacity-70 transition">
          {isSubmitting ? "جاري النشر..." : "انشر الإعلان 🚀"}
        </button>
      </form>
    </div>
  );
}