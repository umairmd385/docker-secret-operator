export const metadata = {
  title: "CLI: System - DSO",
  description: "Manage system state and plugins for Cloud Mode",
};

export default function CLISystemPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">CLI: System</h1>
        <p className="text-gray-300 text-lg">
          The <code className="bg-white/10 px-2 py-1 rounded">system</code> command suite manages the DSO environment,
          including plugin installation and diagnostics. This is primarily used for <strong>Cloud Mode</strong>.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Subcommands</h2>
        <div className="space-y-6">
          <div className="border border-border p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-3">1. system setup</h3>
            <p className="text-gray-300 mb-3">
              Installs or updates DSO providers (plugins) on the host. Requires root privileges.
            </p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono mb-3">
              docker dso system setup [flags]
            </div>

            <p className="text-gray-400 text-sm mb-3 font-bold">Flags:</p>
            <div className="bg-white/5 p-3 rounded text-sm space-y-2">
              <div>
                <code className="text-accent">--providers</code>
                <p className="text-gray-400 text-sm mt-1">Comma-separated list of providers (aws, azure, vault, huawei)</p>
              </div>
              <div>
                <code className="text-accent">--all</code>
                <p className="text-gray-400 text-sm mt-1">Install all available providers</p>
              </div>
              <div>
                <code className="text-accent">--no-verify</code>
                <p className="text-gray-400 text-sm mt-1">Skip SHA256 integrity checks (not recommended)</p>
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-3 font-bold mt-4">Examples:</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono space-y-2">
              <div>docker dso system setup --providers aws,azure</div>
              <div>docker dso system setup --all</div>
            </div>
          </div>

          <div className="border border-border p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-3">2. system doctor</h3>
            <p className="text-gray-300 mb-3">
              Performs a comprehensive diagnostic check of the DSO installation and runtime environment.
            </p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono mb-3">
              docker dso system doctor
            </div>

            <p className="text-gray-400 text-sm mb-3 font-bold">Checks Performed:</p>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span><strong>Binary Integrity</strong>: Verifies the DSO plugin hash</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span><strong>Mode Detection</strong>: Identifies if the system is in Local or Cloud mode</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span><strong>Vault Status</strong>: Checks accessibility of the local vault</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span><strong>Plugin Health</strong>: Verifies connectivity for each installed provider</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span><strong>Systemd Status</strong>: Checks if the DSO agent daemon is running (Cloud Mode)</span>
              </li>
            </ul>

            <p className="text-gray-400 text-sm mb-3 font-bold mt-4">Example:</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono">
              docker dso system doctor
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Example Output</h2>
        <div className="bg-white/5 p-4 rounded-lg space-y-3 font-mono text-sm">
          <div className="text-gray-300"># System Setup Output</div>
          <div className="bg-white/10 p-3 rounded">
            <div>[INFO] Installing DSO providers...</div>
            <div>[OK] AWS provider installed</div>
            <div>[OK] Azure provider installed</div>
            <div>[INFO] Setting up systemd service...</div>
            <div>[OK] Service registered</div>
          </div>

          <div className="text-gray-300 mt-4"># System Doctor Output</div>
          <div className="bg-white/10 p-3 rounded">
            <div>✓ Binary Integrity: OK</div>
            <div>✓ Mode: Cloud Mode</div>
            <div>✓ Vault Status: Accessible</div>
            <div>✓ AWS Provider: Connected</div>
            <div>✓ Azure Provider: Connected</div>
            <div>✓ Agent Daemon: Running</div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Supported Providers</h2>
        <div className="grid gap-3">
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>AWS Secrets Manager</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>Azure Key Vault</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>HashiCorp Vault</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>Huawei Cloud KMS</span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Cloud Mode Setup Workflow</h2>
        <div className="bg-white/5 p-4 rounded-lg space-y-3 font-mono text-sm">
          <div className="text-gray-300"># 1. Install provider plugins</div>
          <div className="bg-white/10 p-2 rounded">docker dso system setup --providers aws</div>

          <div className="text-gray-300 mt-4"># 2. Verify installation</div>
          <div className="bg-white/10 p-2 rounded">docker dso system doctor</div>

          <div className="text-gray-300 mt-4"># 3. Configure dso.yaml with provider details</div>
          <div className="bg-white/10 p-2 rounded">
            <div># dso.yaml:</div>
            <div>provider: aws</div>
            <div>region: us-west-2</div>
            <div>vault: my-secrets-vault</div>
          </div>

          <div className="text-gray-300 mt-4"># 4. Deploy with cloud-sourced secrets</div>
          <div className="bg-white/10 p-2 rounded">docker dso up -d</div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Best Practices</h2>
        <ul className="space-y-2 text-gray-300">
          <li className="flex gap-3">
            <span className="text-accent">✓</span>
            <span>Run <code className="bg-white/10 px-2 py-1 rounded">system setup</code> before switching to Cloud Mode</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent">✓</span>
            <span>Use <code className="bg-white/10 px-2 py-1 rounded">system doctor</code> to diagnose issues</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent">✓</span>
            <span>Only install providers you need (smaller footprint)</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent">✓</span>
            <span>Verify provider connectivity after setup</span>
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Troubleshooting</h2>
        <div className="bg-blue-900/20 border border-blue-800/50 p-4 rounded-lg space-y-3">
          <div>
            <p className="font-semibold text-blue-300">Plugin Installation Failed</p>
            <p className="text-gray-300 text-sm mt-1">
              Run <code className="bg-white/10 px-2 py-1 rounded">docker dso system doctor</code> to check binary integrity and permissions.
            </p>
          </div>
          <div>
            <p className="font-semibold text-blue-300">Provider Connectivity Issues</p>
            <p className="text-gray-300 text-sm mt-1">
              Verify provider credentials and network access. Use <code className="bg-white/10 px-2 py-1 rounded">--debug</code> flag for detailed logs.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Related Commands</h2>
        <ul className="space-y-2">
          <li>
            <a href="/docs/cli/up" className="text-accent hover:underline">
              → CLI: Up - Deploy with cloud-sourced secrets
            </a>
          </li>
          <li>
            <a href="/docs/cli/management" className="text-accent hover:underline">
              → CLI: Management - Diagnostics & monitoring
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
