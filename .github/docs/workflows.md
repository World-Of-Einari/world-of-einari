# Workflows

## Overview

The CI/CD pipeline is split across three workflow files.

```
push to main
├── tests.yml           (standalone — badge)
├── secret-scanning.yml (standalone — badge)
└── deploy.yml
    ├── job: tests          (via workflow_call)
    ├── job: secret-scanning (via workflow_call)
    └── job: deploy         (only if both pass)

pull request
├── tests.yml           (standalone)
└── secret-scanning.yml (standalone)
```

---

## Workflows

### `tests.yml`

Runs lint and tests across the monorepo.

**Triggers:** `pull_request`, `push` to main, `workflow_call`

The `push` to main trigger exists solely to keep the Tests badge up to date. This means tests run twice on every push to main — once standalone and once called from `deploy.yml`. This is a known tradeoff in favour of having independent badges.

---

### `secret-scanning.yml`

Scans the full git history for leaked secrets using [Gitleaks](https://github.com/gitleaks/gitleaks).

**Triggers:** `pull_request`, `push` to main, `workflow_call`

Same double-run tradeoff as `tests.yml` above.

> **Note:** Requires a `GITLEAKS_LICENSE` secret for the Gitleaks GitHub Action. Free licences are available for public repositories at [gitleaks.io](https://gitleaks.io).

---

### `deploy.yml`

Calls `tests.yml` and `secret-scanning.yml` as reusable workflows, then builds and deploys to AWS S3 + CloudFront if both pass.

**Triggers:** `push` to main, `workflow_dispatch`

The `deploy` job is skipped for Release Please commits (`chore(release):`) and for manual `workflow_dispatch` runs it always proceeds regardless of commit message.

**Deployment steps:**

1. Build the Angular app (`pnpm build`)
2. Sync static assets to S3 with aggressive caching (`max-age=31536000, immutable`)
3. Sync HTML files with no caching (`max-age=0, must-revalidate`)
4. Invalidate the CloudFront distribution (`/*`)

---

## Manual deploys

Any workflow with `workflow_dispatch` can be triggered manually from the GitHub Actions UI or via the CLI:

```bash
gh workflow run deploy.yml
```

Useful for re-deploying without a code change, or recovering from a failed deploy.

---

## Required secrets

| Secret                       | Used by               | Description                          |
| ---------------------------- | --------------------- | ------------------------------------ |
| `AWS_ROLE_ARN`               | `deploy.yml`          | IAM role ARN for OIDC authentication |
| `AWS_REGION`                 | `deploy.yml`          | AWS region (e.g. `eu-west-2`)        |
| `S3_BUCKET`                  | `deploy.yml`          | S3 bucket name                       |
| `CLOUDFRONT_DISTRIBUTION_ID` | `deploy.yml`          | CloudFront distribution ID           |
| `GITLEAKS_LICENSE`           | `secret-scanning.yml` | Gitleaks licence key                 |

---

## Design decisions

**Why are Tests and Secret Scanning separate files rather than jobs in a single CI workflow?**

Separate files give separate badges and separate status checks, which can be individually required in branch protection rules. This makes it possible to enforce that secret scanning passes on every PR independently of test results.

**Why do Tests and Secret Scanning run twice on push to main?**

`workflow_call` alone would mean badges only update when Deploy runs. Adding `push` to main as a standalone trigger keeps badges current and allows the workflows to be required status checks in branch protection independently of Deploy. The cost is two extra job runs per push, which is acceptable for a portfolio project.

**Why not use `workflow_run` to chain workflows?**

`workflow_run` fires when any listed workflow completes — not all of them. Making Deploy wait for both Tests and Secret Scanning via `workflow_run` requires either a polling gate or accepting that deploy could fire before the second workflow finishes. Using `workflow_call` with `needs` inside Deploy is simpler and more reliable.
