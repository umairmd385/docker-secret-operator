import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";
import "@/styles/mobile.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dso.skycloudops.in"),
  verification: {
    google: "aca7dac2601cbebd",
  },
  title: {
    default: "Docker Secret Operator (DSO) | CNCF Sandbox Project",
    template: "%s | DSO",
  },
  description: "Docker Secret Operator (DSO) - Secret operator for Docker & Kubernetes. Zero-persistence secret management with event-driven injection. CNCF sandbox project alternative to Vault. Apache 2.0 licensed.",
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
        alt: "Docker Secret Operator — Zero-Persistence Secret Injection for Docker",
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
    icon: "/favicon.svg",
    apple: "/favicon.svg",
    shortcut: "/favicon.svg",
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
      description: "Event-driven, zero-persistence secret injection for standalone Docker environments. Open source, CNCF Sandbox project, Apache 2.0 licensed.",
      url: "https://dso.skycloudops.in",
      image: "https://dso.skycloudops.in/dso-logo.png",
      license: "https://www.apache.org/licenses/LICENSE-2.0",
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
        "https://www.linkedin.com/in/mdumair250801/",
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
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Docker Secret Operator",
      url: "https://dso.skycloudops.in",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://dso.skycloudops.in/docs?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: "Docker Secret Operator",
      description: "Open source secret management operator for Docker. Zero-persistence, event-driven secret injection. CNCF Sandbox project.",
      codeRepository: "https://github.com/docker-secret-operator/dso",
      programmingLanguage: ["Go", "Shell"],
      license: "https://www.apache.org/licenses/LICENSE-2.0",
      url: "https://dso.skycloudops.in",
      author: {
        "@type": "Organization",
        name: "Docker Secret Operator Community",
        url: "https://github.com/docker-secret-operator",
      },
      keywords: "docker, secret-management, secret-operator, kubernetes, devops, cncf, security, vault-alternative",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Docker Secret Operator (DSO)?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Docker Secret Operator (DSO) is an open-source, CNCF Sandbox project that provides zero-persistence, event-driven secret injection for Docker containers. It allows you to securely inject secrets at runtime without ever writing them to disk.",
          },
        },
        {
          "@type": "Question",
          name: "Is Docker Secret Operator free to use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, Docker Secret Operator is completely free and open source, licensed under the Apache License 2.0. It is available on GitHub at https://github.com/docker-secret-operator/dso.",
          },
        },
        {
          "@type": "Question",
          name: "How does DSO compare to HashiCorp Vault?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "DSO is a lightweight, Docker-native alternative to HashiCorp Vault. While Vault requires complex infrastructure setup, DSO works directly with Docker using a simple CLI. It supports local encrypted vaults as well as cloud providers like AWS Secrets Manager and Azure Key Vault with zero-persistence secret injection.",
          },
        },
        {
          "@type": "Question",
          name: "Which cloud providers does Docker Secret Operator support?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Docker Secret Operator supports AWS Secrets Manager, Azure Key Vault, HashiCorp Vault, Huawei Cloud Secret Manager, and a local encrypted vault mode. All providers use the same CLI workflow.",
          },
        },
        {
          "@type": "Question",
          name: "How do I install Docker Secret Operator?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Install DSO with a single command: curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | bash. Then run 'docker dso init' to initialize. Full documentation is available at /docs/guide/getting-started.",
          },
        },
        {
          "@type": "Question",
          name: "What is zero-persistence secret management?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Zero-persistence means secrets are injected directly into container memory at runtime and never written to disk, environment files, or Docker layers. This eliminates the risk of secrets being exposed through file system access, docker inspect, or image layer scanning.",
          },
        },
      ],
    },
  ];

  return (
    <html
      lang="en"
      className="h-full antialiased dark"
    >
      <head>
        {jsonLd.map((schema, idx) => (
          <script
            key={idx}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="DSO LLM Documentation" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-accent-dim selection:text-accent">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
