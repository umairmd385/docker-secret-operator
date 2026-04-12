"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";

export interface CodeSnippetProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  language?: "bash" | "yaml" | "powershell";
  fileName?: string;
  hideCopy?: boolean;
}

export const CodeSnippet = React.forwardRef<HTMLDivElement, CodeSnippetProps>(
  ({ className, code, language = "bash", fileName, hideCopy = false, ...props }, ref) => {
    const [copied, setCopied] = useState(false);

    const onCopy = () => {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-xl border border-border bg-[#0B0F19] overflow-hidden group",
          className
        )}
        {...props}
      >
        {fileName && (
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface">
            <span className="text-xs font-mono text-gray-400">{fileName}</span>
          </div>
        )}
        
        <div className="relative">
          <pre className="p-4 overflow-x-auto text-sm font-mono text-gray-300 leading-relaxed">
            <code>{code}</code>
          </pre>

          {!hideCopy && (
            <button
              onClick={onCopy}
              className={cn(
                "absolute top-3 right-3 p-1.5 rounded-md border border-border bg-surface text-gray-400 hover:text-white transition-all opacity-0 group-hover:opacity-100",
                copied && "text-accent border-accent/50 opacity-100"
              )}
              aria-label="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    );
  }
);

CodeSnippet.displayName = "CodeSnippet";
