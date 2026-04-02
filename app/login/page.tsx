"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/market`
      }
    });
    if (error) alert("لم يتم تفعيل جوجل بعد، قريباً!");
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true, // يسجل حساب جديد تلقائياً إذا ما عنده
      }
    });
    
    if (error) {
      alert(error.message);
    } else {
      setStep('otp');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email'
    });

    if (error) {
      alert("الكود غير صحيح أو انتهت صلاحيته!");
    } else if (data.user) {
      router.push('/market');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-3xl shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-primary mb-2">أهلاً بك في منصتك 🎓</h1>
        <p className="text-gray-500">سجل دخولك أو أنشئ حساباً للبدء</p>
      </div>

      {/* زر جوجل */}
      <button 
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 font-bold text-lg py-4 rounded-xl hover:bg-gray-50 transition-all mb-6"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        الدخول بواسطة Google
      </button>

      <div className="relative flex items-center py-4">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">أو عبر البريد الإلكتروني</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      {step === 'email' ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <input 
              type="email" 
              required
              placeholder="أدخل بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-4 rounded-xl border border-gray-300 outline-none focus:border-primary text-left"
              dir="ltr"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl hover:bg-[#0c3a6b] transition-all disabled:opacity-70"
          >
            {loading ? "جاري الإرسال..." : "إرسال كود الدخول"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="text-center text-sm text-gray-600 mb-4">
            أرسلنا كود من 6 أرقام إلى بريدك:<br/><span className="font-bold text-primary">{email}</span>
          </div>
          <div>
            <input 
              type="text" 
              required
              placeholder="أدخل الكود (6 أرقام)"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-4 rounded-xl border border-gray-300 outline-none focus:border-primary text-center text-2xl tracking-widest font-bold"
              dir="ltr"
              maxLength={6}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-secondary text-white font-bold text-lg py-4 rounded-xl hover:bg-yellow-600 transition-all disabled:opacity-70"
          >
            {loading ? "جاري التحقق..." : "تأكيد الدخول"}
          </button>
          <button 
            type="button"
            onClick={() => setStep('email')}
            className="w-full text-gray-500 text-sm font-medium hover:text-primary mt-2"
          >
            تعديل البريد الإلكتروني
          </button>
        </form>
      )}
    </div>
  );
}