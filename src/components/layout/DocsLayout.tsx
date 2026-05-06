"use client";

import React from "react";
import { DocsSidebar } from "./DocsSidebar";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export const DocsLayout: React.FC<DocsLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8 px-6 py-8">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 hidden lg:block">
              <DocsSidebar />
            </aside>

            {/* Main Content */}
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
