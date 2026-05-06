export const metadata = {
  title: "CLI: Secret - DSO",
  description: "Manage secrets within the local vault",
};

export default function CLISecretPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">CLI: Secret</h1>
        <p className="text-gray-300 text-lg">
          The <code className="bg-white/10 px-2 py-1 rounded">secret</code> command allows you to manage secrets within your
          <strong> Local Mode</strong> vault.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Subcommands</h2>
        <div className="space-y-6">
          <div className="border border-border p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-3">1. secret set</h3>
            <p className="text-gray-300 mb-3">Adds or updates a secret in the local vault.</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono mb-3">
              docker dso secret set &lt;project&gt;/&lt;path&gt; &lt;value&gt;
            </div>
            <p className="text-gray-400 text-sm mb-3">Example:</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono">
              echo "s3cr3t" | docker dso secret set myapp/db_password
            </div>
          </div>

          <div className="border border-border p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-3">2. secret get</h3>
            <p className="text-gray-300 mb-3">Retrieves a secret value (masked by default).</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono mb-3">
              docker dso secret get &lt;project&gt;/&lt;path&gt;
            </div>
            <p className="text-gray-400 text-sm mb-3">Options:</p>
            <div className="bg-white/5 p-3 rounded text-sm">
              <code className="text-accent">--newline</code>, <code className="text-accent">-n</code>
              <p className="text-gray-400 text-sm mt-1">Append newline to output</p>
            </div>
          </div>

          <div className="border border-border p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-3">3. secret list</h3>
            <p className="text-gray-300 mb-3">Lists all keys currently stored in the vault.</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono mb-3">
              docker dso secret list [project]
            </div>
            <p className="text-gray-400 text-sm mb-3">Example:</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono">
              docker dso secret list myapp
            </div>
          </div>

          <div className="border border-border p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-3">4. secret rm</h3>
            <p className="text-gray-300 mb-3">Removes a secret from the vault.</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono mb-3">
              docker dso secret rm &lt;project&gt;/&lt;path&gt;
            </div>
            <p className="text-gray-400 text-sm mb-3">Example:</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono">
              docker dso secret rm myapp/db_password
            </div>
          </div>

          <div className="border border-border p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-3">5. env import</h3>
            <p className="text-gray-300 mb-3">Bulk-import secrets from a .env file into the vault.</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono mb-3">
              docker dso env import &lt;file&gt; [project]
            </div>
            <p className="text-gray-400 text-sm mb-3">Example:</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono">
              docker dso env import .env.local myapp
            </div>
            <p className="text-gray-400 text-sm mt-3">Input file format:</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono mt-2">
              <div>DB_HOST=localhost</div>
              <div>DB_USER=postgres</div>
              <div>DB_PASSWORD=mysecret</div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Common Workflow</h2>
        <div className="bg-white/5 p-4 rounded-lg space-y-3 font-mono text-sm">
          <div className="text-gray-300"># Initialize vault first</div>
          <div className="bg-white/10 p-2 rounded">docker dso init</div>

          <div className="text-gray-300 mt-4"># Set a secret</div>
          <div className="bg-white/10 p-2 rounded">docker dso secret set myapp/api_key "sk-1234567890"</div>

          <div className="text-gray-300 mt-4"># View a secret (masked)</div>
          <div className="bg-white/10 p-2 rounded">docker dso secret get myapp/api_key</div>

          <div className="text-gray-300 mt-4"># List all secrets in project</div>
          <div className="bg-white/10 p-2 rounded">docker dso secret list myapp</div>

          <div className="text-gray-300 mt-4"># Import from .env file</div>
          <div className="bg-white/10 p-2 rounded">docker dso env import .env.prod myapp</div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Best Practices</h2>
        <ul className="space-y-2 text-gray-300">
          <li className="flex gap-3">
            <span className="text-accent">✓</span>
            <span>Use project namespaces to organize secrets (e.g., myapp/db_password)</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent">✓</span>
            <span>Never commit secrets to version control</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent">✓</span>
            <span>Use pipes for sensitive input: <code className="bg-white/10 px-2 py-1 rounded">echo "secret" | docker dso secret set</code></span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent">✓</span>
            <span>Regularly audit secrets with <code className="bg-white/10 px-2 py-1 rounded">docker dso secret list</code></span>
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Related Commands</h2>
        <ul className="space-y-2">
          <li>
            <a href="/docs/cli/init" className="text-accent hover:underline">
              → CLI: Init - Initialize encrypted vault
            </a>
          </li>
          <li>
            <a href="/docs/cli/up" className="text-accent hover:underline">
              → CLI: Up - Deploy with secrets
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
