"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

// شروط إدخال بيانات المجموعة
const groupSchema = z.object({
  title: z.string().min(5, { message: "عنوان المجموعة يجب أن يكون 5 أحرف على الأقل" }),
  description: z.string().min(10, { message: "الرجاء كتابة تفاصيل واضحة للمجموعة" }),
  type: z.enum(["ride", "split", "study", "other"], { errorMap: () => ({ message: "الرجاء اختيار نوع المجموعة" }) }),
  max_members: z.coerce.number().min(0, { message: "العدد يجب أن يكون 0 (مفتوح) أو أكثر" }),
  whatsapp: z.string().min(10, { message: "رقم الواتساب يجب أن يكون 10 أرقام" }),
});

type GroupFormValues = z.infer<typeof groupSchema>;

export default function NewGroupPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: { max_members: 0, type: "ride" }
  });

  const onSubmit = async (data: GroupFormValues) => {
    if (!user) {
      alert("يجب تسجيل الدخول أولاً!");
      return;
    }
    
    setIsSubmitting(true);
    setError("");

    try {
      const { error: insertError } = await supabase.from('groups').insert({
        user_id: user.id,
        title: data.title,
        description: data.description,
        type: data.type,
        max_members: data.max_members,
        whatsapp: data.whatsapp,
      });

      if (insertError) {
        alert("🚨 خطأ من قاعدة البيانات: " + insertError.message);
        throw insertError;
      }

      router.push('/groups');
      router.refresh();
      
    } catch (err: any) {
      setError(err?.message || "حدث خطأ أثناء إنشاء المجموعة، حاول مرة أخرى.");
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
      <h1 className="text-2xl font-bold text-primary mb-2">إنشاء مجموعة جديدة 👥</h1>
      <p className="text-gray-500 mb-8 text-sm">نسّق مع زملائك للمشاوير، القطة، أو حتى المذاكرة الجماعية.</p>

      {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 text-sm font-bold border border-red-200">❌ {error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* نوع المجموعة */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">نوع المجموعة *</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
            {[
              { id: 'ride', label: '🚗 مشوار' },
              { id: 'split', label: '🍕 قطة' },
              { id: 'study', label: '📚 مذاكرة' },
              { id: 'other', label: '🤝 أخرى' }
            ].map((type) => (
              <label key={type.id} className="text-center cursor-pointer">
                <input type="radio" value={type.id} {...register("type")} className="hidden peer" />
                <div className="py-2 text-sm rounded-lg peer-checked:bg-white peer-checked:text-primary peer-checked:shadow-sm transition-all font-bold text-gray-500 border border-transparent peer-checked:border-gray-200">
                  {type.label}
                </div>
              </label>
            ))}
          </div>
          {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
        </div>

        {/* العنوان */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">عنوان المجموعة *</label>
          <input 
            {...register("title")} 
            placeholder="مثال: مشوار للحرم بعد صلاة العصر" 
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" 
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        {/* العدد والواتساب */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">العدد المطلوب (0 = مفتوح)</label>
            <input 
              type="number" 
              {...register("max_members")} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" 
            />
            {errors.max_members && <p className="text-red-500 text-xs mt-1">{errors.max_members.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">رقم الواتساب للتنسيق *</label>
            <input 
              placeholder="05xxxxxxxx" 
              dir="ltr" 
              {...register("whatsapp")} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none text-left" 
            />
            {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp.message}</p>}
          </div>
        </div>

        {/* الوصف */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">وصف المجموعة *</label>
          <textarea 
            {...register("description")} 
            rows={3} 
            placeholder="اكتب تفاصيل وقت التجمع، مكان اللقاء، والمصاريف المتوقعة..." 
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none resize-none"
          ></textarea>
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-[#0c3a6b] transition-colors disabled:opacity-70"
        >
          {isSubmitting ? "جاري إنشاء المجموعة... ⏳" : "أنشئ المجموعة الآن 🚀"}
        </button>

        <Link href="/groups" className="block text-center text-gray-400 text-sm font-medium hover:text-gray-600">
          إلغاء والعودة
        </Link>
      </form>
    </div>
  );
}