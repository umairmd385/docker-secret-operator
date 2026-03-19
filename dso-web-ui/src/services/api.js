// Simulated API service for DSO Backend
// Endpoints mimic the actual DSO Go API

const MOCK_DATA = {
  providers: [
    { id: 'aws', name: 'AWS Secrets Manager', region: 'us-east-1', secrets_count: 12, status: 'Connected', icon: 'cloud' },
    { id: 'azure', name: 'Azure Key Vault', vault_name: 'production-secrets', secrets_count: 8, status: 'Connected', icon: 'lock' },
    { id: 'vault', name: 'HashiCorp Vault', secrets_count: 15, status: 'Connected', icon: 'server' },
    { id: 'local', name: 'Local Provider', secrets_count: 4, status: 'Connected', icon: 'database' }
  ],
  secrets: {
    aws: [
      { name: 'db_password', provider: 'AWS Secrets Manager', container: 'mysql_container', status: 'Injected', last_sync: '12s ago', value: 'r00t_p@ss_aws' },
      { name: 'api_key', provider: 'AWS Secrets Manager', container: 'backend_api', status: 'Injected', last_sync: '1m ago', value: 'sk_live_v2_xyz' },
      { name: 'stripe_secret', provider: 'AWS Secrets Manager', container: 'payment-svc', status: 'Pending', last_sync: '5m ago', value: 'whsec_9911' }
    ],
    azure: [
      { name: 'app_secret', provider: 'Azure Key Vault', container: 'auth-svc', status: 'Injected', last_sync: '2m ago', value: 'az_c0nfid3nti@l' },
      { name: 'storage_key', provider: 'Azure Key Vault', container: 'blob-worker', status: 'Injected', last_sync: '10m ago', value: 'st_998877' }
    ],
    vault: [
      { name: 'vault_root', provider: 'HashiCorp Vault', container: 'admin-gate', status: 'Injected', last_sync: '1h ago', value: 'v.r00t.t0ken' }
    ],
    local: [
      { name: 'dev_db', provider: 'Local Provider', container: 'local-mysql', status: 'Injected', last_sync: '4s ago', value: 'dev_only_pwd' }
    ]
  },
  containers: [
    { name: 'mysql_container', secrets: ['db_password'], status: 'Healthy', last_injection: '12s ago' },
    { name: 'backend_api', secrets: ['api_key'], status: 'Healthy', last_injection: '1m ago' },
    { name: 'auth-svc', secrets: ['app_secret'], status: 'Healthy', last_injection: '2m ago' }
  ]
};

let activeProviderId = 'aws';

export const dsoApi = {
  // GET /api/provider
  getProvider: async () => {
    await new Promise(r => setTimeout(r, 400)); // Latency
    return MOCK_DATA.providers.find(p => p.id === activeProviderId);
  },

  // GET /api/provider/all (for internal testing/UI)
  getAllProviders: async () => {
    return MOCK_DATA.providers;
  },

  // POST /api/provider/switch (simulate manual switching for the demo)
  switchProvider: (id) => {
    activeProviderId = id;
  },

  // GET /api/secrets
  getSecrets: async (providerId = activeProviderId) => {
    await new Promise(r => setTimeout(r, 300));
    return MOCK_DATA.secrets[providerId] || [];
  },

  // GET /api/secrets/{name}
  getSecretValue: async (name) => {
    await new Promise(r => setTimeout(r, 600));
    const allSecrets = Object.values(MOCK_DATA.secrets).flat();
    const secret = allSecrets.find(s => s.name === name);
    return secret ? { ...secret, revealed: true } : null;
  },

  // GET /api/containers
  getContainers: async () => {
    await new Promise(r => setTimeout(r, 400));
    return MOCK_DATA.containers;
  },

  // POST /api/secrets/sync
  forceSync: async () => {
    await new Promise(r => setTimeout(r, 1200));
    return { status: 'success', timestamp: new Date().toISOString() };
  }
};
