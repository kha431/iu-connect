"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

const itemSchema = z.object({
  type: z.enum(["lost", "found"], { errorMap: () => ({ message: "الرجاء تحديد نوع البلاغ" }) }),
  title: z.string().min(3, { message: "العنوان يجب أن يكون 3 أحرف على الأقل" }),
  location: z.string().optional(),
  whatsapp: z.string().min(10, { message: "رقم الواتساب يجب أن يكون 10 أرقام" }),
  description: z.string().min(5, { message: "الرجاء كتابة تفاصيل واضحة" }),
});

type ItemFormValues = z.infer<typeof itemSchema>;

export default function NewLostFoundPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: { type: "lost" }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      
      if (file.size > 500 * 1024) {
        alert("حجم الصورة كبير جداً! الحد الأقصى هو 500 كيلوبايت.");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: ItemFormValues) => {
    if (!user) {
      alert("يجب تسجيل الدخول أولاً!");
      return;
    }
    
    setIsSubmitting(true);
    setError("");

    try {
      let imageUrl = null;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `lostfound_${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('iu_images')
          .upload(filePath, imageFile);

        if (uploadError) throw new Error("فشل رفع الصورة: " + uploadError.message);

        const { data: publicUrlData } = supabase.storage
          .from('iu_images')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from('lost_found').insert({
        user_id: user.id,
        type: data.type,
        title: data.title,
        location: data.location,
        description: data.description,
        whatsapp: data.whatsapp,
        image_url: imageUrl,
      });

      if (insertError) {
        alert("🚨 خطأ من قاعدة البيانات: " + insertError.message);
        throw insertError;
      }

      router.push('/lost');
      router.refresh();
      
    } catch (err: any) {
      setError(err?.message || "حدث خطأ أثناء رفع البلاغ، حاول مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <span className="text-6xl mb-4">🔒</span>
        <h2 className="text-2xl font-bold text-primary">سجل دخولك أولاً!</h2>
        <Link href="/login" className="mt-4 bg-secondary text-white px-6 py-2 rounded-xl font-bold transition">دخول</Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mt-4">
      <h1 className="text-2xl font-bold text-primary mb-2">إضافة بلاغ 🔍</h1>
      <p className="text-gray-500 mb-8 text-sm">أضف تفاصيل الغرض المفقود أو الموجود لتسهيل الوصول إليه.</p>

      {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 text-sm font-bold border border-red-200">❌ {error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/**/}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <label className="flex-1 text-center cursor-pointer">
            <input type="radio" value="lost" {...register("type")} className="hidden peer" />
            <div className="py-2 rounded-lg peer-checked:bg-red-50 peer-checked:text-red-700 peer-checked:border-red-200 peer-checked:shadow-sm transition-all font-bold text-gray-500 border border-transparent">
               مفقود (ضيعت شيء)
            </div>
          </label>
          <label className="flex-1 text-center cursor-pointer">
            <input type="radio" value="found" {...register("type")} className="hidden peer" />
            <div className="py-2 rounded-lg peer-checked:bg-green-50 peer-checked:text-green-700 peer-checked:border-green-200 peer-checked:shadow-sm transition-all font-bold text-gray-500 border border-transparent">
               موجود (لقيت شيء)
            </div>
          </label>
        </div>

        {/**/}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">صورة للغرض (اختياري)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
            <input 
              type="file" 
              accept="image/jpeg, image/png, image/webp" 
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {imagePreview ? (
              <div className="flex flex-col items-center relative z-0">
                <img src={imagePreview} alt="معاينة" className="h-40 object-contain rounded-lg mb-2 shadow-sm" />
                <span className="text-sm text-primary font-bold bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">تغيير الصورة 🔄</span>
              </div>
            ) : (
              <div className="flex flex-col items-center relative z-0">
                <span className="text-5xl mb-2">📸</span>
                <span className="text-sm text-gray-500 font-medium">اضغط لرفع صورة الغرض</span>
              </div>
            )}
          </div>
        </div>

        {/* */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">اسم الغرض *</label>
            <input {...register("title")} placeholder="مثال: مفتاح سيارة تويوتا" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">المكان (اختياري)</label>
            <input {...register("location")} placeholder="مثال: مبنى السنة التحضيرية" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" />
          </div>
        </div>

        {/* */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">رقم الواتساب للتواصل *</label>
          <input placeholder="05xxxxxxxx" dir="ltr" {...register("whatsapp")} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none text-left" />
          {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp.message}</p>}
        </div>

        {/* */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">وصف إضافي *</label>
          <textarea {...register("description")} rows={3} placeholder="لون الغرض، أي علامة مميزة، وقت الفقدان..." className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none resize-none"></textarea>
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-[#0c3a6b] transition-colors disabled:opacity-70">
          {isSubmitting ? "جاري رفع البلاغ... ⏳" : "انشر البلاغ الآن 🚀"}
        </button>

        <Link href="/lost" className="block text-center text-gray-400 text-sm font-medium hover:text-gray-600">
          إلغاء والعودة
        </Link>
      </form>
    </div>
  );
}