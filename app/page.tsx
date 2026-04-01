import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-12 pb-16 mt-4">
      
      {/* البانر الترحيبي البسيط */}
      <section className="bg-primary text-white rounded-3xl p-8 md:p-16 shadow-xl text-center space-y-6 relative overflow-hidden">
        <h1 className="text-3xl md:text-5xl font-extrabold relative z-10">منصة الجامعة الإسلامية 🕌</h1>
        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto relative z-10 leading-relaxed">
          البوابة الشاملة لطلاب الجامعة. اختر القسم اللي تحتاجه وابدأ تصفحك الآن.
        </p>
      </section>

      {/* البوابات الثلاث (الأساس المتوازن) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. بوابة السوق */}
        <Link href="/market" className="relative bg-gradient-to-br from-emerald-500 to-green-700 rounded-3xl p-8 overflow-hidden group hover:shadow-xl transition flex flex-col justify-between min-h-[280px]">
          <div className="relative z-10 text-white space-y-4">
            <span className="text-5xl block mb-2">🛒</span>
            <h2 className="text-3xl font-bold">حراج الجامعة</h2>
            <p className="text-green-100 font-medium leading-relaxed">
              بيع واشتري كتب، أجهزة، وأثاث بأسعار طلابية، وتواصل مع البائع مباشرة بدون وسيط.
            </p>
          </div>
          <div className="relative z-10 mt-8 inline-block bg-white/20 px-6 py-3 rounded-xl font-bold text-white w-fit backdrop-blur-sm group-hover:bg-white/30 transition">
            دخول الحراج ←
          </div>
        </Link>

        {/* 2. بوابة المجموعات */}
        <Link href="/groups" className="relative bg-gradient-to-br from-sky-500 to-blue-700 rounded-3xl p-8 overflow-hidden group hover:shadow-xl transition flex flex-col justify-between min-h-[280px]">
          <div className="relative z-10 text-white space-y-4">
            <span className="text-5xl block mb-2">👥</span>
            <h2 className="text-3xl font-bold">المجموعات الدراسية</h2>
            <p className="text-blue-100 font-medium leading-relaxed">
              لا تذاكر لحالك! ابحث عن زملاء يشاركونك نفس التخصص أو المادة، وكونوا فريق دراسي ناجح.
            </p>
          </div>
          <div className="relative z-10 mt-8 inline-block bg-white/20 px-6 py-3 rounded-xl font-bold text-white w-fit backdrop-blur-sm group-hover:bg-white/30 transition">
            تصفح المجموعات ←
          </div>
        </Link>

        {/* 3. بوابة المفقودات */}
        <Link href="/lost-found" className="relative bg-gradient-to-br from-rose-500 to-red-700 rounded-3xl p-8 overflow-hidden group hover:shadow-xl transition flex flex-col justify-between min-h-[280px]">
          <div className="relative z-10 text-white space-y-4">
            <span className="text-5xl block mb-2">🔎</span>
            <h2 className="text-3xl font-bold">المفقودات</h2>
            <p className="text-red-100 font-medium leading-relaxed">
              ضيعت مفتاح غرفتك؟ أو لقيت بطاقة طايحة؟ أعلن عنها هنا وخلنا نتعاون نرجعها لأصحابها.
            </p>
          </div>
          <div className="relative z-10 mt-8 inline-block bg-white/20 px-6 py-3 rounded-xl font-bold text-white w-fit backdrop-blur-sm group-hover:bg-white/30 transition">
            قسم المفقودات ←
          </div>
        </Link>

      </section>

    </div>
  );
}