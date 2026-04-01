"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ListingDetailsPage({ params }: { params: { id: string } }) {
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListing() {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', params.id)
        .single();

      if (data) setListing(data);
      setLoading(false);
    }
    fetchListing();
  }, [params.id]);

  if (loading) return <div className="text-center py-20 text-gray-500">جاري تحميل الإعلان... ⏳</div>;
  if (!listing) return <div className="text-center py-20 text-red-500 font-bold">عذراً، الإعلان غير موجود أو تم حذفه! ❌</div>;

  const whatsappNumber = listing.whatsapp.startsWith('0') ? '966' + listing.whatsapp.slice(1) : listing.whatsapp;
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=السلام عليكم، بخصوص إعلانك (${listing.title}) في منصة IU Connect...`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/market" className="text-gray-500 hover:text-primary font-medium flex items-center gap-2 w-fit">
        <span>🔙</span> العودة للسوق
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* قسم الصورة الحقيقية */}
        <div className="md:w-1/2 bg-gray-50 border-b md:border-b-0 md:border-l border-gray-100 flex items-center justify-center min-h-[300px] relative">
          {listing.image_url ? (
            <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover absolute inset-0" />
          ) : (
            <span className="text-8xl">📦</span>
          )}
        </div>

        {/* قسم التفاصيل */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">{listing.title}</h1>
            <span className="bg-green-50 text-green-700 border border-green-200 text-lg font-bold px-3 py-1 rounded-lg whitespace-nowrap mr-3">
              {listing.price === 0 ? 'مجاني' : `${listing.price} ريال`}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-sm font-medium">{listing.category}</span>
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm font-medium">{listing.condition}</span>
            {listing.college && (
              <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-md text-sm font-medium">🏫 {listing.college}</span>
            )}
          </div>

          <div className="mb-8 flex-grow">
            <h3 className="text-sm font-bold text-gray-400 mb-2">وصف الإعلان:</h3>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed border p-4 rounded-xl bg-gray-50 border-gray-100">
              {listing.description}
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-auto">
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span className="text-2xl">💬</span> تواصل مع البائع عبر واتساب
            </a>
            <p className="text-center text-xs text-gray-400 mt-2">
              نُشر في: {new Date(listing.created_at).toLocaleDateString('ar-SA')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}