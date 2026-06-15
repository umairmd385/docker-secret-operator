import React from "react";
import { cn } from "@/lib/utils";

/**
 * Heading components - Standardized heading styles
 * Inspired by Linear's typography hierarchy
 */

export const H1 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h1
      ref={ref}
      className={cn(
        "text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight",
        className
      )}
      {...props}
    />
  )
);
H1.displayName = "H1";

export const H2 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        "text-3xl sm:text-4xl font-bold text-foreground tracking-tight",
        className
      )}
      {...props}
    />
  )
);
H2.displayName = "H2";

export const H3 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-2xl sm:text-3xl font-bold text-foreground",
        className
      )}
      {...props}
    />
  )
);
H3.displayName = "H3";

export const H4 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h4
      ref={ref}
      className={cn(
        "text-xl font-bold text-foreground",
        className
      )}
      {...props}
    />
  )
);
H4.displayName = "H4";

/**
 * Body text components
 */

export const P = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-base text-gray-300 leading-relaxed", className)}
      {...props}
    />
  )
);
P.displayName = "P";

export const PSmall = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-gray-400 leading-relaxed", className)}
      {...props}
    />
  )
);
PSmall.displayName = "PSmall";

export const PLead = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-lg text-gray-300 leading-relaxed", className)}
      {...props}
    />
  )
);
PLead.displayName = "PLead";

/**
 * Other semantic text components
 */

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("text-sm font-semibold text-foreground", className)}
      {...props}
    />
  )
);
Label.displayName = "Label";

export const Code = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <code
      ref={ref}
      className={cn(
        "font-mono text-sm bg-gray-800/50 px-2 py-1 rounded text-accent border border-gray-700",
        className
      )}
      {...props}
    />
  )
);
Code.displayName = "Code";

export const Muted = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("text-gray-400", className)}
      {...props}
    />
  )
);
Muted.displayName = "Muted";
