import React from "react";
import { DSOLogo, DSOLogoIcon, ResponsiveDSOLogo } from "./DSOLogo";
import { BRAND_COLORS } from "@/lib/branding/colors";

export interface BrandHeaderProps {
  title?: string;
  subtitle?: string;
  description?: string;
  showLogo?: boolean;
  logoVariant?: "icon" | "horizontal" | "responsive";
  centered?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  darkMode?: boolean;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

/**
 * Brand Header Component
 *
 * Consistent header styling with optional logo and branding.
 * Used across pages for visual cohesion.
 */
export function BrandHeader({
  title,
  subtitle,
  description,
  showLogo = false,
  logoVariant = "responsive",
  centered = true,
  size = "md",
  className = "",
  darkMode = false,
  breadcrumbs,
}: BrandHeaderProps) {
  const sizeConfig = {
    sm: {
      titleSize: "text-2xl sm:text-3xl",
      subtitleSize: "text-sm sm:text-base",
      descriptionSize: "text-base sm:text-lg",
      spacing: "gap-2",
      marginBottom: "mb-8",
    },
    md: {
      titleSize: "text-3xl sm:text-4xl",
      subtitleSize: "text-base sm:text-lg",
      descriptionSize: "text-lg sm:text-xl",
      spacing: "gap-3",
      marginBottom: "mb-12",
    },
    lg: {
      titleSize: "text-4xl sm:text-5xl",
      subtitleSize: "text-lg sm:text-xl",
      descriptionSize: "text-xl sm:text-2xl",
      spacing: "gap-4",
      marginBottom: "mb-16",
    },
  };

  const config = sizeConfig[size];

  return (
    <header
      className={`${centered ? "text-center" : ""} ${config.marginBottom} ${className}`}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {idx > 0 && <span className="text-gray-400">/</span>}
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-accent transition-colors">
                  {crumb.label}
                </a>
              ) : (
                <span>{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Logo */}
      {showLogo && (
        <div className={`flex ${centered ? "justify-center" : ""} mb-4`}>
          {logoVariant === "icon" && (
            <DSOLogoIcon size="lg" darkMode={darkMode} />
          )}
          {logoVariant === "horizontal" && (
            <DSOLogo variant="horizontal" darkMode={darkMode} />
          )}
          {logoVariant === "responsive" && (
            <ResponsiveDSOLogo darkMode={darkMode} />
          )}
        </div>
      )}

      {/* Title */}
      {title && (
        <h1
          className={`${config.titleSize} font-bold mb-2 text-foreground`}
        >
          {title}
        </h1>
      )}

      {/* Subtitle */}
      {subtitle && (
        <div className={`${config.subtitleSize} text-gray-500 mb-3`}>
          {subtitle}
        </div>
      )}

      {/* Description */}
      {description && (
        <p
          className={`${config.descriptionSize} text-gray-400 ${
            centered ? "max-w-2xl mx-auto" : ""
          }`}
        >
          {description}
        </p>
      )}
    </header>
  );
}

/**
 * Simple Header (text only)
 */
export function SimpleHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <BrandHeader
      title={title}
      subtitle={subtitle}
      centered={true}
      size="md"
      showLogo={false}
    />
  );
}

/**
 * Hero Header (large with logo)
 */
export function HeroHeader({
  title,
  description,
  subtitle,
  darkMode = false,
}: {
  title: string;
  description?: string;
  subtitle?: string;
  darkMode?: boolean;
}) {
  return (
    <BrandHeader
      title={title}
      subtitle={subtitle}
      description={description}
      showLogo={true}
      logoVariant="responsive"
      centered={true}
      size="lg"
      darkMode={darkMode}
      className="py-12 sm:py-16 md:py-20"
    />
  );
}

/**
 * Section Header (medium with optional logo)
 */
export function SectionHeader({
  title,
  description,
  showLogo = false,
  darkMode = false,
}: {
  title: string;
  description?: string;
  showLogo?: boolean;
  darkMode?: boolean;
}) {
  return (
    <BrandHeader
      title={title}
      description={description}
      showLogo={showLogo}
      logoVariant="icon"
      centered={true}
      size="md"
      darkMode={darkMode}
      className="mb-12"
    />
  );
}

/**
 * Navigation Header (with breadcrumbs)
 */
export function NavHeader({
  title,
  breadcrumbs,
}: {
  title: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
}) {
  return (
    <BrandHeader
      title={title}
      centered={false}
      size="sm"
      breadcrumbs={breadcrumbs}
    />
  );
}
