import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // استدعينا الشريط اللي برمجناه

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
});

export const metadata: Metadata = {
  title: "IU Connect | المنصة الطلابية",
  description: "المنصة الطلابية المتكاملة لطلاب الجامعة الإسلامية بالمدينة المنورة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${ibmPlexArabic.className} bg-background min-h-screen flex flex-col`}>
        {/* شريط التنقل الجديد */}
        <Navbar />
        
        {/* محتوى الصفحات المتغير */}
        <main className="container mx-auto p-4 flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
