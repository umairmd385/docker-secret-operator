"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { docsStructure } from "@/content/docs-auto";
import {
  BookOpen,
  Zap,
  Terminal,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

const CategoryCard = ({
  category,
  pages,
  delay,
}: {
  category: string;
  pages: any[];
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="p-6 rounded-xl border border-gray-700 bg-gray-900/30 hover:bg-gray-900/50 transition-all hover:border-accent/50"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">{category}</h3>
      <ul className="space-y-3">
        {pages.map((page) => (
          <li key={page.href}>
            <a
              href={page.href}
              className="flex items-start justify-between group text-sm"
            >
              <div>
                <p className="text-foreground font-medium group-hover:text-accent transition-colors">
                  {page.title}
                </p>
                <p className="text-xs text-gray-400 mt-1">{page.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-accent mt-1 flex-shrink-0 ml-2 transition-colors" />
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

const QuickLinkCard = ({
  title,
  description,
  href,
  icon: Icon,
  delay,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  delay: number;
}) => {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="group relative overflow-hidden p-8 rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900/50 to-gray-900/20 hover:border-accent/50 hover:from-gray-900/80 hover:to-gray-900/40 transition-all hover:shadow-lg hover:shadow-accent/10"
    >
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
            <Icon className="w-6 h-6 text-accent" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 text-sm mb-4">{description}</p>
        <div className="flex items-center gap-2 text-accent text-sm font-medium">
          Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.a>
  );
};

export const DocsPageContent = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4">
                Documentation
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 max-w-2xl">
                Learn how to manage secrets with zero persistence. Complete
                guides, CLI reference, and provider integrations.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <a href="#getting-started">
                <Button className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-colors">
                  Get Started
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </a>
              <a href="/docs/guide/what-is-dso">
                <Button className="inline-flex items-center gap-2 px-6 py-3 border border-gray-700 text-foreground font-semibold rounded-lg hover:bg-gray-900/50 transition-colors">
                  Learn DSO
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="relative py-20 sm:py-32 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Quick Links
            </h2>
            <p className="text-gray-400 text-lg">
              Jump straight to what you need
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <QuickLinkCard
              title="New to DSO?"
              description="Learn the core concepts and why zero-persistence secret management matters"
              href="/docs/guide/what-is-dso"
              icon={BookOpen}
              delay={0}
            />
            <QuickLinkCard
              title="Quick Start"
              description="Get DSO installed and running in minutes with step-by-step instructions"
              href="/docs/guide/quick-start"
              icon={Zap}
              delay={0.1}
            />
            <QuickLinkCard
              title="CLI Reference"
              description="Complete command reference for all DSO CLI commands"
              href="/docs/cli"
              icon={Terminal}
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Documentation Categories Section */}
      <section id="getting-started" className="relative py-20 sm:py-32 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Full Documentation
            </h2>
            <p className="text-gray-400 text-lg">
              Comprehensive guides organized by topic
            </p>
          </motion.div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {Object.entries(docsStructure).map(([key, category], idx) => (
              <CategoryCard
                key={key}
                category={category.title}
                pages={category.pages}
                delay={idx * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 sm:py-32 border-t border-gray-800 bg-gradient-to-b from-background to-gray-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Need Help?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Check the troubleshooting
              guide or open an issue on GitHub.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/docs/guide/troubleshooting">
                <Button className="inline-flex items-center gap-2 px-6 py-3 border border-gray-700 text-foreground font-semibold rounded-lg hover:bg-gray-900/50 transition-colors">
                  Troubleshooting
                </Button>
              </a>
              <a href="https://github.com/docker-secret-operator/dso/issues">
                <Button className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-colors">
                  Open an Issue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
