import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DSO | Docker Secret Operator — Kubernetes-grade Secrets for Docker",
  description: "Docker Secret Operator (DSO) — Kubernetes-grade secret management for Docker. Sync secrets from AWS, Azure, Vault & more. Zero cluster overhead. MIT licensed.",
  openGraph: {
    title: "DSO | Docker Secret Operator",
    description: "Native secret management for Docker. Sync from AWS, Azure, HashiCorp Vault and more.",
    url: "https://dso.skycloudops.in/",
    siteName: "Docker Secret Operator",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable} antialiased`}
    >
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
