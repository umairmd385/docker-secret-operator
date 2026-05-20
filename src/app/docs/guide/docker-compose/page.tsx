import type { Metadata } from "next";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";

const content = `# Docker Compose Integration

> **Mode note:** \`dso://\` and \`dsofile://\` URI patterns are **Local Mode only**. In Cloud Mode, secret routing is defined in \`dso.yaml\` via \`secrets[].mappings\` — not in the compose file. See the [Configuration Reference](configuration.md).

DSO integrates seamlessly into your existing \`docker-compose.yaml\` files without requiring custom schema extensions. It utilizes standard \`yaml.v3\` AST parsing to preserve your comments and structure.

## 1. File Injection (Best Practice)
Most modern Docker images support \`_FILE\` suffixes for environment variables. DSO uses \`dsofile://\` to satisfy these natively.

\`\`\`yaml
services:
  web:
    image: myapp:latest
    environment:
      # DSO will mount this inside /run/secrets/dso/
      STRIPE_API_KEY_FILE: dsofile://billing/stripe_key
\`\`\`

## 2. Environment Injection (Legacy)
If your application absolutely cannot read from a file, use \`dso://\`. DSO will inject the literal text into the environment block right before boot.

\`\`\`yaml
services:
  web:
    image: legacyapp:1.0
    environment:
      # DSO evaluates this and passes STRIPE_API_KEY=sk_live_...
      STRIPE_API_KEY: dso://billing/stripe_key
\`\`\`

## 3. Mixed Usage
You can freely mix list-formats and map-formats, as well as \`dso://\` and \`dsofile://\`.

\`\`\`yaml
services:
  mixed_app:
    image: complex:latest
    environment:
      - DATABASE_PASSWORD_FILE=dsofile://global/db_pass
      - REDIS_URL=dso://global/redis_url
      - DEBUG=true
\`\`\`

## Implicit vs Explicit Scoping
- \`dso://db_pass\`: Resolves to the *current* docker-compose project context.
- \`dso://shared/db_pass\`: Resolves explicitly to the \`shared\` namespace in the DSO vault.
`;

export const metadata: Metadata = {
  title: "Docker Compose Integration",
  description: "Documentation for Docker Compose Integration",
};

export default function Page() {
  return <MarkdownRenderer content={content} />;
}
