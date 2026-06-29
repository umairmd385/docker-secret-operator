/**
 * Structured Data (schema.org) Generation
 *
 * Type-safe schema.org generation for different page types.
 * Supports: BreadcrumbList, HowTo, FAQ, Product, and more.
 */

import { SITE_CONFIG } from "./metadata";

/**
 * Generate breadcrumb list schema for a page
 * Builds breadcrumbs from URL pathname
 */
export function generateBreadcrumbSchema(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const baseUrl = SITE_CONFIG.baseUrl;
  const breadcrumbs: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }> = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: baseUrl,
    },
  ];

  let currentPath = "";
  parts.forEach((part, index) => {
    currentPath += `/${part}`;
    const name = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " ");

    breadcrumbs.push({
      "@type": "ListItem",
      position: index + 2,
      name,
      item: baseUrl + currentPath,
    });
  });

  return {
    "@context": "https://schema.org" as const,
    "@type": "BreadcrumbList" as const,
    itemListElement: breadcrumbs,
  };
}

/**
 * Generate HowTo schema for guide/tutorial pages
 */
export function generateHowToSchema(params: {
  name: string;
  description: string;
  image?: string;
  steps: Array<{
    name: string;
    description: string;
    image?: string;
  }>;
  estimatedTime?: string;
  yieldNum?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: params.name,
    description: params.description,
    ...(params.image && { image: params.image }),
    steps: params.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.description,
      ...(step.image && { image: step.image }),
    })),
    ...(params.estimatedTime && {
      totalTime: params.estimatedTime,
    }),
    ...(params.yieldNum && {
      yield: {
        "@type": "QuantitativeValue",
        value: params.yieldNum,
      },
    }),
  };
}

/**
 * Generate FAQ schema for FAQ pages
 */
export function generateFAQSchema(
  faqs: Array<{
    question: string;
    answer: string;
  }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate SoftwareApplication schema
 * Useful for tool/software product pages
 */
export function generateSoftwareSchema(params: {
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem?: string[];
  url?: string;
  downloadUrl?: string;
  softwareVersion?: string;
  author?: {
    name: string;
    url?: string;
  };
  license?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: params.name,
    description: params.description,
    applicationCategory: params.applicationCategory,
    ...(params.operatingSystem && {
      operatingSystem: params.operatingSystem,
    }),
    ...(params.url && { url: params.url }),
    ...(params.downloadUrl && { downloadUrl: params.downloadUrl }),
    ...(params.softwareVersion && { softwareVersion: params.softwareVersion }),
    ...(params.author && {
      author: {
        "@type": "Organization",
        name: params.author.name,
        ...(params.author.url && { url: params.author.url }),
      },
    }),
    ...(params.license && { license: params.license }),
    ...(params.image && { image: params.image }),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

/**
 * Generate Article schema for blog/guide articles
 */
export function generateArticleSchema(params: {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: {
    name: string;
    url?: string;
  };
  articleBody?: string;
  wordCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.headline,
    description: params.description,
    ...(params.image && { image: params.image }),
    datePublished: params.datePublished,
    ...(params.dateModified && { dateModified: params.dateModified }),
    ...(params.author && {
      author: {
        "@type": "Organization",
        name: params.author.name,
        ...(params.author.url && { url: params.author.url }),
      },
    }),
    ...(params.articleBody && { articleBody: params.articleBody }),
    ...(params.wordCount && { wordCount: params.wordCount }),
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.baseUrl}/dso-logo.png`,
        width: SITE_CONFIG.ogImageWidth,
        height: SITE_CONFIG.ogImageHeight,
      },
    },
  };
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.baseUrl,
    logo: `${SITE_CONFIG.baseUrl}/dso-logo.png`,
    description: SITE_CONFIG.description,
    sameAs: [
      "https://github.com/docker-secret-operator/dso",
      "https://x.com/skycloudops",
      "https://discord.gg/MqgFaVA6b",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Community Support",
      url: "https://github.com/docker-secret-operator/dso/discussions",
    },
  };
}

/**
 * Generate WebSite schema with search action
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_CONFIG.baseUrl}/docs?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate Comparison schema for comparison pages
 */
export function generateComparisonSchema(params: {
  title: string;
  description: string;
  product1Name: string;
  product1Url: string;
  product2Name: string;
  product2Url: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ComparisonChart",
    name: params.title,
    description: params.description,
    chartCaption: params.title,
    itemReviewed: [
      {
        "@type": "Product",
        name: params.product1Name,
        url: params.product1Url,
      },
      {
        "@type": "Product",
        name: params.product2Name,
        url: params.product2Url,
      },
    ],
    datePublished: params.datePublished,
    ...(params.dateModified && { dateModified: params.dateModified }),
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
    },
  };
}
