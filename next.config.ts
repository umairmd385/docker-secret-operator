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

  // ✅ SEO: Rewrite static HTML docs to clean URLs (no .html extension)
  // This prevents duplicate indexing and serves docs transparently
  rewrites: async () => ({
    beforeFiles: [
      // Map /docs/guide/* routes to /docs/guide/*.html static files
      {
        source: "/docs/guide/:path*",
        destination: "/docs/guide/:path*.html",
      },
      // Map /docs/cli/* routes to /docs/cli/*.html static files
      {
        source: "/docs/cli/:path*",
        destination: "/docs/cli/:path*.html",
      },
    ],
    fallback: [],
  }),

  // ✅ SEO: Redirect any explicit .html requests to clean URLs
  redirects: async () => [
    {
      source: "/docs/:path*.html",
      destination: "/docs/:path*",
      permanent: true, // 301 redirect for SEO
    },
  ],

  // ✅ Headers to prevent indexing of static HTML files
  headers: async () => [
    {
      source: "/docs/:path*.html",
      headers: [
        {
          key: "X-Robots-Tag",
          value: "noindex, nofollow",
        },
      ],
    },
    {
      source: "/public/:path*.html",
      headers: [
        {
          key: "X-Robots-Tag",
          value: "noindex, nofollow",
        },
      ],
    },
  ],
};

export default nextConfig;
