import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5 text-text-primary font-bold text-lg group", className)}
    >
      <div className="relative">
        <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center relative overflow-hidden group-hover:border-accent/50 transition-all duration-300">
           <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
             <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
           </svg>
        </div>
        <div className="absolute inset-0 bg-accent/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      <span className="hidden sm:inline">Docker Secret Operator</span>
      <span className="sm:hidden">DSO</span>
    </Link>
  );
}
