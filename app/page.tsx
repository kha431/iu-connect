"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';

// أيقونات بسيطة للأقسام
const ZapIcon = () => <span>⚡</span>;
const BookIcon = () => <span>📚</span>;
const UserGroupIcon = () => <span>👥</span>;
const LostIcon = () => <span>🔎</span>;

export default function HomePage() {
  const { user } = useAuthStore();
  const [latestListings, setLatestListings] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);

  // جلب آخر الإعلانات من قاعدة البيانات لتبدو الصفحة "حية"
  useEffect(() => {
    async function fetchLatestListings() {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4); // نجلب آخر 4 فقط

      if (!error && data) {
        setLatestListings(data);
      }
      setLoadingListings(false);
    }
    fetchLatestListings();
  }, []);

  const features = [
    { name: 'سوق الطلاب', desc: 'كتب، أدوات، أثاث سكن.. كل شيء بأسعار طلابية.', icon: <BookIcon />, link: '/market', color: 'bg-emerald-50 text-emerald-700' },
    { name: 'مجموعات الدراسة', desc: 'تواصل مع زملاء تخصصك وذاكروا سوا.', icon: <UserGroupIcon />, link: '/groups', color: 'bg-sky-50 text-sky-700' },
    { name: 'المفقودات', desc: 'لقيت شيء؟ أو ضيعت شيء؟ أعلن هنا.', icon: <LostIcon />, link: '/lost-found', color: 'bg-rose-50 text-rose-700' },
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1️⃣ Hero Section: البانر الكبير (The WOW Start) */}
      <section className="relative bg-primary text-white rounded-3xl p-10 md:p-16 overflow-hidden shadow-2xl mt-4">
        {/* خلفية جمالية خفيفة */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dotPattern" patternUnits="userSpaceOnUse" width="32" height="32">
                <circle cx="2" cy="2" r="2" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotPattern)" />
          </svg>
        </div>
        
        <div className="relative z-10 max-w-3xl space-y-6 text-center md:text-right">
          <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-1.5 rounded-full text-sm font-bold border border-secondary/30">
            <ZapIcon />
            <span>منصة طلاب الجامعة الإسلامية</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            كل احتياجاتك الجامعية في <span className="text-secondary">مكان واحد</span>
          </h1>
          
          <p className="text-xl text-blue-100 max-w-2xl">
            سوق تفاعلي، مجموعات دراسية، وبوابة للمفقودات. صُمم خصيصاً لتسهيل حياتك داخل الحرم الجامعي والسكن.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
            <Link href="/market" className="bg-secondary hover:bg-yellow-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg text-center">
              ابدأ التصفح الآن 🔥
            </Link>
            {!user && (
              <Link href="/register" className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all border border-white/20 text-center">
                إنشاء حساب سريع
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 2️⃣ أقسام الخدمات: (سهولة الوصول وفهم الفكرة) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feat) => (
          <Link key={feat.name} href={feat.link} className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl mb-6 ${feat.color}`}>
              {feat.icon}
            </div>
            <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-secondary transition">{feat.name}</h3>
            <p className="text-gray-600 leading-relaxed">{feat.desc}</p>
          </Link>
        ))}
      </section>

      {/* 3️⃣ أحدث الإعلانات: (الموقع "حي" وينبض بالحياة) */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary">آخر الإعلانات في السوق 🛒</h2>
          <Link href="/market" className="text-secondary font-bold hover:underline">عرض الكل →</Link>
        </div>

        {loadingListings ? (
          <div className="text-center py-10 text-gray-500">جاري تحميل المعروضات... ⏳</div>
        ) : latestListings.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <span className="text-5xl block mb-4">📢</span>
            <p className="text-gray-600 font-medium">السوق فاضي حالياً، كن أول من يعلن عن غرض!</p>
            <Link href="/market/new" className="inline-block mt-4 bg-primary text-white px-5 py-2 rounded-lg font-bold">أضف إعلان</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestListings.map((item) => (
              <div key={item.id} className="border border-gray-100 rounded-xl overflow-hidden group">
                <div className="h-40 bg-gray-50 flex items-center justify-center relative">
                  {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : <span className="text-4xl">📦</span>}
                  <span className="absolute top-2 left-2 bg-white/90 px-2 py-0.5 rounded-md text-[10px] font-bold text-primary border border-gray-100">{item.category}</span>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-primary line-clamp-1 group-hover:text-secondary transition">{item.title}</h4>
                  <p className="text-secondary font-bold mt-1">{item.price} ريال</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}