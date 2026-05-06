import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import "@/styles/mobile.css";

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
  metadataBase: new URL("https://dso.skycloudops.in"),
  title: {
    default: "Docker Secret Operator (DSO) | CNCF Sandbox Project",
    template: "%s | DSO",
  },
  description: "Docker Secret Operator (DSO) - Secret operator for Docker & Kubernetes. Zero-persistence secret management with event-driven injection. CNCF sandbox project alternative to Vault. MIT licensed.",
  keywords: [
    "docker secret operator",
    "secret operator docker",
    "kubernetes secret operator",
    "dso docker secret operator",
    "secret operator",
    "docker secrets management",
    "secret injection docker",
    "kubernetes secret management",
    "vault alternative docker",
    "vault alternative kubernetes",
    "zero persistence secrets",
    "devsecops",
    "container security",
    "secret orchestration",
    "secret rotation",
    "CNCF sandbox",
    "CNCF project",
    "open source",
    "docker plugin",
    "AWS Secrets Manager integration",
    "Azure Key Vault integration",
    "HashiCorp Vault alternative",
    "Huawei Cloud secret management",
    "docker compose secrets",
    "container secret management",
  ],
  authors: [{ name: "Docker Secret Operator Community" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://dso.skycloudops.in",
  },
  openGraph: {
    title: "Docker Secret Operator — Zero-Persistence Secret Injection",
    description: "Event-driven secret management for Docker. Inject secrets at runtime without disk writes. CNCF Sandbox project.",
    url: "https://dso.skycloudops.in",
    siteName: "Docker Secret Operator",
    images: [
      {
        url: "/dso-logo.png",
        width: 1024,
        height: 1024,
        alt: "Docker Secret Operator Logo",
        type: "image/png",
      },
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Docker Secret Operator - Secret Management for Docker",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Docker Secret Operator | Secret Management for Docker",
    description: "Zero-persistence secret injection for Docker containers. CNCF Sandbox project.",
    images: ["/og-image.png"],
    creator: "@skycloudops",
    site: "@skycloudops",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
    shortcut: "/favicon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Docker Secret Operator",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Docker Secret Operator",
      applicationCategory: "DeveloperApplication",
      operatingSystem: ["Linux", "macOS", "Windows"],
      description: "Event-driven, zero-persistence secret injection for standalone Docker environments. Open source, CNCF Sandbox project, MIT licensed.",
      url: "https://dso.skycloudops.in",
      image: "https://dso.skycloudops.in/dso-logo.png",
      license: "https://opensource.org/licenses/MIT",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      downloadUrl: "https://github.com/docker-secret-operator/dso",
      softwareRequirements: ["Docker Engine 20.10+"],
      author: {
        "@type": "Organization",
        name: "Docker Secret Operator Community",
        url: "https://github.com/docker-secret-operator",
      },
      publisher: {
        "@type": "Organization",
        name: "SkyCloudOps",
      },
      softwareHelp: {
        "@type": "CreativeWork",
        url: "https://dso.skycloudops.in/docs",
      },
      maintainer: {
        "@type": "Organization",
        name: "DSO Open Source Community",
      },
      keywords: "docker, secrets, secret-management, devops, security, zero-persistence, CNCF",
      version: "3.2",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Docker Secret Operator",
      url: "https://dso.skycloudops.in",
      logo: "https://dso.skycloudops.in/dso-logo.png",
      sameAs: [
        "https://github.com/docker-secret-operator/dso",
        "https://x.com/skycloudops",
        "https://discord.gg/skycloudops",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Community Support",
        url: "https://github.com/docker-secret-operator/dso/discussions",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://dso.skycloudops.in",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Documentation",
          item: "https://dso.skycloudops.in/docs",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "GitHub",
          item: "https://github.com/docker-secret-operator/dso",
        },
      ],
    },
  ];

  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <head>
        {jsonLd.map((schema, idx) => (
          <script
            key={idx}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-accent-dim selection:text-accent">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
