"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // دالة تسجيل الدخول بالإيميل
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // هذا الرابط اللي بيرجع له الطالب بعد ما يضغط على الرابط في إيميله
        emailRedirectTo: `${window.location.origin}/`, 
      },
    });

    if (error) {
      setMessage("❌ عذراً، حدث خطأ: " + error.message);
    } else {
      setMessage("✅ تم إرسال رابط الدخول إلى إيميلك! شيك على صندوق الوارد.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      {/* صندوق تسجيل الدخول */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        
        {/* العناوين */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">تسجيل الدخول</h2>
          <p className="text-gray-500">سجل دخولك للوصول إلى خدمات IU Connect</p>
        </div>

        {/* نموذج الإيميل */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              البريد الإلكتروني (الجامعي أو الشخصي)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="s1234567@st.iu.edu.sa"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-left"
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-[#0c3a6b] transition-colors disabled:opacity-70"
          >
            {loading ? "جاري الإرسال..." : "إرسال رابط الدخول 🔗"}
          </button>
        </form>

        {/* رسائل النجاح أو الخطأ */}
        {message && (
          <div className={`mt-4 p-4 rounded-lg text-sm font-medium text-center ${message.includes('✅') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message}
          </div>
        )}

        {/* الفاصل */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-sm text-gray-400 font-medium">أو</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        {/* زر الدخول بجوجل */}
        <button
          onClick={() => alert('سيتم تفعيل الدخول بجوجل لاحقاً!')}
          className="mt-6 w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          تسجيل الدخول بحساب Google
        </button>
      </div>
    </div>
  );
}