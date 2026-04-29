import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false, // non-critical — only used inside code blocks
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dso.run"),
  title: {
    default: "DSO | Docker Secret Operator",
    template: "%s | DSO",
  },
  description: "Event-driven, zero-persistence secret management for standalone Docker environments. A memory-safe, open-source alternative to .env files.",
  keywords: ["docker secrets management", "secret injection docker", "vault alternative docker", "zero persistence secrets", "devsecops"],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Docker Secret Operator — Zero-Persistence Secret Injection",
    description: "Inject secrets into Docker containers at runtime. No disk writes. No restarts. Open source, MIT licensed.",
    url: "https://dso.run",
    siteName: "Docker Secret Operator",
    images: [{ url: "/dso-logo.png", width: 1024, height: 1024, alt: "Docker Secret Operator" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Docker Secret Operator",
    description: "Zero-persistence secret injection for standalone Docker. MIT licensed.",
    images: ["/dso-logo.png"],
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Docker Secret Operator",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Linux, macOS, Windows",
    description: "Event-driven, zero-persistence secret injection for standalone Docker environments. Open source, MIT licensed.",
    url: "https://dso.run",
    license: "https://opensource.org/licenses/MIT",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-accent-dim selection:text-accent">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
