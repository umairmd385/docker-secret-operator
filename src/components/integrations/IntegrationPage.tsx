/**
 * Integration Page Template Component
 *
 * Renders comprehensive integration guides with setup instructions,
 * code examples, troubleshooting, and FAQ sections.
 */

import React from "react";
import { RelatedContent } from "@/components/RelatedContent";

export interface IntegrationPageData {
  slug: string;
  title: string;
  description: string;
  provider: {
    name: string;
    logo?: string;
    url: string;
  };
  problemOverview: string;
  architecture: {
    overview: string;
    steps: Array<{
      title: string;
      description: string;
    }>;
  };
  setupGuide: {
    prerequisites: string[];
    steps: Array<{
      number: number;
      title: string;
      description: string;
      code: string;
    }>;
  };
  securityBenefits: string[];
  troubleshooting: Array<{
    problem: string;
    solution: string;
  }>;
  faqItems: Array<{
    question: string;
    answer: string;
  }>;
  relatedPages: Array<{
    label: string;
    href: string;
  }>;
}

interface IntegrationPageProps {
  integration: IntegrationPageData;
}

export const IntegrationPage = ({ integration }: IntegrationPageProps) => {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          {integration.provider.logo && (
            <img
              src={integration.provider.logo}
              alt={integration.provider.name}
              className="w-12 h-12"
            />
          )}
          <div>
            <p className="text-sm text-accent font-mono uppercase tracking-wide">
              Integration Guide
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold mt-2">
              {integration.title}
            </h1>
          </div>
        </div>
        <p className="text-lg text-gray-300 mt-6">
          {integration.description}
        </p>
      </header>

      {/* Problem Overview */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Why This Integration?</h2>
        <div className="bg-white/5 border border-white/10 rounded-lg p-8 whitespace-pre-wrap text-gray-300 leading-relaxed">
          {integration.problemOverview}
        </div>
      </section>

      {/* Architecture */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Architecture</h2>
        <div className="bg-accent/5 border border-accent/30 rounded-lg p-8 mb-8">
          <h3 className="text-xl font-bold mb-4">Overview</h3>
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {integration.architecture.overview}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {integration.architecture.steps.map((step, idx) => (
            <div
              key={idx}
              className="border border-white/10 rounded-lg p-6 hover:border-accent/50 transition-colors"
            >
              <h3 className="font-bold text-lg mb-2 text-accent">
                {step.title}
              </h3>
              <p className="text-gray-300">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Setup Guide */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Setup Guide</h2>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Prerequisites</h3>
          <ul className="space-y-2">
            {integration.setupGuide.prerequisites.map((prereq, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-accent flex-shrink-0">✓</span>
                <span className="text-gray-300">{prereq}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-12">
          {integration.setupGuide.steps.map((step) => (
            <div key={step.number} className="border-l-2 border-accent pl-6">
              <div className="flex items-baseline gap-4 mb-3">
                <span className="text-2xl font-bold text-accent">
                  {step.number}
                </span>
                <h3 className="text-2xl font-bold">{step.title}</h3>
              </div>
              <p className="text-gray-300 mb-4">{step.description}</p>
              <div className="bg-black/50 border border-white/10 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap break-words">
                  {step.code}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security Benefits */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Security Benefits</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {integration.securityBenefits.map((benefit, idx) => (
            <div
              key={idx}
              className="flex gap-3 p-4 border border-accent/20 rounded-lg bg-accent/5"
            >
              <span className="text-accent flex-shrink-0 font-bold">✓</span>
              <span className="text-gray-300">{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Common Problems & Solutions</h2>
        <div className="space-y-6">
          {integration.troubleshooting.map((item, idx) => (
            <details
              key={idx}
              className="group border border-white/10 rounded-lg p-6 hover:border-accent/30 transition-colors"
            >
              <summary className="font-bold text-lg cursor-pointer text-red-400 group-open:text-accent">
                {item.problem}
              </summary>
              <div className="mt-4 text-gray-300">
                <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap break-words">
                  {item.solution}
                </pre>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {integration.faqItems.map((item, idx) => (
            <details
              key={idx}
              className="group border border-white/10 rounded-lg p-6 hover:border-accent/30 transition-colors"
            >
              <summary className="font-bold text-lg cursor-pointer group-open:text-accent">
                {item.question}
              </summary>
              <p className="text-gray-300 mt-4 leading-relaxed">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Related */}
      {integration.relatedPages.length > 0 && (
        <RelatedContent
          title="Related Pages"
          items={integration.relatedPages}
        />
      )}

      {/* CTA */}
      <section className="mt-16 pt-12 border-t border-white/10 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Deploy?</h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Follow the setup guide above to integrate {integration.provider.name} with Docker Secret Operator.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/docs/cli/up"
            className="inline-block px-8 py-3 bg-accent text-background font-bold rounded-lg hover:bg-accent/90 transition-colors"
          >
            DSO Documentation
          </a>
          <a
            href={integration.provider.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 border border-accent text-accent font-bold rounded-lg hover:bg-accent/10 transition-colors"
          >
            {integration.provider.name} Docs
          </a>
        </div>
      </section>
    </article>
  );
};
