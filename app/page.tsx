import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[80vh]">
      
      {/* القسم الترحيبي */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-4">
        <div className="bg-primary/5 text-primary font-bold px-4 py-2 rounded-full mb-6 text-sm border border-primary/10">
          🚀 المنصة الأولى لطلاب الجامعة
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-primary mb-6 leading-tight">
          كل اللي تحتاجه في الجامعة <br />
          <span className="text-secondary">في مكان واحد!</span>
        </h1>
        <p className="text-gray-500 text-lg md:text-xl max-w-2xl mb-10">
          منصة IU Connect صُممت خصيصاً لتسهيل حياتك الجامعية. بيع واشتر، نسق مشاويرك، ودوّر على مفقوداتك بكل سهولة.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/market" className="bg-primary hover:bg-[#0c3a6b] text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg text-lg">
            تصفح السوق الآن 🛍️
          </Link>
          <Link href="/groups" className="bg-white hover:bg-gray-50 text-primary border-2 border-gray-100 font-bold py-3 px-8 rounded-xl transition-all shadow-sm hover:shadow-md text-lg">
            شوف المجموعات 👥
          </Link>
        </div>
      </section>

      {/* قسم الخدمات (تعدل لـ 3 بطاقات بدل 4) */}
      <section className="py-12 px-4 max-w-5xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-center text-primary mb-10">خدمات المنصة</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* كرت السوق */}
          <Link href="/market" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all group">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              🛍️
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">السوق الجامعي</h3>
            <p className="text-gray-500 text-sm">بيع واشتر الكتب، الأجهزة، وأي شيء تحتاجه من زملائك الطلاب.</p>
          </Link>

          {/* كرت المجموعات */}
          <Link href="/groups" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all group">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              👥
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">المجموعات والقطة</h3>
            <p className="text-gray-500 text-sm">نسق مشاويرك، اطلب أكل وقط مع الشباب، أو ابحث عن قروب مذاكرة.</p>
          </Link>

          {/* كرت المفقودات */}
          <Link href="/lost" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all group">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              🔍
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">المفقودات</h3>
            <p className="text-gray-500 text-sm">ضيعت شيء أو لقيت غرض في القاعات؟ نزله هنا عشان يرجع لصاحبه.</p>
          </Link>

        </div>
      </section>

    </div>
  );
}