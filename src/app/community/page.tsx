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
    <main className="flex-1 flex flex-col relative bg-background overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-gradient-to-b from-accent/10 via-background to-transparent opacity-30" />
      </div>

      <div className="relative z-10 flex flex-col w-full space-y-0">
        <Navbar />

        {/* Hero */}
        <section className="relative py-20 sm:py-32 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6">
              Community
            </h1>
            <p className="text-xl text-secondary max-w-2xl mx-auto">
              Small team. Public development. Transparent decisions. We ship frequently and listen to feedback.
            </p>
          </div>
        </section>

        {/* Project Activity - Real metrics */}
        <ProjectActivity />

        {/* GitHub & Project */}
        <section className="relative py-20 sm:py-32 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Open Source
              </h2>
              <p className="text-lg text-secondary">
                Apache 2.0 licensed. Fully auditable source code. Open source from day one.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Code className="w-6 h-6" />,
                  label: "GitHub",
                  value: "Source Code",
                  description: "Public repository with full history",
                  link: "https://github.com/docker-secret-operator/dso",
                },
                {
                  icon: <Package className="w-6 h-6" />,
                  label: "License",
                  value: "Apache 2.0",
                  description: "Free for commercial use",
                  link: "https://github.com/docker-secret-operator/dso/blob/main/LICENSE",
                },
                {
                  icon: <Heart className="w-6 h-6" />,
                  label: "Community",
                  value: "Open Source",
                  description: "Community-driven development",
                  link: "https://github.com/docker-secret-operator/dso",
                },
                {
                  icon: <MessageSquare className="w-6 h-6" />,
                  label: "Discussions",
                  value: "GitHub",
                  description: "Ideas, questions, and feedback",
                  link: "https://github.com/docker-secret-operator/dso/discussions",
                },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-6 rounded-lg border border-border bg-surface/30 hover:border-accent/30 hover:bg-surface/50 transition-all duration-300 group cursor-pointer"
                >
                  <div className="text-accent mb-3 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">
                    {item.label}
                  </h3>
                  <p className="text-lg font-bold text-accent mb-2">
                    {item.value}
                  </p>
                  <p className="text-xs text-secondary">{item.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Release Timeline */}
        <ReleaseTimeline />

        {/* Roadmap */}
        <section className="relative py-20 sm:py-32 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                What's Next
              </h2>
              <p className="text-lg text-secondary">
                Focused work on Docker secret rotation. Check GitHub Discussions for proposals and feedback.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  status: "Current Focus",
                  items: [
                    "Provider reliability and stability improvements",
                    "Performance optimizations for rapid rotation",
                    "Enhanced observability and monitoring",
                  ],
                },
                {
                  status: "Under Consideration",
                  items: [
                    "Additional secret providers (feedback welcomed)",
                    "Expanded health check options",
                    "Improved logging and debugging",
                  ],
                },
              ].map((section, idx) => (
                <div key={idx} className="border-l-4 border-accent/30 pl-6 py-4">
                  <h3 className="font-bold text-foreground text-lg mb-3">
                    {section.status}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="text-secondary flex items-start gap-3"
                      >
                        <span className="text-accent mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-lg border border-accent/20 bg-accent/5 text-center">
              <p className="text-secondary mb-4">
                Have a feature request? Open an issue or start a discussion on GitHub.
              </p>
              <a
                href="https://github.com/docker-secret-operator/dso/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-colors"
              >
                Discussions →
              </a>
            </div>
          </div>
        </section>

        {/* Maintainer Philosophy */}
        <MaintainerPhilosophy />

        {/* Ecosystem Connections */}
        <EcosystemConnections />

        {/* How to Get Involved */}
        <section className="relative py-20 sm:py-32 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Get Involved
              </h2>
              <p className="text-lg text-secondary">
                Code, documentation, bug reports, discussions. All contributions welcome.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 rounded-lg border border-border bg-surface/30">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Contribute Code
                </h3>
                <ol className="space-y-3 text-secondary">
                  <li className="flex gap-3">
                    <span className="text-accent flex-shrink-0 font-bold">1.</span>
                    <span>Fork on GitHub</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent flex-shrink-0 font-bold">2.</span>
                    <span>Create a feature branch</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent flex-shrink-0 font-bold">3.</span>
                    <span>Make changes + write tests</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent flex-shrink-0 font-bold">4.</span>
                    <span>Submit pull request</span>
                  </li>
                </ol>
                <div className="pt-6 border-t border-border/50 mt-6">
                  <p className="text-sm text-tertiary">PRs reviewed promptly. Questions answered.</p>
                </div>
              </div>

              <div className="p-8 rounded-lg border border-border bg-surface/30">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Other Ways to Help
                </h3>
                <ul className="space-y-3 text-secondary">
                  <li>• Report bugs on GitHub Issues</li>
                  <li>• Improve documentation and examples</li>
                  <li>• Test on different platforms</li>
                  <li>• Propose features in Discussions</li>
                  <li>• Security audits and feedback</li>
                  <li>• Performance improvements</li>
                </ul>
              </div>
            </div>

            <div className="p-6 rounded-lg border border-accent/20 bg-accent/5 text-center">
              <p className="text-secondary mb-4">
                See CONTRIBUTING.md for detailed guidelines and development setup.
              </p>
              <a
                href="https://github.com/docker-secret-operator/dso/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-colors"
              >
                Read Contributing Guide →
              </a>
            </div>
          </div>
        </section>

        {/* What We Value */}
        <section className="relative py-20 sm:py-32 bg-background border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                How We Work
              </h2>
              <p className="text-lg text-secondary">
                Principles guiding our development and maintenance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Focused Scope",
                  description:
                    "DSO solves zero-persistence secret injection for Docker. We stay focused on that mission, not trying to be everything.",
                },
                {
                  title: "Code Quality",
                  description:
                    "Small team means every line matters. We prioritize readability, testability, and security.",
                },
                {
                  title: "Fast Iteration",
                  description:
                    "29 releases in 2 months shows our responsiveness. We ship frequently and improve based on feedback.",
                },
                {
                  title: "Transparent Development",
                  description:
                    "Roadmap is public. Decisions made in Issues and Discussions. You can see exactly what we're building.",
                },
              ].map((value, idx) => (
                <div key={idx} className="p-6 rounded-lg border border-border bg-surface/30">
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-secondary text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-20 sm:py-32 bg-background border-b border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
                What's Next?
              </h2>
              <p className="text-lg text-secondary max-w-2xl mx-auto">
                Explore the codebase, open an issue, start a discussion, or read the roadmap.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                {
                  label: "GitHub",
                  href: "https://github.com/docker-secret-operator/dso",
                },
                {
                  label: "Issues",
                  href: "https://github.com/docker-secret-operator/dso/issues",
                },
                {
                  label: "Discussions",
                  href: "https://github.com/docker-secret-operator/dso/discussions",
                },
                {
                  label: "Roadmap",
                  href: "https://github.com/docker-secret-operator/dso/projects",
                },
              ].map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-lg border border-accent/30 bg-accent/5 hover:bg-accent/10 transition-all duration-300 font-semibold text-accent hover:text-accent/80"
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
