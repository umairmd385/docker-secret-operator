export function ArchitectureDiagram() {
  return (
    <section className="relative py-20 sm:py-32 bg-surface/30 border-t border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            System Architecture
          </h2>
          <p className="text-lg text-secondary">
            How DSO orchestrates secret rotation from provider to container
          </p>
        </div>

        {/* Desktop SVG Diagram */}
        <div className="hidden lg:block overflow-x-auto">
          <svg
            viewBox="0 0 1200 600"
            className="w-full min-w-[1200px]"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background */}
            <defs>
              <linearGradient id="providerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#00e6c0', stopOpacity: 0.1 }} />
                <stop offset="100%" style={{ stopColor: '#00e6c0', stopOpacity: 0.05 }} />
              </linearGradient>
            </defs>

            {/* Provider Box */}
            <rect x="50" y="50" width="160" height="120" fill="url(#providerGrad)" stroke="#00e6c0" strokeWidth="2" rx="8" />
            <text x="130" y="85" textAnchor="middle" fill="#00e6c0" fontSize="14" fontWeight="bold">
              Secret Provider
            </text>
            <text x="130" y="110" textAnchor="middle" fill="#b0b8c0" fontSize="12">
              Vault, AWS, Azure
            </text>
            <text x="130" y="130" textAnchor="middle" fill="#b0b8c0" fontSize="12">
              Huawei, Local
            </text>

            {/* Arrow 1: Provider to Watcher */}
            <path
              d="M 210 110 L 280 110"
              stroke="#00e6c0"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              fill="none"
            />
            <text x="245" y="100" textAnchor="middle" fill="#8b92a0" fontSize="11">
              Pull Secrets
            </text>

            {/* Watcher/Agent Box */}
            <rect x="280" y="50" width="160" height="120" fill="url(#providerGrad)" stroke="#00e6c0" strokeWidth="2" rx="8" />
            <text x="360" y="85" textAnchor="middle" fill="#00e6c0" fontSize="14" fontWeight="bold">
              DSO Agent/Watcher
            </text>
            <text x="360" y="110" textAnchor="middle" fill="#b0b8c0" fontSize="12">
              Detect changes
            </text>
            <text x="360" y="130" textAnchor="middle" fill="#b0b8c0" fontSize="12">
              Spawn container
            </text>

            {/* Arrow 2: Watcher to Memory */}
            <path
              d="M 360 170 L 360 230"
              stroke="#00e6c0"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              fill="none"
            />
            <text x="380" y="200" textAnchor="start" fill="#8b92a0" fontSize="11">
              Load into tmpfs
            </text>

            {/* Memory/tmpfs Box */}
            <rect x="280" y="230" width="160" height="120" fill="url(#providerGrad)" stroke="#00e6c0" strokeWidth="2" rx="8" />
            <text x="360" y="265" textAnchor="middle" fill="#00e6c0" fontSize="14" fontWeight="bold">
              Secure Storage
            </text>
            <text x="360" y="290" textAnchor="middle" fill="#b0b8c0" fontSize="12">
              tmpfs (encrypted)
            </text>
            <text x="360" y="310" textAnchor="middle" fill="#b0b8c0" fontSize="12">
              Never persisted to disk
            </text>

            {/* Arrow 3: Memory to Container */}
            <path
              d="M 440 290 L 520 290"
              stroke="#00e6c0"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              fill="none"
            />
            <text x="480" y="280" textAnchor="middle" fill="#8b92a0" fontSize="11">
              Inject via env/files
            </text>

            {/* Container Box */}
            <rect x="520" y="230" width="160" height="120" fill="url(#providerGrad)" stroke="#00e6c0" strokeWidth="2" rx="8" />
            <text x="600" y="265" textAnchor="middle" fill="#00e6c0" fontSize="14" fontWeight="bold">
              Application
            </text>
            <text x="600" y="290" textAnchor="middle" fill="#b0b8c0" fontSize="12">
              Container running
            </text>
            <text x="600" y="310" textAnchor="middle" fill="#b0b8c0" fontSize="12">
              with secrets
            </text>

            {/* Health Checks */}
            <rect x="700" y="50" width="160" height="80" fill="url(#providerGrad)" stroke="#00e6c0" strokeWidth="2" rx="8" />
            <text x="780" y="80" textAnchor="middle" fill="#00e6c0" fontSize="14" fontWeight="bold">
              Health Checks
            </text>
            <text x="780" y="105" textAnchor="middle" fill="#b0b8c0" fontSize="12">
              Validate rotation
            </text>

            {/* Arrow from Watcher to Health */}
            <path
              d="M 440 110 L 700 110"
              stroke="#8b92a0"
              strokeWidth="1"
              strokeDasharray="4,4"
              fill="none"
            />

            {/* Arrow from Health to Container */}
            <path
              d="M 780 130 L 600 230"
              stroke="#8b92a0"
              strokeWidth="1"
              strokeDasharray="4,4"
              fill="none"
            />

            {/* Rollback/Recovery Box */}
            <rect x="700" y="230" width="160" height="120" fill="url(#providerGrad)" stroke="#00e6c0" strokeWidth="2" rx="8" />
            <text x="780" y="265" textAnchor="middle" fill="#00e6c0" fontSize="14" fontWeight="bold">
              Rollback
            </text>
            <text x="780" y="290" textAnchor="middle" fill="#b0b8c0" fontSize="12">
              On failure: restore
            </text>
            <text x="780" y="310" textAnchor="middle" fill="#b0b8c0" fontSize="12">
              previous state
            </text>

            {/* Arrow from Container to Rollback */}
            <path
              d="M 680 290 L 700 290"
              stroke="#00e6c0"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              fill="none"
            />
            <text x="690" y="280" textAnchor="middle" fill="#8b92a0" fontSize="11">
              On error
            </text>

            {/* Arrow from Rollback back to Watcher */}
            <path
              d="M 780 230 L 360 170"
              stroke="#8b92a0"
              strokeWidth="1.5"
              strokeDasharray="4,4"
              fill="none"
            />
            <text x="550" y="195" textAnchor="middle" fill="#8b92a0" fontSize="11">
              Signal recovery
            </text>

            {/* Legend */}
            <text x="50" y="520" fill="#b0b8c0" fontSize="12" fontWeight="bold">
              Legend:
            </text>
            <line x1="50" y1="535" x2="80" y2="535" stroke="#00e6c0" strokeWidth="2" />
            <text x="90" y="540" fill="#8b92a0" fontSize="11">
              Data flow
            </text>

            <line x1="200" y1="535" x2="230" y2="535" stroke="#8b92a0" strokeWidth="1" strokeDasharray="4,4" />
            <text x="240" y="540" fill="#8b92a0" fontSize="11">
              Control/monitoring
            </text>

            {/* Key Properties */}
            <text x="900" y="85" fill="#00e6c0" fontSize="12" fontWeight="bold">
              Key Properties:
            </text>
            <circle cx="910" cy="115" r="3" fill="#00e6c0" />
            <text x="925" y="120" fill="#b0b8c0" fontSize="11">
              Zero disk persistence
            </text>

            <circle cx="910" cy="145" r="3" fill="#00e6c0" />
            <text x="925" y="150" fill="#b0b8c0" fontSize="11">
              Atomic rotation
            </text>

            <circle cx="910" cy="175" r="3" fill="#00e6c0" />
            <text x="925" y="180" fill="#b0b8c0" fontSize="11">
              Automatic rollback
            </text>

            <circle cx="910" cy="205" r="3" fill="#00e6c0" />
            <text x="925" y="210" fill="#b0b8c0" fontSize="11">
              Provider-agnostic
            </text>

            <circle cx="910" cy="235" r="3" fill="#00e6c0" />
            <text x="925" y="240" fill="#b0b8c0" fontSize="11">
              No downtime
            </text>

            {/* Arrow marker definition */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#00e6c0" />
              </marker>
            </defs>
          </svg>
        </div>

        {/* Mobile-friendly text description */}
        <div className="lg:hidden space-y-8">
          <div className="bg-surface/50 border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-accent mb-4">Secret Provider</h3>
            <p className="text-secondary">Vault, AWS Secrets Manager, Azure Key Vault, Huawei Cloud, or Local encrypted storage</p>
          </div>

          <div className="text-center text-secondary text-sm">↓</div>

          <div className="bg-surface/50 border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-accent mb-4">DSO Agent/Watcher</h3>
            <p className="text-secondary">Detects secret changes and spawns rotation container with health validation</p>
          </div>

          <div className="text-center text-secondary text-sm">↓</div>

          <div className="bg-surface/50 border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-accent mb-4">Secure Storage (tmpfs)</h3>
            <p className="text-secondary">Secrets loaded into encrypted memory, never written to disk</p>
          </div>

          <div className="text-center text-secondary text-sm">↓</div>

          <div className="bg-surface/50 border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-accent mb-4">Application Container</h3>
            <p className="text-secondary">Receives secrets via environment variables or mounted files</p>
          </div>

          <div className="bg-surface/50 border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-accent mb-4">Health Checks & Rollback</h3>
            <p className="text-secondary">Validates rotation success; automatically reverts on failure</p>
          </div>
        </div>

        {/* Key Points */}
        <div className="grid sm:grid-cols-2 gap-6 mt-16 max-w-3xl mx-auto">
          {[
            {
              title: "Zero Disk Persistence",
              description: "Secrets exist only in encrypted memory (tmpfs). Cleared on container exit."
            },
            {
              title: "Atomic Rotation",
              description: "Secrets updated atomically. Application sees no partial state."
            },
            {
              title: "Automatic Rollback",
              description: "If rotation fails, previous state is automatically restored."
            },
            {
              title: "Provider Agnostic",
              description: "Same process works with any secret provider. No code changes needed."
            },
          ].map((point, idx) => (
            <div key={idx} className="bg-surface/50 border border-border rounded-lg p-6">
              <h4 className="font-semibold text-accent mb-2">{point.title}</h4>
              <p className="text-sm text-secondary">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
