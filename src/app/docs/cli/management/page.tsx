import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { PAGE_METADATA } from "@/lib/seo/metadata";

export const metadata = generatePageMetadata(PAGE_METADATA["/docs/cli/management"], "/docs/cli/management");

export default function CLIManagementPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">CLI: Management & Diagnostics</h1>
        <p className="text-gray-300 text-lg">
          DSO provides comprehensive management and diagnostic commands for monitoring, inspecting, and troubleshooting your deployments.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Commands</h2>
        <div className="space-y-6">
          <div className="border border-border p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-3">fetch</h3>
            <p className="text-gray-300 mb-3">Retrieve secrets from the running agent or list all defined secrets.</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono mb-3">
              <div>docker dso fetch</div>
              <div>docker dso fetch &lt;secret-name&gt;</div>
            </div>
          </div>

          <div className="border border-border p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-3">export</h3>
            <p className="text-gray-300 mb-3">Export resolved secrets to a local file for CI/testing.</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono mb-3">
              docker dso export --format env --output .env.resolved
            </div>
            <p className="text-gray-400 text-sm">Formats: env, json, yaml</p>
          </div>

          <div className="border border-border p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-3">inspect</h3>
            <p className="text-gray-300 mb-3">View environment variables and secret mounts with automatic masking.</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono mb-3">
              docker dso inspect &lt;container-id&gt;
            </div>
          </div>

          <div className="border border-border p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-3">watch</h3>
            <p className="text-gray-300 mb-3">Real-time monitor of secret rotations and container lifecycle events.</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono mb-3">
              <div>docker dso watch</div>
              <div>docker dso watch --debug</div>
              <div>docker dso watch --strategy rolling</div>
            </div>
          </div>

          <div className="border border-border p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-3">logs</h3>
            <p className="text-gray-300 mb-3">View systemd journald or REST API agent logs with filtering.</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono mb-3">
              <div>docker dso logs -f</div>
              <div>docker dso logs --tail 100</div>
              <div>docker dso logs --level error</div>
              <div>docker dso logs --since 10m -f</div>
            </div>
          </div>

          <div className="border border-border p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-3">validate</h3>
            <p className="text-gray-300 mb-3">Verify dso.yaml configuration syntax and schema compliance.</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono mb-3">
              docker dso validate
            </div>
          </div>

          <div className="border border-border p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-3">diff</h3>
            <p className="text-gray-300 mb-3">Compare local configuration against deployed stack structure.</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono mb-3">
              <div>docker dso diff</div>
              <div>docker dso diff my-stack</div>
            </div>
          </div>

          <div className="border border-border p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-3">version</h3>
            <p className="text-gray-300 mb-3">Display DSO binary version number and build information.</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono mb-3">
              docker dso version
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Common Workflows</h2>
        <div className="space-y-4">
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="font-bold mb-3">Daily Monitoring</h3>
            <div className="space-y-2 font-mono text-sm">
              <div className="text-gray-300"># Check recent logs</div>
              <div className="bg-white/10 p-2 rounded">docker dso logs --since 24h --level warn,error</div>
              <div className="text-gray-300 mt-2"># Monitor for changes</div>
              <div className="bg-white/10 p-2 rounded">docker dso watch &</div>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="font-bold mb-3">Debugging Issues</h3>
            <div className="space-y-2 font-mono text-sm">
              <div className="text-gray-300"># Inspect container</div>
              <div className="bg-white/10 p-2 rounded">docker dso inspect myapp_api_1</div>
              <div className="text-gray-300 mt-2"># Validate configuration</div>
              <div className="bg-white/10 p-2 rounded">docker dso validate</div>
              <div className="text-gray-300 mt-2"># Check secrets</div>
              <div className="bg-white/10 p-2 rounded">docker dso fetch</div>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="font-bold mb-3">Configuration Migration</h3>
            <div className="space-y-2 font-mono text-sm">
              <div className="text-gray-300"># Export current secrets</div>
              <div className="bg-white/10 p-2 rounded">docker dso export --format json --output backup.json</div>
              <div className="text-gray-300 mt-2"># Validate new config</div>
              <div className="bg-white/10 p-2 rounded">docker dso validate --config dso.new.yaml</div>
              <div className="text-gray-300 mt-2"># Compare changes</div>
              <div className="bg-white/10 p-2 rounded">docker dso diff</div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Best Practices</h2>
        <ul className="space-y-2 text-gray-300">
          <li className="flex gap-3">
            <span className="text-accent">✓</span>
            <span>Monitor continuously in production: <code className="bg-white/10 px-2 py-1 rounded">docker dso watch &</code></span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent">✓</span>
            <span>Validate before deployment: <code className="bg-white/10 px-2 py-1 rounded">docker dso validate</code></span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent">✓</span>
            <span>Regular backup of secrets with <code className="bg-white/10 px-2 py-1 rounded">docker dso export</code></span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent">✓</span>
            <span>Inspect containers after changes to verify injection</span>
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Related Commands</h2>
        <ul className="space-y-2">
          <li>
            <a href="/docs/cli/system" className="text-accent hover:underline">
              → CLI: System - System setup & diagnostics
            </a>
          </li>
          <li>
            <a href="/docs/cli/up" className="text-accent hover:underline">
              → CLI: Up - Deploy stacks
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
