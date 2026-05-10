import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { PAGE_METADATA } from "@/lib/seo/metadata";

export const metadata = generatePageMetadata(PAGE_METADATA["/docs/cli/compose"], "/docs/cli/compose");

export default function CLIComposePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">CLI: Compose</h1>
        <p className="text-gray-300 text-lg">
          The <code className="bg-white/10 px-2 py-1 rounded">compose</code> command is a secret-injecting wrapper for Docker
          Compose subcommands. It allows you to use familiar compose commands while DSO automatically handles secret injection.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Usage</h2>
        <div className="bg-white/10 p-4 rounded-lg font-mono text-sm">
          <code>docker dso compose &lt;subcommand&gt; [options]</code>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Supported Subcommands</h2>
        <div className="grid gap-4">
          <div className="border border-border p-4 rounded-lg">
            <code className="text-accent">up</code>
            <p className="text-gray-400 text-sm mt-2">Start and run services</p>
          </div>
          <div className="border border-border p-4 rounded-lg">
            <code className="text-accent">down</code>
            <p className="text-gray-400 text-sm mt-2">Stop and remove containers</p>
          </div>
          <div className="border border-border p-4 rounded-lg">
            <code className="text-accent">ps</code>
            <p className="text-gray-400 text-sm mt-2">List running containers</p>
          </div>
          <div className="border border-border p-4 rounded-lg">
            <code className="text-accent">logs</code>
            <p className="text-gray-400 text-sm mt-2">View service logs</p>
          </div>
          <div className="border border-border p-4 rounded-lg">
            <code className="text-accent">stop</code>
            <p className="text-gray-400 text-sm mt-2">Stop running services</p>
          </div>
          <div className="border border-border p-4 rounded-lg">
            <code className="text-accent">restart</code>
            <p className="text-gray-400 text-sm mt-2">Restart services</p>
          </div>
          <div className="border border-border p-4 rounded-lg">
            <code className="text-accent">pull</code>
            <p className="text-gray-400 text-sm mt-2">Pull latest images</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Examples</h2>
        <div className="space-y-3">
          <div>
            <p className="text-gray-300 mb-2">Start services:</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono">
              <div>docker dso compose up</div>
              <div>docker dso compose up -d</div>
            </div>
          </div>
          <div>
            <p className="text-gray-300 mb-2">View logs:</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono">
              <div>docker dso compose logs</div>
              <div>docker dso compose logs -f</div>
            </div>
          </div>
          <div>
            <p className="text-gray-300 mb-2">Check status:</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono">docker dso compose ps</div>
          </div>
          <div>
            <p className="text-gray-300 mb-2">Stop services:</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono">docker dso compose down</div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Key Features</h2>
        <ul className="space-y-2 text-gray-300">
          <li className="flex gap-3">
            <span className="text-accent">✓</span>
            <span>Automatic secret injection from vault or provider</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent">✓</span>
            <span>Use familiar docker-compose commands</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent">✓</span>
            <span>Works in both Local and Cloud modes</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent">✓</span>
            <span>Supports all standard compose flags</span>
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Common Workflow</h2>
        <div className="bg-white/5 p-4 rounded-lg space-y-3 font-mono text-sm">
          <div className="text-gray-300"># Initialize vault</div>
          <div className="bg-white/10 p-2 rounded">docker dso init</div>

          <div className="text-gray-300 mt-4"># Set secrets</div>
          <div className="bg-white/10 p-2 rounded">docker dso secret set myapp/db_password "secret"</div>

          <div className="text-gray-300 mt-4"># Start services</div>
          <div className="bg-white/10 p-2 rounded">docker dso compose up -d</div>

          <div className="text-gray-300 mt-4"># Check logs</div>
          <div className="bg-white/10 p-2 rounded">docker dso compose logs -f</div>

          <div className="text-gray-300 mt-4"># Stop services</div>
          <div className="bg-white/10 p-2 rounded">docker dso compose down</div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Related Commands</h2>
        <ul className="space-y-2">
          <li>
            <a href="/docs/cli/up" className="text-accent hover:underline">
              → CLI: Up - Direct deployment command
            </a>
          </li>
          <li>
            <a href="/docs/cli/down" className="text-accent hover:underline">
              → CLI: Down - Stop and cleanup
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
