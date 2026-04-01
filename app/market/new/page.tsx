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
  title: z.string().min(3, { message: "العنوان يجب أن يكون 3 أحرف على الأقل" }),
  price: z.coerce.number().min(0, { message: "السعر يجب أن يكون 0 أو أكثر" }),
  category: z.string().min(1, { message: "الرجاء اختيار القسم" }),
  description: z.string().min(10, { message: "الوصف يجب أن يكون 10 أحرف على الأقل" }),
});

type ItemFormValues = z.infer<typeof itemSchema>;

export default function NewItemPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: { price: 0, category: "إلكترونيات" }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: ItemFormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      let imageUrl = null;
      if (imageFile) {
        const fileName = `${Math.random()}-${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('iu_images')
          .upload(`${user.id}/${fileName}`, imageFile);
        if (uploadError) throw uploadError;
        const { data: publicUrl } = supabase.storage.from('iu_images').getPublicUrl(`${user.id}/${fileName}`);
        imageUrl = publicUrl.publicUrl;
      }

      const { error: insertError } = await supabase.from('listings').insert({
        user_id: user.id,
        title: data.title,
        price: data.price,
        category: data.category,
        description: data.description,
        image_url: imageUrl,
      });

      if (insertError) throw insertError;
      router.push('/market');
      router.refresh();
    } catch (err) {
      alert("حدث خطأ أثناء الإضافة");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-4">
      <h1 className="text-2xl font-bold text-primary mb-6">إضافة غرض للبيع 🛍️</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">صورة الغرض</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 relative">
            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            {imagePreview ? <img src={imagePreview} className="h-32 mx-auto rounded-lg" /> : <span>📸 اضغط لرفع صورة</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">اسم الغرض</label>
            <input {...register("title")} className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">السعر (ريال)</label>
            <input type="number" {...register("price")} className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">القسم</label>
          <select {...register("category")} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none bg-white font-medium text-gray-700">
            <option value="إلكترونيات">💻 إلكترونيات</option>
            <option value="كتب دراسية">📚 كتب دراسية</option>
            <option value="أثاث">🛏️ أثاث ومستلزمات سكن</option>
            <option value="ملابس">👕 ملابس وأحذية</option>
            <option value="أخرى">📦 أخرى</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">الوصف</label>
          <textarea {...register("description")} rows={3} className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none resize-none"></textarea>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-[#0c3a6b] disabled:opacity-70 transition">
          {isSubmitting ? "جاري النشر..." : "عرض الغرض الآن 🚀"}
        </button>
      </form>
    </div>
  );
}