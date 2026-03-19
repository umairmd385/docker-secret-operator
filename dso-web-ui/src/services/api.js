// Simulated API service for DSO Backend
// Endpoints mimic the actual DSO Go API

const MOCK_DATA = {
  providers: [
    { id: 'aws', name: 'AWS Secrets Manager', region: 'us-east-1', secrets_count: 12, status: 'Connected', icon: 'cloud', auth_status: 'Valid Token', last_successful_fetch: 'Just now' },
    { id: 'azure', name: 'Azure Key Vault', vault_name: 'production-secrets', secrets_count: 8, status: 'Failed', icon: 'lock', auth_status: 'Token expired', last_successful_fetch: '4 hours ago' },
    { id: 'vault', name: 'HashiCorp Vault', secrets_count: 15, status: 'Connected', icon: 'server', auth_status: 'Authenticated', last_successful_fetch: '2 mins ago' },
    { id: 'local', name: 'Local Provider', secrets_count: 4, status: 'Connected', icon: 'database', auth_status: 'N/A', last_successful_fetch: 'Live' }
  ],
  secrets: {
    aws: [
      { name: 'db_password', provider: 'AWS Secrets Manager', container: 'mysql_container', status: 'Synced', last_sync: '12s ago', value: 'r00t_p@ss_aws', injection_method: 'FILE', mount_path: '/run/secrets/db_password', error: null },
      { name: 'api_key', provider: 'AWS Secrets Manager', container: 'backend_api', status: 'Synced', last_sync: '1m ago', value: 'sk_live_v2_xyz', injection_method: 'ENV', mount_path: null, error: null },
      { name: 'stripe_secret', provider: 'AWS Secrets Manager', container: 'payment-svc', status: 'Pending', last_sync: '5m ago', value: 'whsec_9911', injection_method: 'ENV', mount_path: null, error: null }
    ],
    azure: [
      { name: 'app_secret', provider: 'Azure Key Vault', container: 'auth-svc', status: 'Synced', last_sync: '2m ago', value: 'az_c0nfid3nti@l', injection_method: 'ENV', mount_path: null, error: null },
      { name: 'storage_key', provider: 'Azure Key Vault', container: 'blob-worker', status: 'Failed', last_sync: '2h ago', value: 'st_998877', injection_method: 'FILE', mount_path: '/etc/secrets/storage_key', error: 'Authentication token expired' }
    ],
    vault: [
      { name: 'vault_root', provider: 'HashiCorp Vault', container: 'admin-gate', status: 'Synced', last_sync: '1h ago', value: 'v.r00t.t0ken', injection_method: 'FILE', mount_path: '/vault/secrets/root', error: null }
    ],
    local: [
      { name: 'dev_db', provider: 'Local Provider', container: 'local-mysql', status: 'Synced', last_sync: '4s ago', value: 'dev_only_pwd', injection_method: 'ENV', mount_path: null, error: null }
    ]
  },
  containers: [
    { name: 'mysql_container', secrets: [{ name: 'db_password', injection_type: 'file', mount_path: '/run/secrets/db_password', last_injection: '12s ago' }], status: 'Healthy', last_injection: '12s ago' },
    { name: 'backend_api', secrets: [{ name: 'api_key', injection_type: 'env', mount_path: null, last_injection: '1m ago'}], status: 'Healthy', last_injection: '1m ago' },
    { name: 'auth-svc', secrets: [{ name: 'app_secret', injection_type: 'env', mount_path: null, last_injection: '2m ago'}], status: 'Healthy', last_injection: '2m ago' },
    { name: 'blob-worker', secrets: [{ name: 'storage_key', injection_type: 'file', mount_path: '/etc/secrets/storage_key', last_injection: '2h ago'}], status: 'Degraded', last_injection: '2h ago' }
  ]
};

let activeProviderId = 'aws';

const fetchSim = async (data, failureRate = 0) => {
  await new Promise(r => setTimeout(r, 400 + Math.random() * 400));
  if (Math.random() < failureRate) {
    throw new Error('Network error or API unavailable');
  }
  return data;
};

const withRetry = async (fn, retries = 2) => {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries) throw error;
      attempt++;
      await new Promise(r => setTimeout(r, 500 * attempt));
    }
  }
};

export const dsoApi = {
  getProvider: async (env = 'dev') => {
    return withRetry(() => fetchSim(MOCK_DATA.providers.find(p => p.id === activeProviderId)));
  },
  getAllProviders: async (env = 'dev') => {
    return withRetry(() => fetchSim(MOCK_DATA.providers));
  },
  switchProvider: (id) => {
    activeProviderId = id;
  },
  getSecrets: async (providerId = activeProviderId, env = 'dev') => {
    return withRetry(() => fetchSim(MOCK_DATA.secrets[providerId] || []));
  },
  getSecretValue: async (name, env = 'dev') => {
    return withRetry(async () => {
      await new Promise(r => setTimeout(r, 600));
      const allSecrets = Object.values(MOCK_DATA.secrets).flat();
      const secret = allSecrets.find(s => s.name === name);
      return secret ? { ...secret, revealed: true } : null;
    });
  },
  getContainers: async (env = 'dev') => {
    return withRetry(() => fetchSim(MOCK_DATA.containers));
  },
  forceSync: async () => {
    return withRetry(async () => {
      await new Promise(r => setTimeout(r, 1200));
      return { status: 'success', timestamp: new Date().toISOString() };
    });
  }
};
