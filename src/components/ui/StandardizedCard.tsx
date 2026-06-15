import React from "react";
import { cn } from "@/lib/utils";

interface StandardizedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "ghost" | "accent" | "interactive";
}

/**
 * StandardizedCard - Unified card component across the site
 * Variant options:
 * - default: Standard bordered card (most common)
 * - ghost: No border, subtle background
 * - accent: Accent border highlight
 * - interactive: Clickable card with hover state
 */
export const StandardizedCard = React.forwardRef<HTMLDivElement, StandardizedCardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "border border-gray-800 bg-gray-900/30 hover:border-accent/30 hover:bg-gray-900/50",
      ghost: "border-0 bg-transparent hover:bg-gray-900/20",
      accent: "border border-accent/40 bg-gradient-to-br from-accent/5 to-transparent",
      interactive: "border border-gray-800 bg-gray-900/30 hover:border-accent/40 hover:bg-gray-900/50 cursor-pointer",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg transition-all duration-200",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
StandardizedCard.displayName = "StandardizedCard";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-gray-400", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
);
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";
