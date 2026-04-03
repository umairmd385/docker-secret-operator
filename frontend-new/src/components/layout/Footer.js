import { Container } from "@/components/ui/Container";
import { Link } from "next/link";
import { Cloud } from "lucide-react";
import { GithubIcon, XIcon, LinkedinIcon } from "@/components/ui/Icons";

const footerLinks = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "#features" },
      { name: "How it works", href: "#how-it-works" },
      { name: "Architecture", href: "#architecture" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Documentation", href: "/docs/", external: true },
      { name: "Changelog", href: "/changelog/" },
      { name: "Contributing", href: "https://github.com/umairmd385/docker-secret-operator", external: true },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "SkyCloudOps", href: "https://dso.skycloudops.in/", external: true },
      { name: "Contact", href: "mailto:support@skycloudops.in" },
      { name: "GitHub", href: "https://github.com/umairmd385/docker-secret-operator", external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="py-24 bg-bg-secondary border-t border-border-soft">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 lg:gap-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 text-text-primary font-bold text-lg mb-6 tracking-tight">
               <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center">
                  <Cloud className="w-5 h-5 text-accent" />
               </div>
               Docker Secret Operator
            </div>
            <p className="text-text-secondary text-sm max-w-xs leading-relaxed mb-8">
              Native secrets for Docker — without Kubernetes. Deploy production-grade secret management in minutes.
            </p>
            <div className="flex items-center gap-4">
               <a href="https://github.com/umairmd385/docker-secret-operator" className="text-text-muted hover:text-text-primary transition-colors">
                  <GithubIcon className="w-5 h-5" />
               </a>
               <a href="#" className="text-text-muted hover:text-text-primary transition-colors">
                  <XIcon className="w-5 h-5" />
               </a>
               <a href="#" className="text-text-muted hover:text-text-primary transition-colors">
                  <LinkedinIcon className="w-5 h-5" />
               </a>
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h5 className="text-sm font-bold text-text-primary mb-6 uppercase tracking-widest">{section.title}</h5>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      className="text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-20 pt-10 border-t border-border-soft flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="text-xs text-text-muted">
              © {new Date().getFullYear()} SkyCloudOps. All rights reserved.
           </div>
           <div className="flex items-center gap-8 text-xs text-text-muted">
              <a href="#" className="hover:text-text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-text-primary transition-colors">Cookie Policy</a>
           </div>
        </div>
      </Container>
    </footer>
  );
}
