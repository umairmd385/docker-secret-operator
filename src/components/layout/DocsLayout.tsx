"use client";

import React, { useState } from "react";
import { DocsSidebar } from "./DocsSidebar";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Menu, X } from "lucide-react";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export const DocsLayout: React.FC<DocsLayoutProps> = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex-1 pt-20">
        {/* Mobile nav toggle bar */}
        <div className="lg:hidden sticky top-20 z-30 bg-background/90 backdrop-blur-sm border-b border-border px-4 py-2.5">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            aria-label="Open documentation navigation"
          >
            <Menu className="w-4 h-4" />
            <span>Navigation</span>
          </button>
        </div>

        {/* Mobile sidebar drawer */}
        {mobileSidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
              aria-hidden="true"
            />
            <div className="fixed top-0 left-0 h-full w-72 max-w-[85vw] z-50 bg-background border-r border-border overflow-y-auto lg:hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-sm font-semibold text-foreground">Documentation</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-white transition-colors"
                  aria-label="Close navigation"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                <DocsSidebar onNavigate={() => setMobileSidebarOpen(false)} />
              </div>
            </div>
          </>
        )}

        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8 px-4 sm:px-6 py-8">
            {/* Desktop sidebar */}
            <aside className="w-64 flex-shrink-0 hidden lg:block">
              <DocsSidebar />
            </aside>

            {/* Main content */}
            <main className="flex-1 min-w-0 max-w-4xl">
              <article className="prose prose-invert max-w-none">
                {children}
              </article>
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
