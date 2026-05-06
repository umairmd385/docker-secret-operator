export const metadata = {
  title: "CLI: Down - DSO",
  description: "Stop and remove containers with security hardening",
};

export default function CLIDownPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">CLI: Down</h1>
        <p className="text-gray-300 text-lg">
          The <code className="bg-white/10 px-2 py-1 rounded">down</code> command stops and removes containers via Docker Compose
          wrapper with automatic security hardening. It safely cleans up all resources created by a DSO deployment.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Usage</h2>
        <div className="bg-white/10 p-4 rounded-lg font-mono text-sm">
          <code>docker dso down [flags]</code>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Description</h2>
        <p className="text-gray-300">Running <code className="bg-white/10 px-2 py-1 rounded">down</code> will:</p>
        <ol className="list-decimal list-inside space-y-2 text-gray-300">
          <li><strong>Stop Services</strong>: Gracefully stops all running containers</li>
          <li><strong>Remove Containers</strong>: Removes container instances</li>
          <li><strong>Cleanup Secrets</strong>: Securely wipes secrets from memory</li>
          <li><strong>Resource Management</strong>: Optionally removes volumes, networks, and images</li>
          <li><strong>Security Hardening</strong>: Ensures no secrets remain accessible after shutdown</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Flags</h2>
        <div className="bg-white/5 p-4 rounded-lg space-y-3">
          <div>
            <code className="text-accent">--volumes</code>, <code className="text-accent">-v</code>
            <p className="text-gray-400 text-sm mt-1">Remove named volumes declared in the compose file</p>
          </div>
          <div>
            <code className="text-accent">--remove-orphans</code>
            <p className="text-gray-400 text-sm mt-1">Remove containers for services not defined in compose file</p>
          </div>
          <div>
            <code className="text-accent">--rmi</code> all
            <p className="text-gray-400 text-sm mt-1">Remove images</p>
          </div>
          <div>
            <code className="text-accent">--timeout</code>, <code className="text-accent">-t</code>
            <p className="text-gray-400 text-sm mt-1">Timeout for graceful shutdown (default: 10s)</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Examples</h2>
        <div className="space-y-3">
          <div>
            <p className="text-gray-300 mb-2">Basic shutdown:</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono">docker dso down</div>
          </div>
          <div>
            <p className="text-gray-300 mb-2">Remove volumes:</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono">docker dso down -v</div>
          </div>
          <div>
            <p className="text-gray-300 mb-2">Clean everything:</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono">docker dso down -v --remove-orphans --rmi all</div>
          </div>
          <div>
            <p className="text-gray-300 mb-2">With custom timeout:</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono">docker dso down --timeout 30s</div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Security Features</h2>
        <ul className="space-y-2 text-gray-300">
          <li className="flex gap-3">
            <span className="text-green-400">✓</span>
            <span>Automatic secret cleanup and memory clearing</span>
          </li>
          <li className="flex gap-3">
            <span className="text-green-400">✓</span>
            <span>Graceful shutdown with SIGTERM/SIGKILL handling</span>
          </li>
          <li className="flex gap-3">
            <span className="text-green-400">✓</span>
            <span>Unmounts tmpfs filesystems</span>
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Related Commands</h2>
        <ul className="space-y-2">
          <li>
            <a href="/docs/cli/up" className="text-accent hover:underline">
              → CLI: Up - Deploy stack
            </a>
          </li>
          <li>
            <a href="/docs/cli/compose" className="text-accent hover:underline">
              → CLI: Compose - Direct compose wrapper
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
