import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";

export const metadata = generatePageMetadata(
  {
    title: "Security Model & Threat Analysis | Docker Secret Operator",
    description: "Docker Secret Operator security guarantees, threat model, and best practices. Zero-persistence secrets, AES-256 encryption, TLS 1.2+, audit logging, and compliance with PCI-DSS, HIPAA, SOC 2.",
    keywords: ["dso security", "docker secret operator security", "zero persistence secrets", "secret encryption docker", "threat model containers", "pci-dss hipaa soc2 secrets"],
    ogTitle: "DSO Security Model & Threat Analysis",
    ogDescription: "Zero-persistence secrets, AES-256 encryption, TLS 1.2+, full audit trail.",
    twitterCard: "summary",
  },
  "/docs/guide/security"
);

const content = `# Security

Docker Secret Operator is designed around a zero-persistence, defense-in-depth security model.

---

## Security Guarantees

### Secrets Never on Disk

Plaintext secrets are **never written** to the host filesystem. Verified by running file system scans after deployment — no secret files are found.

### Not in Docker Metadata

Secrets never appear in \`docker inspect\` output. They are not stored as environment variables visible to the Docker API.

### Encryption at Rest

| Mode | Encryption Standard |
|------|-------------------|
| Local Mode | AES-256-GCM with PBKDF2 key derivation |
| AWS | AWS KMS encryption (AWS manages keys) |
| Azure | FIPS 140-2 Level 2 encryption |
| HashiCorp Vault | Vault encryption at rest |

### Network Security

- All provider communication uses **TLS 1.2** or newer
- Certificate validation always enforced
- Webhook signatures verified (HMAC-SHA256)
- No plaintext secret transmission over network

---

## Threat Model

### Threats We Protect Against

| Threat | Protection |
|--------|-----------|
| Host filesystem compromise | Secrets never written to disk |
| \`docker inspect\` exposure | Secrets not stored in container metadata |
| Network eavesdropping | TLS 1.2+ enforced on all connections |
| Webhook injection | HMAC signature validation on every event |

### Threats Outside Our Scope

- **Kernel compromise** — No system protects against kernel-level access
- **Hypervisor escape** — Cloud provider responsibility
- **Supply chain attack** — Verify binaries; build from source if required
- **Provider account compromise** — Provider security is their responsibility

---

## Best Practices

### Use IAM Roles (Not Access Keys)

\`\`\`yaml
# dso.yaml
provider:
  type: aws
  # No credentials here — uses IAM Instance Profile automatically
  region: us-east-1
\`\`\`

On AWS, use **IAM roles** instead of access keys. On Azure, use **Managed Identities**. Credentials are managed automatically by the cloud provider.

### Least Privilege IAM Policy (AWS Example)

\`\`\`json
{
  "Effect": "Allow",
  "Action": ["secretsmanager:GetSecretValue"],
  "Resource": "arn:aws:secretsmanager:us-east-1:*:secret:myapp/*"
}
\`\`\`

Restrict policies to the minimum needed — only \`GetSecretValue\`, only for specific secret prefixes.

### Enable Audit Logging

| Provider | Audit Service |
|----------|--------------|
| AWS | CloudTrail |
| Azure | Activity Log |
| HashiCorp Vault | Vault audit device |

### Network Segmentation

Use firewall rules: default deny inbound, allow only required outbound HTTPS to the provider endpoint. For webhook mode, restrict to provider IP ranges only.

---

## Compliance

### Supported Standards

| Standard | How DSO Satisfies It |
|----------|---------------------|
| **PCI-DSS** | Secrets not on disk, audit logging, TLS encryption |
| **HIPAA** | Encryption in transit and at rest, access logs |
| **SOC 2** | Audit logging, access control, availability monitoring |
| **ISO 27001** | Cryptographic controls, access management, incident logging |

### Audit Trail

All rotation operations are logged with timestamps and details in structured JSON format for easy parsing and compliance review.

\`\`\`json
{
  "timestamp": "2026-05-20T17:00:00Z",
  "event": "rotation_completed",
  "secret": "DB_PASSWORD",
  "container": "app-web",
  "duration_ms": 4823,
  "status": "success"
}
\`\`\`

---

## Security Checklist

- ✅ Use IAM role or managed identity (not access keys)
- ✅ Apply least privilege policies
- ✅ Enable provider audit logging
- ✅ Configure firewall rules (deny by default)
- ✅ Verify TLS certificates (never disable)
- ✅ Rotate provider credentials regularly
- ✅ Monitor access logs for anomalies
- ✅ Document security procedures for your team

---

## Next Steps

- Read [Architecture](/docs/guide/architecture) for technical implementation details
- Check [Configuration](/docs/guide/configuration) for security-related config options
- Review the [Production Readiness](/docs/guide/production-readiness) checklist
`;

export default function SecurityPage() {
  return <MarkdownRenderer content={content} />;
}
