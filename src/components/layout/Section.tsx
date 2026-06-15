import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Vertical padding (py-20 sm:py-32 by default) */
  size?: "sm" | "md" | "lg";
  /** Whether to show bottom border */
  bordered?: boolean;
  /** Max width constraint */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

/**
 * Section - Standardized section container
 * Ensures consistent spacing and container widths across all pages
 */
export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, size = "lg", bordered = true, maxWidth = "xl", ...props }, ref) => {
    const sizeClasses = {
      sm: "py-12 sm:py-16",
      md: "py-16 sm:py-24",
      lg: "py-20 sm:py-32",
    };

    const maxWidthClasses = {
      sm: "max-w-2xl",
      md: "max-w-3xl",
      lg: "max-w-4xl",
      xl: "max-w-5xl",
      "2xl": "max-w-6xl",
    };

    return (
      <section
        ref={ref}
        className={cn(
          "relative bg-background",
          sizeClasses[size],
          bordered && "border-b border-gray-800",
          className
        )}
        {...props}
      >
        <div className={cn("mx-auto px-4 sm:px-6 space-y-12", maxWidthClasses[maxWidth])}>
          {props.children}
        </div>
      </section>
    );
  }
);
Section.displayName = "Section";

interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

/**
 * SectionHeading - Standardized section header
 * Includes title, optional subtitle, consistent spacing
 */
export const SectionHeading = React.forwardRef<HTMLDivElement, SectionHeadingProps>(
  ({ title, subtitle, centered = false, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("space-y-3", centered && "text-center max-w-3xl mx-auto", className)}
      {...props}
    >
      <h2 className="text-4xl sm:text-5xl font-bold text-foreground">{title}</h2>
      {subtitle && <p className="text-lg text-gray-400">{subtitle}</p>}
    </div>
  )
);
SectionHeading.displayName = "SectionHeading";
