/**
 * Comparison Page Template Component
 *
 * Renders feature comparison pages with semantic HTML,
 * structured data support, and internal linking.
 */

import React from "react";
import { RelatedContent } from "./RelatedContent";
import type { ComparisonContent } from "@/lib/comparisons";

interface ComparisonPageProps {
  comparison: ComparisonContent;
  related: Array<{ label: string; href: string; description?: string }>;
}

export const ComparisonPage = ({
  comparison,
  related,
}: ComparisonPageProps) => {
  return (
    <article className="prose prose-invert max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          {comparison.title}
        </h1>
        <p className="text-lg text-gray-300">
          {comparison.description}
        </p>
      </header>

      {/* Verdict */}
      <section className="bg-accent/10 border border-accent/30 rounded-lg p-6 mb-12">
        <h2 className="text-2xl font-bold mb-4">Quick Verdict</h2>
        <p className="text-lg leading-relaxed">
          {comparison.verdict}
        </p>
      </section>

      {/* Feature Comparison Table */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Feature Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-accent/50">
                <th className="text-left px-4 py-3 font-bold">Feature</th>
                <th className="text-left px-4 py-3 font-bold">Docker Secret Operator</th>
                <th className="text-left px-4 py-3 font-bold">{comparison.competitor.name}</th>
                <th className="text-center px-4 py-3 font-bold">Winner</th>
              </tr>
            </thead>
            <tbody>
              {comparison.features.map((feature, idx) => (
                <tr
                  key={idx}
                  className="border-b border-white/10 hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-4 font-semibold">{feature.feature}</td>
                  <td className="px-4 py-4 text-gray-300">
                    <span className="block">{feature.dso}</span>
                    {feature.explanation && (
                      <span className="text-xs text-gray-500 mt-1">
                        {feature.explanation}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-gray-300">
                    {feature.competitor}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        feature.winner === "dso"
                          ? "bg-accent/20 text-accent"
                          : feature.winner === "competitor"
                            ? "bg-blue-500/20 text-blue-300"
                            : "bg-gray-500/20 text-gray-300"
                      }`}
                    >
                      {feature.winner === "dso"
                        ? "DSO"
                        : feature.winner === "competitor"
                          ? "Other"
                          : "Tie"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* When to Use Each */}
      <section className="grid md:grid-cols-2 gap-8 mb-16">
        <div>
          <h3 className="text-2xl font-bold mb-4">Best For DSO</h3>
          <p className="text-gray-300 mb-4">{comparison.bestFor.dso}</p>
          <div className="space-y-3">
            <h4 className="font-bold text-accent">Key Advantages:</h4>
            <ul className="space-y-2">
              {comparison.dsoAdvantages.map((adv, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-accent flex-shrink-0">✓</span>
                  <span className="text-gray-300">{adv}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">
            Best For {comparison.competitor.name}
          </h3>
          <p className="text-gray-300 mb-4">{comparison.bestFor.competitor}</p>
          <div className="space-y-3">
            <h4 className="font-bold text-blue-300">Key Advantages:</h4>
            <ul className="space-y-2">
              {comparison.competitorAdvantages.map((adv, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-blue-300 flex-shrink-0">✓</span>
                  <span className="text-gray-300">{adv}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Migration Path */}
      <section className="bg-white/5 border border-white/10 rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-bold mb-4">Migration Path</h2>
        <div className="text-gray-300 whitespace-pre-wrap">
          {comparison.migrationPath}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {comparison.faqItems.map((item, idx) => (
            <details
              key={idx}
              className="group border border-white/10 rounded-lg p-6 hover:border-accent/30 transition-colors"
            >
              <summary className="font-bold text-lg cursor-pointer group-open:text-accent">
                {item.question}
              </summary>
              <p className="text-gray-300 mt-4">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Related Comparisons */}
      {related && related.length > 0 && (
        <RelatedContent title="Other Comparisons" items={related} />
      )}

      {/* CTA */}
      <section className="mt-16 pt-12 border-t border-white/10 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Try Docker Secret Operator with zero-persistence secret injection.
          Perfect for Docker and Kubernetes teams.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/docs"
            className="inline-block px-8 py-3 bg-accent text-background font-bold rounded-lg hover:bg-accent/90 transition-colors"
          >
            View Documentation
          </a>
          <a
            href="https://github.com/docker-secret-operator/dso"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 border border-accent text-accent font-bold rounded-lg hover:bg-accent/10 transition-colors"
          >
            GitHub Repository
          </a>
        </div>
      </section>
    </article>
  );
};
