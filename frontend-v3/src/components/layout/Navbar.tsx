"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
);

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="w-8 h-8 flex items-center justify-center relative z-10 transition-transform hover:scale-110">
              <Logo className="w-8 h-8" />
            </div>
            <div className="absolute inset-0 bg-accent/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-lg font-bold font-sans text-foreground hidden sm:block tracking-tight">
            Docker Secret Operator
          </span>
          <span className="text-lg font-bold font-sans text-foreground sm:hidden tracking-tight">
            DSO
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="/docs" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Docs</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" href="https://github.com/docker-secret-operator/dso" target="_blank" aria-label="View DSO on GitHub">
              <GithubIcon className="w-4 h-4 mr-2" aria-hidden="true" />
              GitHub
            </Button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-gray-300 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-surface border-b border-border p-6 shadow-xl flex flex-col gap-4">
          <a href="#features" className="text-sm font-medium text-gray-300 hover:text-white p-2">Features</a>
          <a href="#architecture" className="text-sm font-medium text-gray-300 hover:text-white p-2">Architecture</a>
          <a href="/docs" className="text-sm font-medium text-gray-300 hover:text-white p-2">Docs</a>
          <Button variant="outline" className="mt-2" href="https://github.com/docker-secret-operator/dso">
            <GithubIcon className="w-4 h-4 mr-2" /> GitHub
          </Button>
        </div>
      )}
    </nav>
  );
};
