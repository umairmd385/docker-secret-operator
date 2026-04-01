# Contributing to Docker Secret Operator (DSO)

Thank you for your interest in contributing! This guide outlines how to contribute to the DSO codebase or documentation effectively.

## Branch Strategy: Read This First!

DSO uses a **strict two-branch model**. All contributions MUST target the correct branch.

- **`main`**: The Go application source code. All backend enhancements, providers, CLI commands, testing, and JSON schemas belong here.
- **`feature/landing-page`**: The documentation and marketing site. All VitePress markdown files (`docs/guide/`), HTML, CSS, component styling, and demo scripts belong here.

**Never mix Go code into the `feature/landing-page` branch, and never place documentation source into `main`.**

---

## 1. Documentation Contributions

If you are updating documentation, fixing typos, or adding examples:

1. Target branch: `feature/landing-page`
2. Run VitePress locally to preview your changes:

```bash
git checkout feature/landing-page
npm install
npm run dev
# The site will be running at http://localhost:5173
```

### Style Guide
- Use Markdown for content.
- Include explicit language tags on all code blocks: `` ```yaml `` instead of just `` ``` ``.
- Utilize [VitePress specific syntax](https://vitepress.dev/guide/markdown) such as code groups (`::: code-group`).
- Architecture diagrams should use `mermaid` fenced blocks. See `docs/guide/architecture.md` for examples.

---

## 2. Code Contributions

If you are adding a feature, provider, fixing bugs, or improving performance:

1. Target branch: `main`

### Development Workflow

1. Fork the repository and check out `main`.
2. Ensure you have Go ≥ 1.21 installed.
3. Install dependencies: `go mod download`

### Compiling and Testing

```bash
# Build the CLI and the daemon
go build -o dso ./cmd/dso/
go build -o dso-agent ./cmd/dso-agent/

# Run the unit tests
go test ./...

# Run the integration tests (requires docker running locally)
go test ./test/integration/... -v
```

### Adding a New Provider Plugin

DSO leverages the `hashicorp/go-plugin` interface. To add a new cloud provider (e.g., GCP):

1. Create a directory `cmd/plugins/dso-provider-gcp`
2. Implement the provider interface:
   ```go
   type Provider interface {
       Init(config map[string]string) error
       GetSecret(name string) (map[string]string, error)
       WatchSecret(name string, interval time.Duration) (<-chan api.SecretUpdate, error)
   }
   ```
3. Expose the `plugin.Serve()` mechanism as seen in `cmd/plugins/dso-provider-aws/main.go`.

---

## 3. Pull Request Guidelines

1. **Keep it focused:** Each PR should address a single feature or bug fix.
2. **Commit Messages:** Follow [Conventional Commits](https://www.conventionalcommits.org/).
   - Examples: `feat: add Google Cloud Secret Manager support` or `docs: fix rotation mechanic diagram in architecture.md`
3. **Tests Required:** Any PR touching Go code MUST include unit tests and ideally an integration test covering the new logic under `test/integration/`.
4. **Issue Binding:** If your PR fixes an open issue, link to it in the PR description using `Fixes #123`.

---

## 4. Code of Conduct

Please maintain professional, respectful communication in issues and pull requests. We foster an inclusive developer environment. Harassment of any kind will not be tolerated.
