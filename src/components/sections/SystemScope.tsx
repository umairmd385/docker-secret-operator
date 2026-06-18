import { H3 } from "@/components/ui/Typography";

export function SystemScope() {
  return (
    <section className="relative py-20 sm:py-32 bg-surface/30 border-t border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-12">
            System Scope
          </h2>

          <div className="grid sm:grid-cols-2 gap-12">
            {/* DSO Manages */}
            <div className="space-y-4">
              <h3 className="font-semibold text-accent text-sm uppercase tracking-wide">
                DSO Manages
              </h3>
              <ul className="space-y-2">
                <li className="flex gap-3 items-start">
                  <span className="text-accent mt-1">✓</span>
                  <span className="text-secondary">Secret rotation from provider</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-accent mt-1">✓</span>
                  <span className="text-secondary">Container lifecycle during rotation</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-accent mt-1">✓</span>
                  <span className="text-secondary">Atomic swap and rollback on failure</span>
                </li>
              </ul>
            </div>

            {/* DSO Does Not Manage */}
            <div className="space-y-4">
              <h3 className="font-semibold text-secondary text-sm uppercase tracking-wide">
                DSO Does Not Manage
              </h3>
              <ul className="space-y-2">
                <li className="flex gap-3 items-start">
                  <span className="text-tertiary mt-1">✗</span>
                  <span className="text-secondary">Kubernetes or container orchestration</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-tertiary mt-1">✗</span>
                  <span className="text-secondary">RBAC or identity management</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-tertiary mt-1">✗</span>
                  <span className="text-secondary">Multi-cluster or high-availability</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
