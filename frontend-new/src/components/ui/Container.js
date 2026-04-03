import { cn } from "@/lib/utils";

export function Container({ className, ...props }) {
  return (
    <div
      className={cn("max-w-7xl mx-auto px-6 lg:px-8", className)}
      {...props}
    />
  );
}
