# Security Policy

## Supported Versions

The following versions of DSO are currently being supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| v3.x    | :white_check_mark: |
| v2.x    | :x:                |
| v1.x    | :x:                |

## Reporting a Vulnerability

We take the security of DSO seriously. If you believe you have found a security vulnerability, please report it to us by emailing [umairmd385@gmail.com](mailto:umairmd385@gmail.com).

Please include:
- A description of the vulnerability.
- Steps to reproduce the issue.
- Potential impact.

We will acknowledge your report and work with you to resolve the issue as quickly as possible. Please do not report security vulnerabilities through public GitHub issues.

## Security Architecture

DSO is built with security as a primary design goal. Key security features include:
- **Zero-File Footprint**: Secrets are fetched at runtime and held only in memory (RAM).
- **In-Memory Injection**: Secrets are streamed directly into containers via `tmpfs` mounts or environment variables, never touching the physical disk.
- **Machine Identity**: Support for AWS IAM Roles, Azure Managed Identity, and Vault AppRole to eliminate static credentials.
- **Continuous Reconciliation**: Automated rotation of secrets to minimize the window of vulnerability.

For a detailed deep-dive into our security model, please refer to the [Internal Security Guide](https://docker-secret-operator.org/docs/guide/security).
