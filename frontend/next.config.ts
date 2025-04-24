import type { NextConfig } from "next";
// import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true, 
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  },
};

// // Настройка PWA
// const pwaConfig = withPWA({
//   dest: "public", // PWA файлы хранятся в public/
//   register: true, // Регистрация Service Worker автоматически
//   skipWaiting: true, // Автообновление Service Worker
// });

export default nextConfig ;
