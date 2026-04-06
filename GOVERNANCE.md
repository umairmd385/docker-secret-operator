# Governance

This document describes how the Docker Secret Operator (DSO) project is governed. We keep it simple and practical — governance should help the project, not slow it down.

## Principles

- **Transparency** — Decisions happen in public (GitHub issues, PRs, discussions)
- **Merit** — People grow into roles by doing the work
- **Simplicity** — Minimal process, maximum clarity

## Roles

### Contributor

Anyone who has contributed to the project in any way — code, docs, bug reports, reviews, or design discussions.

**How to become one:** Submit a PR or open an issue. That's it.

### Reviewer

A contributor who has demonstrated consistent, quality contributions and is trusted to review others' work.

**Responsibilities:**
- Review pull requests in their area of expertise
- Provide constructive, timely feedback
- Help new contributors get oriented

**How to become one:** After several meaningful contributions, a maintainer may invite you to take on reviewer responsibilities. You can also express interest by opening a discussion.

### Maintainer

A reviewer who has taken on broader responsibility for the project's direction, releases, and health.

**Responsibilities:**
- Merge pull requests
- Triage issues and security reports
- Make architectural decisions (with community input)
- Cut releases
- Uphold the Code of Conduct

**How to become one:** Maintainers are nominated by existing maintainers after demonstrating sustained, high-quality involvement over time. There's no fixed timeline — it depends on the depth and consistency of contributions.

See [MAINTAINERS.md](MAINTAINERS.md) for the current list.

## Decision-making

Most decisions happen naturally through pull requests and issues:

1. **Small changes** (bug fixes, typos, clear improvements) — A single maintainer can approve and merge
2. **Medium changes** (new features, refactors) — Should have at least one review from a maintainer and reasonable time for community feedback (a few days)
3. **Large changes** (architecture shifts, new providers, governance changes) — Require a GitHub Discussion or issue where the community can weigh in. Maintainers make the final call, but should incorporate feedback

If maintainers disagree on a decision, the lead maintainer has the final say. We prefer consensus but don't require unanimity.

## Adding or removing maintainers

- **Adding:** Nominated by an existing maintainer, approved by majority of current maintainers
- **Stepping back:** Maintainers can step back at any time and move to emeritus status. No hard feelings — life happens
- **Removal:** In rare cases where a maintainer violates the Code of Conduct or is unresponsive for an extended period (6+ months without communication), existing maintainers may vote to remove them

## Changes to governance

This document can be updated via a pull request. Significant changes should be discussed in a GitHub Discussion first.

---

This governance model is intentionally lightweight. As the project and community grow, we'll evolve it to match.
