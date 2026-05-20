import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  target?: string;
  rel?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", href, children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-bold rounded-lg transition-all duration-200 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent/60";
    
    // Variant styles matching our DSO dark theme and neon accent
    const variants = {
      primary: "bg-accent text-[#060a0f] shadow-lg shadow-accent/25 hover:shadow-accent/50 hover:brightness-110 hover:scale-[1.02]",
      secondary: "bg-surface border border-border/70 text-gray-300 hover:border-accent/50 hover:text-foreground hover:bg-surface-hover",
      outline: "border border-accent/60 text-accent hover:bg-accent/10 hover:border-accent",
      ghost: "text-gray-400 hover:text-accent hover:bg-surface",
    };
    
    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-2.5 text-sm",
      lg: "px-8 py-3.5 text-base",
    };

    const classNameComputed = cn(baseStyles, variants[variant], sizes[size], className);

    if (href) {
      return (
        <a href={href} className={classNameComputed} target={props.target} rel={props.rel} {...(props as any)}>
          {children}
        </a>
      );
    }

    return (
      <button ref={ref} className={classNameComputed} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
