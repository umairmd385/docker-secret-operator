import React from "react";

export interface DSOLogoProps {
  variant?: "primary" | "icon" | "horizontal";
  size?: "sm" | "md" | "lg";
  className?: string;
  alt?: string;
  darkMode?: boolean;
}

/**
 * DSO Logo Component - Simplified
 */
export function DSOLogo({
  variant = "primary",
  size = "lg",
  className = "",
  alt = "Docker Secret Operator",
}: DSOLogoProps) {
  const sizeMap = {
    sm: 32,
    md: 48,
    lg: 64,
  };

  const logoMap = {
    primary: "/logo/dso-primary-logo.svg",
    icon: "/logo/dso-icon-only.svg",
    horizontal: "/logo/dso-horizontal.svg",
  };

  const computedSize = sizeMap[size];
  const aspectRatio = variant === "horizontal" ? 3.6 : 1;
  const height = variant === "horizontal" ? Math.round(computedSize / 2.33) : computedSize;

  return (
    <img
      src={logoMap[variant]}
      alt={alt}
      width={computedSize}
      height={height}
      className={`inline-block ${className}`}
      loading="lazy"
      style={{
        maxWidth: "100%",
        height: "auto",
      }}
    />
  );
}

export function DSOLogoIcon({
  size = "md",
  className = "",
  alt = "DSO",
}: Omit<DSOLogoProps, "variant">) {
  return (
    <DSOLogo variant="icon" size={size} className={className} alt={alt} />
  );
}

export function DSOLogoHorizontal({
  size = "lg",
  className = "",
  alt = "Docker Secret Operator",
}: Omit<DSOLogoProps, "variant">) {
  return (
    <DSOLogo variant="horizontal" size={size} className={className} alt={alt} />
  );
}

export function ResponsiveDSOLogo({
  size = "lg",
  className = "",
  alt = "Docker Secret Operator",
  darkMode = false,
}: Omit<DSOLogoProps, "variant">) {
  return (
    <DSOLogo variant="primary" size={size} className={className} alt={alt} />
  );
}
