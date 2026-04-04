import './globals.css';
import Navbar from '@/components/Navbar';
import AuthProvider from '@/components/AuthProvider';
import { Analytics } from '@vercel/analytics/react'; // 👈 1. هذا السطر الأول اللي أضفناه للإحصائيات

export const metadata = {
  title: 'IU Connect',
  description: 'منصة طلاب الجامعة الإسلامية',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen bg-gray-50">
            
            {/* 🌟 حاوية البانر عشان يكون متوسط ومضبوط مع الشاشات 🌟 */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              
              {/* 📱 بانر التليجرام الذكي - تم تصغيره ليكون شريطاً مضغوطاً وبسيطاً مثل "Saalati" */}
              <div className="bg-gradient-to-r from-[#0088cc] to-[#00a2f0] rounded-full shadow-md p-2 px-4 mb-4 flex flex-row items-center justify-between gap-3 text-white relative overflow-hidden border border-[#0077b5]/20">
                {/* شكل دائري زينة في الخلفية (مصغر) */}
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 bg-white opacity-10 rounded-full blur-xl pointer-events-none"></div>
                
                <div className="flex flex-row items-center gap-3 relative z-10">
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm shadow-inner flex-shrink-0">
                    {/* أيقونة التليجرام الرسمية (مصغرة) */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </div>
                  <div className="flex flex-row items-center gap-1.5 text-right">
                    {/* النص الرئيسي (مصغر) */}
                    <h3 className="text-sm md:text-lg font-bold">انضم لقناة التليجرام</h3>
                  </div>
                </div>
                
                <a 
                  href="https://t.me/+M1N7XvbeBPQ2YTJk" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white text-[#0088cc] px-5 py-2 rounded-full font-bold hover:bg-gray-50 transition shadow-lg w-auto text-center text-sm relative z-10 flex-shrink-0"
                >
                  🚀 انضم الآن
                </a>
              </div>
            </div>

            {children}
          </main>
        </AuthProvider>
        <Analytics /> {/* 👈 2. وهذا السطر الثاني اللي أضفناه تحت */}
      </body>
    </html>
  );
}