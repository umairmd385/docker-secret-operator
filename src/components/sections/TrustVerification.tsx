import React from "react";
import { CheckCircle2, FileText, Shield, GitBranch } from "lucide-react";

export function TrustVerification() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
            Verified & Production-Ready
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            All integration guides are verified against official provider documentation.
            Every claim is backed by evidence. Every limitation is clearly stated.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: CheckCircle2,
              title: "Verified Against Docs",
              description:
                "Every integration guide is validated against official provider documentation",
            },
            {
              icon: FileText,
              title: "Evidence-Based Claims",
              description:
                "All statements backed by verified source material and real examples",
            },
            {
              icon: Shield,
              title: "Transparent Limitations",
              description:
                "Explicit documentation of constraints, trade-offs, and caveats",
            },
            {
              icon: GitBranch,
              title: "Working Examples",
              description:
                "Complete, tested examples for every provider with expected output",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-white/10 p-6 hover:border-accent/50 transition-colors"
            >
              <item.icon className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-bold text-lg text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block rounded-lg bg-accent/10 border border-accent/20 px-6 py-4">
            <p className="text-sm text-gray-400">
              Last verified: <span className="font-semibold text-accent">2026-05-10</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Verification framework available in documentation
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
