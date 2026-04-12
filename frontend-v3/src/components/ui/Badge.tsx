import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "ghost";
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-surface2 border-border text-foreground",
      success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
      warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
      danger: "bg-red-500/10 border-red-500/30 text-red-400",
      ghost: "bg-transparent border-transparent text-muted-foreground",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
