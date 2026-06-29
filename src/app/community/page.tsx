import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { PAGE_METADATA } from "@/lib/seo/metadata";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProjectActivity } from "@/components/sections/ProjectActivity";
import { ReleaseTimeline } from "@/components/sections/ReleaseTimeline";
import { MaintainerPhilosophy } from "@/components/sections/MaintainerPhilosophy";
import { EcosystemConnections } from "@/components/sections/EcosystemConnections";
import { Code, MessageSquare, GitBranch, Package, Users, Heart } from "lucide-react";

export const metadata = generatePageMetadata(
  {
    ...PAGE_METADATA["/"],
    title: "Community | Docker Secret Operator",
    description:
      "Join the DSO community. Explore the roadmap, contribute to development, engage in discussions, and track releases.",
  },
  "/community"
);

export default function CommunityPage() {
  return (
    <main className="relative overflow-x-hidden" style={{ background: "#05070A" }}>
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "900px", height: "500px",
          background: "radial-gradient(ellipse at 50% 0%, rgba(0,230,192,0.06) 0%, transparent 65%)",
          filter: "blur(40px)",
        }} />
        <div style={{
          position: "absolute", bottom: 0, right: 0, width: "600px", height: "500px",
          background: "radial-gradient(ellipse at 100% 100%, rgba(109,93,246,0.05) 0%, transparent 60%)",
          filter: "blur(60px)",
        }} />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Hero */}
        <section className="pt-36 pb-20 text-center px-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-mono uppercase tracking-widest mb-5" style={{ color: "#94A3B8" }}>
              Community
            </p>
            <h1 className="font-bold tracking-tighter mb-6" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "#F8FAFC", lineHeight: "1.05" }}>
              Community
            </h1>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: "#94A3B8" }}>
              Small team. Public development. Transparent decisions. We ship frequently and listen to feedback.
            </p>
          </div>
        </section>

        {/* Project Activity - Real metrics */}
        <ProjectActivity />

        {/* Open Source */}
        <section className="py-20 sm:py-28" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "#94A3B8" }}>Open Source</p>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-4" style={{ color: "#F8FAFC" }}>
                Fully open. Fully auditable.
              </h2>
              <p className="text-lg" style={{ color: "#94A3B8" }}>
                Every line of code is public. No closed-source extensions, no proprietary agents.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: <Code className="w-5 h-5" />,
                  label: "GitHub",
                  description: "Public repository with full history",
                  link: "https://github.com/docker-secret-operator/dso",
                },
                {
                  icon: <Package className="w-5 h-5" />,
                  label: "License",
                  description: "Apache 2.0 — free for commercial use",
                  link: "https://github.com/docker-secret-operator/dso/blob/main/LICENSE",
                },
                {
                  icon: <Heart className="w-5 h-5" />,
                  label: "Community",
                  description: "Community-driven development",
                  link: "https://github.com/docker-secret-operator/dso",
                },
                {
                  icon: <MessageSquare className="w-5 h-5" />,
                  label: "Discussions",
                  description: "Ideas, questions, and feedback",
                  link: "https://github.com/docker-secret-operator/dso/discussions",
                },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-6 rounded-2xl transition-all duration-300 block no-underline hover:border-accent/30 hover:bg-accent/5"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="mb-4" style={{ color: "#00E6C0" }}>{item.icon}</div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: "#F8FAFC" }}>{item.label}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>{item.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Release Timeline */}
        <ReleaseTimeline />

        {/* Roadmap */}
        <section className="py-20 sm:py-28" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "#94A3B8" }}>Roadmap</p>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-4" style={{ color: "#F8FAFC" }}>
                What&apos;s next
              </h2>
              <p className="text-lg" style={{ color: "#94A3B8" }}>
                Focused work on Docker secret rotation. Check GitHub Discussions for proposals.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {[
                {
                  status: "Current Focus",
                  items: [
                    "Provider reliability and stability improvements",
                    "Performance optimizations for rapid rotation",
                    "Enhanced observability and monitoring",
                  ],
                  accent: true,
                },
                {
                  status: "Under Consideration",
                  items: [
                    "Additional secret providers (feedback welcomed)",
                    "Expanded health check options",
                    "Improved logging and debugging",
                  ],
                  accent: false,
                },
              ].map((roadmapSection, idx) => (
                <div key={idx} className="p-7 rounded-2xl" style={{
                  background: roadmapSection.accent ? "rgba(0,230,192,0.04)" : "rgba(255,255,255,0.02)",
                  border: roadmapSection.accent ? "1px solid rgba(0,230,192,0.2)" : "1px solid rgba(255,255,255,0.07)",
                }}>
                  <h3 className="font-bold text-base mb-5" style={{ color: roadmapSection.accent ? "#00E6C0" : "#F8FAFC" }}>
                    {roadmapSection.status}
                  </h3>
                  <ul className="space-y-3">
                    {roadmapSection.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-3 text-sm" style={{ color: "#94A3B8" }}>
                        <span style={{ color: "#00E6C0", flexShrink: 0, marginTop: "2px" }}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-2xl text-center" style={{ background: "rgba(0,230,192,0.04)", border: "1px solid rgba(0,230,192,0.15)" }}>
              <p className="text-sm mb-4" style={{ color: "#94A3B8" }}>
                Have a feature request? Open an issue or start a discussion on GitHub.
              </p>
              <a
                href="https://github.com/docker-secret-operator/dso/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:opacity-90"
                style={{ background: "#00E6C0", color: "#05070A" }}
              >
                GitHub Discussions →
              </a>
            </div>
          </div>
        </section>

        {/* Maintainer Philosophy */}
        <MaintainerPhilosophy />

        {/* Ecosystem Connections */}
        <EcosystemConnections />

        {/* Get Involved */}
        <section className="py-20 sm:py-28" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "#94A3B8" }}>Contribute</p>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-4" style={{ color: "#F8FAFC" }}>
                Get involved
              </h2>
              <p className="text-lg" style={{ color: "#94A3B8" }}>
                Code, documentation, bug reports, discussions. All contributions welcome.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="p-8 rounded-2xl" style={{ background: "rgba(0,230,192,0.03)", border: "1px solid rgba(0,230,192,0.12)" }}>
                <h3 className="text-lg font-bold mb-5" style={{ color: "#F8FAFC" }}>
                  Contribute code
                </h3>
                <ol className="space-y-3">
                  {["Fork on GitHub", "Create a feature branch", "Make changes + write tests", "Submit pull request"].map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm" style={{ color: "#94A3B8" }}>
                      <span className="flex-shrink-0 font-bold font-mono" style={{ color: "#00E6C0" }}>{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
                <p className="text-xs mt-6 pt-5" style={{ color: "rgba(148,163,184,0.6)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>PRs reviewed promptly. Questions answered.</p>
              </div>

              <div className="p-8 rounded-2xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <h3 className="text-lg font-bold mb-5" style={{ color: "#F8FAFC" }}>
                  Other ways to help
                </h3>
                <ul className="space-y-3">
                  {["Report bugs on GitHub Issues", "Improve documentation and examples", "Test on different platforms", "Propose features in Discussions", "Security audits and feedback", "Performance improvements"].map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm" style={{ color: "#94A3B8" }}>
                      <span style={{ color: "#00E6C0", flexShrink: 0 }}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-6 rounded-2xl text-center" style={{ background: "rgba(0,230,192,0.04)", border: "1px solid rgba(0,230,192,0.15)" }}>
              <p className="text-sm mb-4" style={{ color: "#94A3B8" }}>
                See CONTRIBUTING.md for detailed guidelines and development setup.
              </p>
              <a
                href="https://github.com/docker-secret-operator/dso/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:opacity-90"
                style={{ background: "#00E6C0", color: "#05070A" }}
              >
                Read Contributing Guide →
              </a>
            </div>
          </div>
        </section>

        {/* How We Work */}
        <section className="py-20 sm:py-28" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "#94A3B8" }}>Values</p>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-4" style={{ color: "#F8FAFC" }}>
                How we work
              </h2>
              <p className="text-lg" style={{ color: "#94A3B8" }}>
                Principles guiding our development and maintenance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: "Focused scope", description: "DSO solves zero-persistence secret injection for Docker. We stay focused on that mission, not trying to be everything." },
                { title: "Code quality", description: "Small team means every line matters. We prioritize readability, testability, and security." },
                { title: "Fast iteration", description: "We ship frequently and improve based on feedback. Responsiveness over perfection." },
                { title: "Transparent development", description: "Roadmap is public. Decisions made in Issues and Discussions. You can see exactly what we're building." },
              ].map((value, idx) => (
                <div key={idx} className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <h3 className="text-base font-bold mb-2" style={{ color: "#F8FAFC" }}>{value.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 sm:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter mb-4" style={{ color: "#F8FAFC" }}>
              What&apos;s next?
            </h2>
            <p className="text-lg mb-10" style={{ color: "#94A3B8" }}>
              Explore the codebase, open an issue, start a discussion, or read the roadmap.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: "GitHub", href: "https://github.com/docker-secret-operator/dso" },
                { label: "Issues", href: "https://github.com/docker-secret-operator/dso/issues" },
                { label: "Discussions", href: "https://github.com/docker-secret-operator/dso/discussions" },
                { label: "Roadmap", href: "https://github.com/docker-secret-operator/dso/projects" },
              ].map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:bg-accent/20"
                  style={{ background: "rgba(0,230,192,0.08)", border: "1px solid rgba(0,230,192,0.25)", color: "#00E6C0" }}
                >
                  {link.label} →
                </a>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>

  );
}
