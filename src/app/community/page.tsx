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
        <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6">
              Community
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              DSO is open source. Built in the open. Decisions made transparently. Contributions welcome.
            </p>
          </div>
        </section>

        {/* Project Activity - Real metrics */}
        <ProjectActivity />

        {/* GitHub & Project */}
        <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Open Source
              </h2>
              <p className="text-lg text-gray-400">
                Apache 2.0 licensed. CNCF Sandbox project. Fully auditable code.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Code className="w-6 h-6" />,
                  label: "GitHub Repository",
                  value: "docker-secret-operator/dso",
                  description: "Source code, issues, and pull requests",
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
                  label: "CNCF Status",
                  value: "Sandbox Project",
                  description: "Graduated to CNCF Sandbox",
                  link: "https://www.cncf.io/projects/",
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  label: "Contributors",
                  value: "20+",
                  description: "From the community and core team",
                  link: "https://github.com/docker-secret-operator/dso/graphs/contributors",
                },
                {
                  icon: <GitBranch className="w-6 h-6" />,
                  label: "Releases",
                  value: "15+ Stable",
                  description: "Continuous updates and improvements",
                  link: "https://github.com/docker-secret-operator/dso/releases",
                },
                {
                  icon: <MessageSquare className="w-6 h-6" />,
                  label: "Discussions",
                  value: "GitHub Discussions",
                  description: "Questions, ideas, and announcements",
                  link: "https://github.com/docker-secret-operator/dso/discussions",
                },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-6 rounded-lg border border-gray-800 bg-gray-900/30 hover:border-accent/50 hover:bg-gray-900/50 transition-all duration-300 group cursor-pointer"
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
                  <p className="text-xs text-gray-400">{item.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Release Timeline */}
        <ReleaseTimeline />

        {/* Roadmap */}
        <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Roadmap
              </h2>
              <p className="text-lg text-gray-400">
                Planned features and upcoming work. Check GitHub Discussions for detailed proposals.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  status: "In Progress",
                  items: [
                    "Kubernetes operator support",
                    "Advanced health check configuration",
                    "Multi-secret atomic transactions",
                  ],
                  color: "accent",
                },
                {
                  status: "Planned",
                  items: [
                    "Web-based management dashboard",
                    "Audit log streaming to external systems",
                    "Secret versioning and rollback UI",
                  ],
                  color: "gray",
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
                        className="text-gray-400 flex items-start gap-3"
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
              <p className="text-gray-400 mb-4">
                Have a feature request or idea? Discuss it with the community.
              </p>
              <a
                href="https://github.com/docker-secret-operator/dso/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-colors"
              >
                Start a Discussion →
              </a>
            </div>
          </div>
        </section>

        {/* Maintainer Philosophy */}
        <MaintainerPhilosophy />

        {/* Ecosystem Connections */}
        <EcosystemConnections />

        {/* Contributing */}
        <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Contributing
              </h2>
              <p className="text-lg text-gray-400">
                All contributions welcome. Code, documentation, bug reports, and ideas.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 rounded-lg border border-gray-800 bg-gray-900/30">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Get Started
                </h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex gap-3">
                    <span className="text-accent flex-shrink-0">1.</span>
                    <span>Fork the repository on GitHub</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent flex-shrink-0">2.</span>
                    <span>Clone your fork and create a feature branch</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent flex-shrink-0">3.</span>
                    <span>Make your changes and write tests</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent flex-shrink-0">4.</span>
                    <span>Submit a pull request with clear description</span>
                  </li>
                </ul>
              </div>

              <div className="p-8 rounded-lg border border-gray-800 bg-gray-900/30">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Ways to Contribute
                </h3>
                <ul className="space-y-3 text-gray-400">
                  <li>• Code improvements and bug fixes</li>
                  <li>• Documentation and examples</li>
                  <li>• Testing on different platforms</li>
                  <li>• Feature proposals and discussions</li>
                  <li>• Performance improvements</li>
                  <li>• Security audits and feedback</li>
                </ul>
              </div>
            </div>

            <div className="p-6 rounded-lg border border-accent/20 bg-accent/5 text-center">
              <p className="text-gray-400 mb-4">
                Check CONTRIBUTING.md in the repository for detailed guidelines.
              </p>
              <a
                href="https://github.com/docker-secret-operator/dso/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-colors"
              >
                View Contributing Guide →
              </a>
            </div>
          </div>
        </section>

        {/* Open Source Values */}
        <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Our Values
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Transparency",
                  description:
                    "Decisions are made in the open. Roadmap is public. Discussions welcome.",
                },
                {
                  title: "Simplicity",
                  description:
                    "Simple to understand, simple to operate. Not feature-heavy by default.",
                },
                {
                  title: "Reliability",
                  description:
                    "Production-ready from day one. Tested thoroughly. Documented clearly.",
                },
                {
                  title: "Security First",
                  description:
                    "Security is not an afterthought. Code review focused on correctness.",
                },
              ].map((value, idx) => (
                <div key={idx} className="p-6 rounded-lg border border-gray-800">
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
