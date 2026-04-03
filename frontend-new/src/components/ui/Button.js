import * as React from "react";
import { cn } from "@/lib/utils";

const Button = React.forwardRef(({ className, variant = "primary", size = "md", ...props }, ref) => {
  const variants = {
    primary: "bg-accent text-bg-primary shadow-[0_0_24px_rgba(0,201,167,0.35)] hover:shadow-[0_0_40px_rgba(0,201,167,0.5)] hover:scale-[1.03] active:scale-[0.98]",
    secondary: "border border-border-primary text-text-primary bg-transparent hover:bg-surface-hover hover:border-text-secondary hover:scale-[1.02] active:scale-[0.98]",
    ghost: "text-text-secondary hover:text-text-primary transition-colors",
    outline: "border border-accent/20 text-accent bg-accent/5 hover:bg-accent/10 transition-all",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-7 py-3.5 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };
