export const metadata = {
  title: "CLI Reference - DSO",
  description: "Complete Docker Secret Operator CLI command reference",
};

export default function CLIOverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">CLI Reference</h1>
        <p className="text-gray-300 text-lg">
          DSO is implemented as a native Docker CLI plugin. All interactions are performed via the{" "}
          <code className="bg-white/10 px-2 py-1 rounded">docker dso</code> command space.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Command Overview</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg">
            <thead className="bg-white/5">
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 font-semibold">Command</th>
                <th className="text-left px-4 py-3 font-semibold">Purpose</th>
                <th className="text-left px-4 py-3 font-semibold">Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-4 py-3"><code className="text-accent">docker dso init</code></td>
                <td className="px-4 py-3">Initialize encrypted local vault</td>
                <td className="px-4 py-3"><span className="text-blue-400">Local</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3"><code className="text-accent">docker dso up</code></td>
                <td className="px-4 py-3">Deploy stack with secret injection</td>
                <td className="px-4 py-3"><span className="text-purple-400">Both</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3"><code className="text-accent">docker dso down</code></td>
                <td className="px-4 py-3">Stop and remove containers</td>
                <td className="px-4 py-3"><span className="text-purple-400">Both</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3"><code className="text-accent">docker dso compose</code></td>
                <td className="px-4 py-3">Secret-injecting compose wrapper</td>
                <td className="px-4 py-3"><span className="text-purple-400">Both</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3"><code className="text-accent">docker dso secret</code></td>
                <td className="px-4 py-3">Manage vault secrets</td>
                <td className="px-4 py-3"><span className="text-blue-400">Local</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3"><code className="text-accent">docker dso env import</code></td>
                <td className="px-4 py-3">Bulk-import secrets from .env file</td>
                <td className="px-4 py-3"><span className="text-blue-400">Local</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3"><code className="text-accent">docker dso fetch</code></td>
                <td className="px-4 py-3">Retrieve secrets from agent</td>
                <td className="px-4 py-3"><span className="text-green-400">Cloud</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3"><code className="text-accent">docker dso export</code></td>
                <td className="px-4 py-3">Export resolved secrets to file</td>
                <td className="px-4 py-3"><span className="text-purple-400">Both</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3"><code className="text-accent">docker dso inspect</code></td>
                <td className="px-4 py-3">View container environment & mounts</td>
                <td className="px-4 py-3"><span className="text-purple-400">Both</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3"><code className="text-accent">docker dso watch</code></td>
                <td className="px-4 py-3">Monitor secret rotations & events</td>
                <td className="px-4 py-3"><span className="text-green-400">Cloud</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3"><code className="text-accent">docker dso logs</code></td>
                <td className="px-4 py-3">View agent logs</td>
                <td className="px-4 py-3"><span className="text-green-400">Cloud</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3"><code className="text-accent">docker dso validate</code></td>
                <td className="px-4 py-3">Verify dso.yaml configuration</td>
                <td className="px-4 py-3"><span className="text-purple-400">Both</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3"><code className="text-accent">docker dso diff</code></td>
                <td className="px-4 py-3">Compare configurations</td>
                <td className="px-4 py-3"><span className="text-green-400">Cloud</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3"><code className="text-accent">docker dso system</code></td>
                <td className="px-4 py-3">Manage system state & plugins</td>
                <td className="px-4 py-3"><span className="text-green-400">Cloud</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3"><code className="text-accent">docker dso version</code></td>
                <td className="px-4 py-3">Display binary version</td>
                <td className="px-4 py-3"><span className="text-purple-400">Both</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Global Flags</h2>
        <div className="bg-white/5 p-4 rounded-lg space-y-3">
          <div>
            <code className="text-accent">--config</code>, <code className="text-accent">-c</code>
            <p className="text-gray-400 text-sm mt-1">Path to dso.yaml (default: dso.yaml)</p>
          </div>
          <div>
            <code className="text-accent">--debug</code>
            <p className="text-gray-400 text-sm mt-1">Enable debug logging</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Environment Variables</h2>
        <div className="bg-white/5 p-4 rounded-lg space-y-3">
          <div>
            <code className="text-accent">DSO_MODE</code>
            <p className="text-gray-400 text-sm mt-1">Force mode: local or cloud</p>
          </div>
          <div>
            <code className="text-accent">DSO_SOCKET_PATH</code>
            <p className="text-gray-400 text-sm mt-1">Custom socket path for agent communication</p>
          </div>
          <div>
            <code className="text-accent">DSO_PLUGIN_DIR</code>
            <p className="text-gray-400 text-sm mt-1">Custom directory for provider plugins</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Quick Links</h2>
        <ul className="space-y-2">
          <li>
            <a href="/docs/cli/init" className="text-accent hover:underline">
              → CLI: Init - Initialize encrypted vault
            </a>
          </li>
          <li>
            <a href="/docs/cli/up" className="text-accent hover:underline">
              → CLI: Up - Deploy stacks
            </a>
          </li>
          <li>
            <a href="/docs/cli/down" className="text-accent hover:underline">
              → CLI: Down - Stop containers
            </a>
          </li>
          <li>
            <a href="/docs/cli/compose" className="text-accent hover:underline">
              → CLI: Compose - Compose wrapper usage
            </a>
          </li>
          <li>
            <a href="/docs/cli/secret" className="text-accent hover:underline">
              → CLI: Secrets - Manage vault secrets
            </a>
          </li>
          <li>
            <a href="/docs/cli/management" className="text-accent hover:underline">
              → CLI: Management - Diagnostics & monitoring
            </a>
          </li>
          <li>
            <a href="/docs/cli/system" className="text-accent hover:underline">
              → CLI: System - System setup & diagnostics
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
