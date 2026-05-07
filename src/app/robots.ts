import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/*.json$"],
      },
      {
        userAgent: ["MJ12bot", "AhrefsBot", "SemrushBot"],
        disallow: "/",
      },
    ],
    sitemap: "https://dso.skycloudops.in/sitemap.xml",
  };
}
