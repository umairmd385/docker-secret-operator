# Compliance & Security Controls

Docker Secret Operator (DSO) is built to help organizations achieve and maintain rigorous compliance standards. While no single software guarantees compliance, DSO's architecture satisfies many critical requirements out-of-the-box.

> [!CAUTION]
> This guide is a readiness resource showing how DSO maps to common frameworks. It does not replace a formal compliance audit from a certified assessor.

## Conceptual Framework

DSO operates on three compliance pillars:
1. **Zero Disk Persistence:** Secrets exist exclusively in memory (tmpfs/RAM).
2. **Machine Identity:** Role-based access without static credentials.
3. **Immutable Audit Trails:** Every lifecycle event is logged.

## SOC 2 Type II Mappings

| Trust Services Criteria | DSO Control Implementation |
|-------------------------|--------------------------|
| **CC6.1 (Logical Access)** | Credentials (e.g. `VAULT_TOKEN`) are dynamically retrieved and auto-renewed. No passwords exist in code or config files. |
| **CC6.2 (User Access)** | DSO integrates natively into IAM platforms (AWS Instance Profiles, Azure Managed Identity), ensuring secrets are tied to the compute resource, not an interactive user. |
| **CC7.1 (System Configuration)** | All mappings and injection policies are declared as code in `dso.yaml` and verified by JSON Schema before deployment. |
| **CC7.2 (Security Events)** | The structured JSON audit log emits standardized `audit` events required for SIEM ingestion when rotations, fetches, or injections occur. |
| **CC8.1 (Change Management)** | Secret rotation is fully automated via the Strategy engine, meaning developers do not need shell access to servers to update passwords safely. |

## ISO 27001 Mappings

| Annex A Control | DSO Mitigation Strategy |
|-----------------|-------------------------|
| **A.9.2.3 (Management of secret auth info)** | Secret data is transported via local Unix domain socket isolated to root/docker groups. It bypasses the network stack. |
| **A.12.3.1 (Information Backup)** | DSO is completely stateless. The authoritative source of truth remains HashiCorp Vault, AWS, or Azure. If a node fails, secrets are automatically re-fetched. |
| **A.12.4.1 (Event Logging)** | Administrator acts, system faults, auth failures are recorded to `stdout`/journald which forwards natively to aggregator daemons. |
| **A.14.2.5 (Secure System Engineering)** | Components are sandboxed. The provider plugins communicate via strictly typed RPC, limiting blast radius if an individual provider is compromised. |

## PCI-DSS Readiness

For organizations subject to Cardholder Data Environment (CDE) rules:

- **Requirement 3.2.1:** Cardholder authentication secrets are never written to `docker inspect` outputs or image layers.
- **Requirement 8.2.1:** Cryptographic secrets and tokens are rotated automatically per your internal policy defined in `dso.yaml` (`watch.interval`).
- **Requirement 10.2.1:** All requests to the underlying Cloud Secrets Manager include the specific IAM context for auditing at the network edge.

## Audit Subsystem Export

To guarantee compliance, make sure you configure your Docker host's logging drivers to forward standard output towards a centralized aggregation server that guarantees WORM (Write Once Read Many) immutability.

```yaml
# Example docker-compose configuration for compliant logging
services:
  myapp:
    image: myapp:prod
    logging:
      driver: "awslogs"
      options:
        awslogs-region: "us-east-1"
        awslogs-group: "dso-audit-events"
```
