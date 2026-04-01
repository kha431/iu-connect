/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // هذا السطر يتجاهل أخطاء التنسيق وقت الرفع
    ignoreDuringBuilds: true,
  },
  typescript: {
    // هذا السطر يتجاهل أخطاء الأنواع وقت الرفع
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
