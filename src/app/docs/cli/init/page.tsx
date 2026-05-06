export const metadata = {
  title: "CLI: Init - DSO",
  description: "Initialize an encrypted local vault for DSO Local Mode",
};

export default function CLIInitPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">CLI: Init</h1>
        <p className="text-gray-300 text-lg">
          The <code className="bg-white/10 px-2 py-1 rounded">init</code> command initializes a local, encrypted vault for DSO.
          This is the foundation of <strong>Local Mode</strong>.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Usage</h2>
        <div className="bg-white/10 p-4 rounded-lg font-mono text-sm">
          <code>docker dso init [flags]</code>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Description</h2>
        <p className="text-gray-300">
          Running <code className="bg-white/10 px-2 py-1 rounded">init</code> will:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-300">
          <li>Create the <code className="bg-white/10 px-2 py-1 rounded">~/.dso/</code> directory if it doesn't exist</li>
          <li>Prompt for a master password (or use <code className="bg-white/10 px-2 py-1 rounded">DSO_MASTER_PASSWORD</code> env)</li>
          <li>Generate a new AES-256-GCM encrypted vault file at <code className="bg-white/10 px-2 py-1 rounded">~/.dso/vault.enc</code></li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Flags</h2>
        <div className="bg-white/5 p-4 rounded-lg space-y-4">
          <div>
            <code className="text-accent">--path</code>
            <p className="text-gray-400 text-sm mt-1">Custom path for the vault file (default: ~/.dso/vault.enc)</p>
          </div>
          <div>
            <code className="text-accent">--force</code>
            <p className="text-gray-400 text-sm mt-1">Overwrite existing vault file</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Examples</h2>
        <div className="space-y-3">
          <div>
            <p className="text-gray-300 mb-2">Initialize with default settings:</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono">
              docker dso init
            </div>
          </div>
          <div>
            <p className="text-gray-300 mb-2">Initialize with a specific path:</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono">
              docker dso init --path ./my-project.vault
            </div>
          </div>
          <div>
            <p className="text-gray-300 mb-2">Reinitialize and overwrite existing vault:</p>
            <div className="bg-white/10 p-3 rounded text-sm font-mono">
              docker dso init --force
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-900/20 border border-blue-800/50 p-4 rounded-lg space-y-2">
        <p className="font-semibold text-blue-300">⚠️ Important</p>
        <p className="text-gray-300">
          Keep your master password safe. If lost, the data in <code className="bg-white/10 px-2 py-1 rounded">vault.enc</code> cannot be recovered.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Related Commands</h2>
        <ul className="space-y-2">
          <li>
            <a href="/docs/cli/secret" className="text-accent hover:underline">
              → CLI: Secret - Manage vault secrets
            </a>
          </li>
          <li>
            <a href="/docs/cli/up" className="text-accent hover:underline">
              → CLI: Up - Deploy with local vault
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
