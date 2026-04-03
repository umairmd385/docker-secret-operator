'use client';

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Menu, X, Github, Cloud } from "lucide-react";

const navLinks = [
  { name: "How it works", href: "#how-it-works" },
  { name: "Architecture", href: "#architecture" },
  { name: "Features", href: "#features" },
  { name: "Security", href: "#security" },
  { name: "Docs", href: "/docs/", external: true },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border-primary transition-all duration-300 py-4">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Logo />

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6 text-sm text-text-secondary">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                className="hover:text-text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="h-4 w-px bg-border-primary mx-1" />

          {/* Auth & Theme */}
          <div className="flex items-center gap-3">
             <ThemeToggle />
             
             {/* Login Placeholder */}
             <Button variant="ghost" size="sm" className="font-semibold">
                Log in
             </Button>
             
             {/* Signup Placeholder */}
             <Button size="sm" className="hidden lg:flex">
                Sign up free
             </Button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-bg-primary border-b border-border-primary p-6 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-text-secondary hover:text-text-primary font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-border-primary my-2" />
            <div className="grid grid-cols-2 gap-3">
               <Button variant="secondary" size="sm">Log in</Button>
               <Button size="sm">Sign up</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
