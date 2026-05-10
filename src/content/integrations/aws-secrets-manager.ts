/**
 * AWS Secrets Manager Integration Content
 *
 * Comprehensive guide for integrating DSO with AWS Secrets Manager.
 * Targets: "AWS Secrets Manager Docker" (180 mo/searches)
 */

export const awsSecretsManagerIntegration = {
  slug: "aws-secrets-manager",
  title: "AWS Secrets Manager Integration with Docker Secret Operator",
  description: "Step-by-step guide to integrate Docker Secret Operator with AWS Secrets Manager. Zero-persistence secret injection for Docker and Kubernetes with AWS cloud backend.",
  keywords: [
    "aws secrets manager docker",
    "docker secret injection aws",
    "aws secrets manager integration",
    "dso aws",
    "secret injection aws containers",
  ],
  provider: {
    name: "AWS Secrets Manager",
    logo: "https://img.icons8.com/?size=100&id=G0CnLqqcRBXl&format=png&color=ffffff",
    url: "https://aws.amazon.com/secrets-manager/",
  },

  problemOverview: `
AWS Secrets Manager provides enterprise-grade secret management, but integrating it with Docker containers has traditionally been complex. Organizations face several challenges:

TRADITIONAL APPROACH PROBLEMS:
- Secrets stored in environment variables (exploitable via docker inspect, /proc/self/environ)
- Secrets persisted in Docker image layers (git history leaks, image scanning finds them)
- Manual secret rotation requiring container restarts
- Complex CI/CD workflows for secret injection
- No easy way to implement zero-persistence in Docker

WHY THIS INTEGRATION MATTERS:
Docker Secret Operator solves these problems by injecting AWS Secrets Manager credentials directly into container memory at runtime, eliminating persistence risks while leveraging AWS's robust secret management infrastructure.
  `,

  architecture: {
    overview: `
DSO + AWS Secrets Manager creates a secure, event-driven secret injection system:

1. Trust Boundary: IAM roles grant container permission to AWS Secrets Manager
2. Secret Lifecycle: Runtime fetch → Memory injection → Container access
3. Persistence: Zero - secrets never written to disk, environment, or logs
4. Rotation: Automatic refresh via AWS Secrets Manager events
5. Audit Trail: All secret access logged in AWS CloudTrail
    `,

    steps: [
      {
        title: "Authentication Flow",
        description: "Container assumes IAM role via EC2 instance metadata or ECS task role, authenticates to AWS Secrets Manager, fetches secret at runtime.",
      },
      {
        title: "Injection Model",
        description: "DSO intercepts container start, fetches secret from AWS, injects into tmpfs (in-memory filesystem), provides to container via file descriptor.",
      },
      {
        title: "Rotation Flow",
        description: "AWS Secrets Manager sends notification → DSO receives event → Secret refreshed in memory → Container continues without restart.",
      },
      {
        title: "Security Boundaries",
        description: "IAM policies control which containers can access which secrets. CloudTrail logs all access. Network isolation via VPC.",
      },
    ],
  },

  setupGuide: {
    prerequisites: [
      "AWS account with IAM permissions",
      "EC2 instance or ECS cluster running Docker",
      "AWS Secrets Manager secret already created",
      "Docker 20.10+ or Docker Desktop",
      "DSO v3.2+ installed (docker dso --version)",
      "AWS CLI configured (for testing)",
    ],

    steps: [
      {
        number: 1,
        title: "Create AWS Secrets Manager Secret",
        description: "Create your secret in AWS Secrets Manager (if not already created).",
        code: `
# Using AWS CLI
aws secretsmanager create-secret \\
  --name "my-app/database-password" \\
  --secret-string "my-secure-password" \\
  --region us-east-1

# Response:
# {
#   "ARN": "arn:aws:secretsmanager:us-east-1:123456789:secret:my-app/database-password-ABC123",
#   "Name": "my-app/database-password",
#   "VersionId": "a1b2c3d4-..."
# }
        `,
      },
      {
        number: 2,
        title: "Set Up IAM Role for Container",
        description: "Create IAM role that grants container access to the specific secret.",
        code: `
# Trust Policy (let EC2 assume this role)
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}

# Secret Access Policy (grant access to specific secret)
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret"
      ],
      "Resource": "arn:aws:secretsmanager:us-east-1:123456789:secret:my-app/*"
    }
  ]
}
        `,
      },
      {
        number: 3,
        title: "Configure DSO for AWS Cloud Mode",
        description: "Initialize DSO with AWS Secrets Manager as the provider.",
        code: `
# Initialize DSO Cloud Mode with AWS
docker dso init --mode cloud \\
  --provider aws \\
  --aws-region us-east-1 \\
  --aws-role-arn arn:aws:iam::123456789:role/ContainerSecretsRole

# Verify configuration
docker dso system info

# Output should show:
# Mode: Cloud
# Provider: AWS Secrets Manager
# Region: us-east-1
        `,
      },
      {
        number: 4,
        title: "Create Docker Compose with DSO",
        description: "Configure your Docker Compose to use DSO for AWS Secrets Manager injection.",
        code: `
version: "3.9"

services:
  app:
    image: myapp:latest
    environment:
      # Reference secrets from AWS Secrets Manager
      - DB_PASSWORD=dso://my-app/database-password
      - API_KEY=dso://my-app/api-key
      - JWT_SECRET=dso://my-app/jwt-secret
    networks:
      - default
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: dso://my-app/database-password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
        `,
      },
      {
        number: 5,
        title: "Deploy with DSO",
        description: "Use docker dso up instead of docker-compose up for automatic secret injection.",
        code: `
# Deploy with secret injection from AWS
docker dso up -d

# Behind the scenes, DSO:
# 1. Reads docker-compose.yaml
# 2. Finds dso:// references
# 3. Fetches secrets from AWS Secrets Manager
# 4. Injects into containers at runtime
# 5. Containers start with secrets available

# Verify container has secrets (without exposing them)
docker dso inspect app
# Shows: Secret injection status: ACTIVE
        `,
      },
      {
        number: 6,
        title: "Test Secret Injection",
        description: "Verify secrets are injected and accessible inside the container.",
        code: `
# Login to running container and test secret access
docker exec app env | grep DB_PASSWORD
# Shows: DB_PASSWORD=<secret-value-from-AWS>

# Verify secret NOT in environment (disk/logs)
docker logs app | grep DB_PASSWORD
# Should show NOTHING (secrets never logged)

# Verify secret NOT in image layers
docker inspect app | grep DB_PASSWORD
# Should show NOTHING (zero persistence)
        `,
      },
    ],
  },

  securityBenefits: [
    "Zero Persistence: Secrets never written to disk, environment, or logs",
    "IAM-Based Access Control: AWS IAM policies determine which secrets containers can access",
    "Automatic Rotation: AWS Secrets Manager rotations automatically update container secrets without restart",
    "CloudTrail Audit Logging: All secret access logged and auditable in CloudTrail",
    "Memory-Only Storage: Secrets only exist in RAM while container is running",
    "No Docker Layer Exposure: Secrets not baked into Docker images",
    "Encryption in Transit: TLS communication with AWS Secrets Manager",
    "Encryption at Rest: AWS Secrets Manager encryption at rest (KMS)",
    "Granular Permissions: Fine-grained IAM policies per secret",
    "Automatic Credential Refresh: Temporary credentials rotated without application restart",
  ],

  troubleshooting: [
    {
      problem: "Docker Compose gives 'dso:// not found' error",
      solution: `
Make sure you're using 'docker dso up' instead of 'docker-compose up'.
The native docker-compose command doesn't understand DSO syntax.

docker dso up -d  # Correct
docker-compose up  # Wrong
      `,
    },
    {
      problem: "Permission denied accessing AWS Secrets Manager",
      solution: `
Check IAM role has proper permissions:

1. Verify EC2 instance has the correct IAM role attached:
   aws ec2 describe-instances --instance-ids i-xxxxx \\
     --query 'Reservations[0].Instances[0].IamInstanceProfile'

2. Verify IAM role policy allows secretsmanager:GetSecretValue:
   aws iam get-role-policy \\
     --role-name ContainerSecretsRole \\
     --policy-name SecretAccess

3. Verify secret ARN matches policy resource:
   Policy: "arn:aws:secretsmanager:us-east-1:123456789:secret:my-app/*"
   Secret:  "arn:aws:secretsmanager:us-east-1:123456789:secret:my-app/database-password"
      `,
    },
    {
      problem: "Secret not updating after AWS Secrets Manager rotation",
      solution: `
DSO requires AWS Secrets Manager event notifications to auto-rotate.
Verify SNS topic is configured:

1. In AWS Secrets Manager console, verify the secret has rotation enabled
2. Check SNS topic for notifications
3. Restart container to force secret refresh:
   docker dso restart app

Alternative: Manual refresh
   docker dso secret refresh my-app/database-password
   docker dso restart app
      `,
    },
    {
      problem: "Container crashes with 'secret not found' error",
      solution: `
Secret path may be incorrect. Debug with:

1. Verify secret exists in AWS:
   aws secretsmanager describe-secret \\
     --secret-id my-app/database-password

2. Verify DSO can see it:
   docker dso secret list --provider aws

3. Verify environment variable syntax in docker-compose.yaml:
   Correct:    - DB_PASSWORD=dso://my-app/database-password
   Wrong:      - DB_PASSWORD=dso:///my-app/database-password
      `,
    },
    {
      problem: "CloudTrail shows 'AccessDenied' for secret access",
      solution: `
IAM role may have expired or been revoked. Check:

1. IAM role trust relationship:
   aws iam get-role \\
     --role-name ContainerSecretsRole \\
     --query 'Role.AssumeRolePolicyDocument'

2. Verify EC2 instance metadata is accessible:
   docker exec app curl http://169.254.169.254/latest/meta-data/iam/security-credentials/

3. Re-attach IAM role to EC2 instance:
   aws ec2 associate-iam-instance-profile \\
     --iam-instance-profile Name=container-profile \\
     --instance-id i-xxxxx
      `,
    },
  ],

  faqItems: [
    {
      question: "How does DSO fetch secrets from AWS Secrets Manager without storing credentials?",
      answer: `DSO uses IAM instance roles, not credentials. When the EC2 instance assumes an IAM role, AWS provides temporary credentials via the instance metadata service (169.254.169.254). These are automatically refreshed by AWS and never stored on disk. DSO fetches the temporary credentials from metadata, uses them once to fetch the secret, then discards the credentials.`,
    },
    {
      question: "Does DSO store secrets locally or in AWS?",
      answer: `DSO stores secrets in-memory only (RAM). The secrets are fetched from AWS Secrets Manager at container start time and injected directly into the container's memory via tmpfs. They are never written to disk, logs, environment files, or Docker layers. Once the container stops, the secrets are completely cleared from memory.`,
    },
    {
      question: "Can DSO automatically rotate AWS Secrets Manager secrets?",
      answer: `Yes. When you enable rotation in AWS Secrets Manager, DSO receives SNS notifications and automatically refreshes the secret in-memory without requiring a container restart. The container continues running and picks up the updated secret on next access.`,
    },
    {
      question: "What happens if AWS Secrets Manager is unreachable?",
      answer: `If AWS is unreachable during container start, DSO will fail to fetch the secret and the container will not start. This is intentional - it's better to fail fast than to start with missing credentials. You can configure a fallback (local secrets) for development environments, but production should always require successful AWS connectivity.`,
    },
    {
      question: "Can multiple containers share the same AWS Secrets Manager secret?",
      answer: `Yes. Multiple containers can reference the same secret path (e.g., dso://my-app/database-password). IAM policies control which containers can access which secrets based on the container's IAM role. Different IAM roles can have different permissions to different secrets.`,
    },
    {
      question: "How does DSO handle secrets larger than typical environment variable limits?",
      answer: `DSO injects secrets via tmpfs files, not environment variables. This allows handling secrets of any size (within AWS Secrets Manager limits, which is 512 KB). The container can read the secret from the file path provided by DSO rather than from environment variables.`,
    },
    {
      question: "Is there any performance overhead from fetching secrets at runtime?",
      answer: `Minimal. Secret fetching happens once at container startup (typically <100ms). AWS Secrets Manager has single-digit millisecond response times. The only overhead is the initial network call; after that, secrets are cached in-memory for the container's lifetime.`,
    },
    {
      question: "How do I audit who accessed which secrets?",
      answer: `AWS CloudTrail logs all secretsmanager:GetSecretValue API calls. Each log entry shows: timestamp, container's IAM role, secret ARN, request ID, and result (success/failure). You can query CloudTrail to see exactly when secrets were accessed and from which containers.`,
    },
  ],

  relatedPages: [
    { label: "Compare DSO vs Vault", href: "/comparisons/vault" },
    { label: "Kubernetes Secret Injection", href: "/integrations/kubernetes" },
    { label: "Azure Key Vault Integration", href: "/integrations/azure-key-vault" },
    { label: "Docker Secret Rotation", href: "/docs/cli/secret" },
  ],
};
