import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { PAGE_METADATA } from "@/lib/seo/metadata";

export const metadata = generatePageMetadata(PAGE_METADATA["/docs/cli/up"], "/docs/cli/up");

export default function CLIUpPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">CLI: Up</h1>
        <p className="text-gray-300 text-lg">
          The <code className="bg-white/10 px-2 py-1 rounded">up</code> command deploys a Docker Compose stack with automatic
          secret injection. It's the primary entrypoint for both <strong>Local Mode</strong> and <strong>Cloud Mode</strong> operations.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Usage</h2>
        <div className="bg-white/10 p-4 rounded-lg font-mono text-sm">
          <code>docker dso up [flags]</code>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Description</h2>
        <p className="text-gray-300">Running <code className="bg-white/10 px-2 py-1 rounded">up</code> will:</p>
        <ol className="list-decimal list-inside space-y-2 text-gray-300">
          <li><strong>Detect Mode</strong>: Automatically identifies whether to use Local Mode (encrypted vault) or Cloud Mode (external provider)</li>
          <li><strong>Resolve Secrets</strong>: Fetches secrets from the configured source</li>
          <li><strong>Inject Secrets</strong>: Streams secrets directly into memory-backed filesystems (tmpfs) — zero persistence to disk</li>
          <li><strong>Deploy Stack</strong>: Starts Docker Compose services with secrets available in containers</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Flags</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr className="border-b border-border">
                <th className="text-left px-4 py-2 font-semibold">Flag</th>
                <th className="text-left px-4 py-2 font-semibold">Short</th>
                <th className="text-left px-4 py-2 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-4 py-2"><code className="text-accent">--file</code></td>
                <td className="px-4 py-2"><code className="text-accent">-f</code></td>
                <td className="px-4 py-2">Path to docker-compose.yaml (default: docker-compose.yaml)</td>
              </tr>
              <tr>
                <td className="px-4 py-2"><code className="text-accent">--config</code></td>
                <td className="px-4 py-2"><code className="text-accent">-c</code></td>
                <td className="px-4 py-2">Path to dso.yaml (default: dso.yaml)</td>
              </tr>
              <tr>
                <td className="px-4 py-2"><code className="text-accent">--mode</code></td>
                <td className="px-4 py-2">-</td>
                <td className="px-4 py-2">Force mode: local or cloud</td>
              </tr>
              <tr>
                <td className="px-4 py-2"><code className="text-accent">--debug</code></td>
                <td className="px-4 py-2">-</td>
                <td className="px-4 py-2">Enable debug logging</td>
              </tr>
              <tr>
                <td className="px-4 py-2"><code className="text-accent">--dry-run</code></td>
                <td className="px-4 py-2">-</td>
                <td className="px-4 py-2">Preview changes without deploying</td>
              </tr>
              <tr>
                <td className="px-4 py-2"><code className="text-accent">--detach</code></td>
                <td className="px-4 py-2"><code className="text-accent">-d</code></td>
                <td className="px-4 py-2">Run in background</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Examples</h2>
        <div className="space-y-3">
          <div>
            <p className="text-gray-300 mb-2">Basic deployment:</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono">docker dso up</div>
          </div>
          <div>
            <p className="text-gray-300 mb-2">Detached mode:</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono">docker dso up -d</div>
          </div>
          <div>
            <p className="text-gray-300 mb-2">With custom compose file:</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono">docker dso up -f docker-compose.prod.yaml -d</div>
          </div>
          <div>
            <p className="text-gray-300 mb-2">Preview changes:</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono">docker dso up --dry-run</div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Best Practices</h2>
        <ul className="space-y-2 text-gray-300">
          <li className="flex gap-3">
            <span className="text-accent">✓</span>
            <span>Use <code className="bg-white/10 px-2 py-1 rounded">--dry-run</code> before deployment to verify configuration</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent">✓</span>
            <span>Store compose files in version control but keep dso.yaml flexible</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent">✓</span>
            <span>Monitor logs in real-time after deployment</span>
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Related Commands</h2>
        <ul className="space-y-2">
          <li>
            <a href="/docs/cli/down" className="text-accent hover:underline">
              → CLI: Down - Stop deployed stack
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
