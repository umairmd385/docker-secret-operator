/**
 * Analytics Event Tracking Utility
 * Uses Vercel Analytics window.va queue for custom events
 */

declare global {
  interface Window {
    va?: (...args: any[]) => void;
  }
}

const trackCustomEvent = (eventName: string, data?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.va) {
    window.va("event", { name: eventName, ...data });
  }
};

export const trackEvent = {
  // Newsletter
  newsletterSignup: (email: string, success: boolean) => {
    trackCustomEvent("newsletter_signup", {
      email_domain: email.split("@")[1] || "unknown",
      success,
    });
  },

  // CTAs
  ctaClick: (label: string, location: string) => {
    trackCustomEvent("cta_click", { label, location });
  },

  // Documentation
  docView: (path: string) => {
    trackCustomEvent("doc_view", { path });
  },

  // External Links
  externalLinkClick: (href: string, text: string) => {
    trackCustomEvent("external_link", { href, text });
  },

  // Features
  featureExplore: (featureName: string) => {
    trackCustomEvent("feature_explore", { feature: featureName });
  },

  // Social
  socialClick: (platform: string) => {
    trackCustomEvent("social_click", { platform });
  },
};
