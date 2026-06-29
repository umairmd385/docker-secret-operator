"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, GitBranch } from "lucide-react";
import { Logo } from "@/components/Logo";
import { motion, AnimatePresence } from "framer-motion";
import { ROUTES } from "@/lib/links";

const NAV_LINKS = [
  { label: "Product", href: ROUTES.landingPages.product },
  { label: "Architecture", href: ROUTES.landingPages.architecture },
  { label: "Deploy", href: ROUTES.landingPages.deploy },
  { label: "Community", href: ROUTES.landingPages.community },
  { label: "Docs", href: ROUTES.docs.root },
];

const useActivePath = () => {
  const [path, setPath] = useState("");
  useEffect(() => {
    setPath(window.location.pathname);
  }, []);
  return path;
};

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activePath = useActivePath();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? activePath === "/" : activePath.startsWith(href);

  return (
    <nav
      aria-label="Main navigation"
      className="fixed top-0 w-full z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(5,7,10,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : undefined,
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : undefined,
        padding: scrolled ? "12px 0" : "20px 0",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href={ROUTES.home}
          className="flex items-center gap-2.5 group flex-shrink-0"
          aria-label="DSO home"
        >
          <div className="relative">
            <div className="w-8 h-8 flex items-center justify-center relative z-10 transition-transform group-hover:scale-110">
              <Logo size={32} className="text-accent" />
            </div>
            <div className="absolute inset-0 bg-accent/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span
            className="text-base sm:text-lg font-bold tracking-tight hidden sm:block"
            style={{ color: "#F8FAFC" }}
          >
            Docker Secret Operator
          </span>
          <span
            className="text-base font-bold tracking-tight sm:hidden"
            style={{ color: "#F8FAFC" }}
          >
            DSO
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-1">
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActive(href);
              return (
                <a
                  key={href}
                  href={href}
                  className="relative px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-150"
                  style={{
                    color: active ? "#00E6C0" : "#94A3B8",
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.color = "#F8FAFC";
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.color = "#94A3B8";
                  }}
                >
                  {label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-px rounded-full"
                      style={{ background: "#00E6C0", opacity: 0.7 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          <a
            href={ROUTES.external.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200"
            style={{
              borderColor: "rgba(255,255,255,0.12)",
              color: "#94A3B8",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(0,230,192,0.35)";
              el.style.color = "#00E6C0";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(255,255,255,0.12)";
              el.style.color = "#94A3B8";
            }}
            aria-label="View DSO on GitHub"
          >
            <GitBranch className="w-4 h-4" aria-hidden="true" />
            GitHub
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: "#94A3B8" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden absolute top-full left-0 w-full overflow-hidden"
            style={{
              background: "rgba(5,7,10,0.96)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href }) => {
                const active = isActive(href);
                return (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium px-4 py-3 rounded-lg transition-colors"
                    style={{
                      color: active ? "#00E6C0" : "#94A3B8",
                      background: active ? "rgba(0,230,192,0.06)" : "transparent",
                    }}
                  >
                    {label}
                  </a>
                );
              })}
              <div className="pt-3 mt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <a
                  href={ROUTES.external.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg text-sm font-semibold border transition-colors"
                  style={{ borderColor: "rgba(255,255,255,0.12)", color: "#94A3B8" }}
                >
                  <GitBranch className="w-4 h-4" />
                  GitHub
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
