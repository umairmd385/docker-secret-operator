import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false, // ✅ Enable Next.js Image optimization

    // ✅ Support modern image formats (will auto-serve optimal format per browser)
    formats: ["image/avif", "image/webp"],

    // ✅ Device breakpoints for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // ✅ Image container sizes for srcset generation
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // ✅ Allow images from external trusted CDNs
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.icons8.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
