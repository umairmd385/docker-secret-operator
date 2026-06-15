"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";
import { DSOLogoIcon } from "@/components/branding/DSOLogo";
import { GithubIcon } from "@/components/ui/Icons";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { ROUTES } from "@/lib/links";

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <a href={ROUTES.home} className="flex items-center gap-2 group flex-shrink-0">
          <div className="relative">
            <div className="w-8 h-8 flex items-center justify-center relative z-10 transition-transform hover:scale-110">
              <DSOLogoIcon size="sm" />
            </div>
            <div className="absolute inset-0 bg-accent/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-base sm:text-lg font-bold font-sans text-foreground hidden sm:block tracking-tight">
            Docker Secret Operator
          </span>
          <span className="text-base sm:text-lg font-bold font-sans text-foreground sm:hidden tracking-tight">
            DSO
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6 text-sm font-medium text-gray-300">
            <a href={ROUTES.landingPages.product} className="hover:text-white transition-colors">Product</a>
            <a href={ROUTES.landingPages.architecture} className="hover:text-white transition-colors">Architecture</a>
            <a href={ROUTES.landingPages.deploy} className="hover:text-white transition-colors">Deploy</a>
            <a href={ROUTES.landingPages.community} className="hover:text-white transition-colors">Community</a>
            <a href={ROUTES.docs.root} className="hover:text-white transition-colors">Docs</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" size="sm" href={ROUTES.external.github} target="_blank" aria-label="View DSO on GitHub">
              <GithubIcon className="w-4 h-4 mr-2" aria-hidden="true" />
              GitHub
            </Button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden absolute top-full left-0 w-full bg-surface/95 backdrop-blur-lg border-b border-border shadow-xl overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-3">
              <a href={ROUTES.landingPages.product} onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-300 hover:text-white p-3 hover:bg-white/5 rounded-lg transition-colors">Product</a>
              <a href={ROUTES.landingPages.architecture} onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-300 hover:text-white p-3 hover:bg-white/5 rounded-lg transition-colors">Architecture</a>
              <a href={ROUTES.landingPages.deploy} onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-300 hover:text-white p-3 hover:bg-white/5 rounded-lg transition-colors">Deploy</a>
              <a href={ROUTES.landingPages.community} onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-300 hover:text-white p-3 hover:bg-white/5 rounded-lg transition-colors">Community</a>
              <a href={ROUTES.docs.root} onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-300 hover:text-white p-3 hover:bg-white/5 rounded-lg transition-colors">Docs</a>
              <div className="pt-2 px-3 pb-3">
                <Button variant="outline" className="w-full justify-center" href={ROUTES.external.github}>
                  <GithubIcon className="w-4 h-4 mr-2" /> GitHub
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
