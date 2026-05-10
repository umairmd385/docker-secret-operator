import React from "react";
import { BRAND_COLORS } from "@/lib/branding/colors";
import { VerificationBadge } from "./VerificationBadge";

export interface ProviderCardProps {
  name: string;
  slug: string;
  description: string;
  logo?: string;
  category?: string;
  lastVerified?: string;
  features?: string[];
  link?: string;
  className?: string;
  onClick?: () => void;
  verified?: boolean;
  featured?: boolean;
}

/**
 * Provider Card Component
 *
 * Card displaying integration provider information with verification badge.
 * Used on integrations page and comparison pages.
 */
export function ProviderCard({
  name,
  slug,
  description,
  logo,
  category,
  lastVerified,
  features = [],
  link,
  className = "",
  onClick,
  verified = true,
  featured = false,
}: ProviderCardProps) {
  const cardContent = (
    <div
      className={`relative rounded-xl border border-white/10 p-6 transition-all duration-300 hover:border-accent/50 ${
        featured ? "ring-2 ring-accent" : ""
      } ${className}`}
      onClick={onClick}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />

      <div className="relative z-10">
        {/* Provider Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            {logo && (
              <img
                src={logo}
                alt={name}
                className="w-12 h-12 rounded-lg"
                loading="lazy"
              />
            )}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                {name}
              </h3>
              {category && (
                <p className="text-xs text-gray-500 mt-1">{category}</p>
              )}
            </div>
          </div>

          {/* Verification Badge */}
          {verified && lastVerified && (
            <div className="ml-2">
              <VerificationBadge
                lastVerified={lastVerified}
                size="sm"
                variant="badge"
                showDate={false}
              />
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-400 mb-4 leading-relaxed">{description}</p>

        {/* Features List */}
        {features.length > 0 && (
          <div className="mb-6">
            <div className="text-xs text-gray-500 font-mono uppercase tracking-wide mb-2">
              Key Features:
            </div>
            <ul className="space-y-1">
              {features.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="text-sm text-gray-400">
                  <span className="text-accent">•</span> {feature}
                </li>
              ))}
              {features.length > 3 && (
                <li className="text-sm text-gray-500 italic">
                  +{features.length - 3} more
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Last Verified Info */}
        {lastVerified && (
          <div className="text-xs text-gray-600 mb-4 flex items-center gap-1">
            <span>✓</span>
            <span>
              Last verified:{" "}
              {new Date(lastVerified).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        )}

        {/* CTA */}
        <div className="inline-flex items-center gap-2 text-sm font-bold text-accent group-hover:gap-3 transition-all">
          {link ? "View Setup Guide" : "Learn More"}
          <span>→</span>
        </div>
      </div>
    </div>
  );

  if (link) {
    return (
      <a
        href={link}
        className="group no-underline"
      >
        {cardContent}
      </a>
    );
  }

  return (
    <div className="group cursor-pointer" onClick={onClick}>
      {cardContent}
    </div>
  );
}

/**
 * Provider Grid Component
 *
 * Displays multiple provider cards in a responsive grid.
 */
export function ProviderGrid({
  providers,
  columns = 2,
  className = "",
}: {
  providers: ProviderCardProps[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}) {
  const gridClass = {
    1: "grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  }[columns];

  return (
    <div className={`grid ${gridClass} gap-6 sm:gap-8 ${className}`}>
      {providers.map((provider) => (
        <ProviderCard key={provider.slug} {...provider} />
      ))}
    </div>
  );
}

/**
 * Featured Provider Card (larger variant)
 *
 * For highlighting specific providers or recommendations.
 */
export function FeaturedProviderCard(props: ProviderCardProps) {
  return (
    <div className="md:col-span-2">
      <ProviderCard {...props} featured={true} />
    </div>
  );
}
