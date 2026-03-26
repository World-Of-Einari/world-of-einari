# World of Einari

[![Tests](https://github.com/World-Of-Einari/world-of-einari/actions/workflows/tests.yml/badge.svg)](https://github.com/World-Of-Einari/world-of-einari/actions/workflows/tests.yml)
[![Deploy Frontend](https://github.com/World-Of-Einari/world-of-einari/actions/workflows/deploy-fe.yml/badge.svg)](https://github.com/World-Of-Einari/world-of-einari/actions/workflows/deploy-fe.yml)
[![Deploy API](https://github.com/World-Of-Einari/world-of-einari/actions/workflows/deploy-api.yml/badge.svg)](https://github.com/World-Of-Einari/world-of-einari/actions/workflows/deploy-api.yml)
[![Secret Scanning](https://github.com/World-Of-Einari/world-of-einari/actions/workflows/secret-scanning.yml/badge.svg)](https://github.com/World-Of-Einari/world-of-einari/actions/workflows/secret-scanning.yml)

Personal portfolio website for Einari Naukkarinen, a Principal Software Engineer based in London. Built with Angular 20, deployed to AWS S3 + CloudFront, with a streaming OpenAI chat API backed by AWS Lambda.

Live at [einarinau.com](https://einarinau.com)

---

## Repository Structure

```
world-of-einari/
├── apps/
│   ├── web/          # Angular 20 frontend (portfolio + chat UI)
│   └── api/          # Node.js Lambda function (OpenAI streaming chat)
├── infra/            # Terraform — AWS infrastructure
└── .github/
    └── workflows/    # CI/CD pipelines
```

This is a **pnpm workspace monorepo**. All commands can be run from the root.

---

## Prerequisites

- [Node.js](https://nodejs.org/) 22 (use `nvm` — `.nvmrc` is included)
- [pnpm](https://pnpm.io/) 9.15.6+

---

## Installation

```bash
pnpm install
```

---

## Development

### Frontend only

```bash
pnpm dev:fe
```

App available at `http://localhost:4200`. The Angular dev server proxies `/api/chat` to `http://localhost:3001` automatically.

### Full stack (Frontend + Chat API)

In one terminal, start the API:

```bash
cd apps/api
cp .env.example .env   # add your OPENAI_API_KEY
pnpm dev
```

In another terminal, start the frontend:

```bash
pnpm dev:fe
```

See [apps/api/.env.example](apps/api/.env.example) for all available environment variables.

---

## Common Commands

| Command | Description |
|---|---|
| `pnpm dev:fe` | Start Angular dev server (proxies `/api/chat` to localhost:3001) |
| `pnpm dev:fe:prod-api` | Start Angular dev server proxied to the production API |
| `pnpm dev:api` | Start API local dev server on port 3001 |
| `pnpm build` | Build all apps |
| `pnpm test` | Run all tests |
| `pnpm lint` | Lint all code |
| `pnpm format` | Format all code |

---

## Tech Stack

### Frontend (`apps/web`)

| | |
|---|---|
| Framework | Angular 20 (standalone components) |
| State | NgRx with Signals |
| Styling | SCSS |
| Testing | Jest 29 + jest-preset-angular |
| Linting | ESLint 9 + angular-eslint |
| Build | Angular CLI |

### API (`apps/api`)

| | |
|---|---|
| Runtime | Node.js 22 (Lambda: nodejs22.x) |
| AI | OpenAI SDK 4.x (GPT-4o, streaming) |
| Secrets | AWS SSM Parameter Store (SecureString) |
| Build | esbuild — bundles to a single `dist/lambda.js` |

---

## Infrastructure

Managed with Terraform (AWS provider ~> 5.0). State is stored in S3.

### AWS Services

| Service | Purpose |
|---|---|
| S3 | Frontend hosting — assets stored by git SHA for immutable releases |
| CloudFront | CDN + routing. A CloudFront Function rewrites requests to the current release SHA |
| Lambda | Chat API — streams OpenAI responses via Lambda Response Stream API |
| Lambda Function URL | Public HTTP endpoint (no API Gateway) with CORS |
| DynamoDB | Stores contact form submissions from the chat |
| SNS | Sends email notifications for contact requests |
| SSM Parameter Store | Stores OpenAI API key as a SecureString |
| IAM OIDC | GitHub Actions assumes a scoped role via OIDC — no stored credentials |
| WAF | Web ACL attached to the CloudFront distribution |
| ACM | TLS certificate (us-east-1, required by CloudFront) |
| CloudWatch Logs | Lambda function logs |

### Key Decisions

- **Immutable frontend releases** — assets are uploaded by git SHA. Rolling back means updating a single variable in the CloudFront Function, no rebuild required.
- **Lambda Response Stream** — enables real-time streaming of OpenAI tokens to the browser without API Gateway.
- **Origin Verify Secret** — Lambda checks the `X-Origin-Verify` header set by CloudFront, preventing direct invocation of the function URL.
- **In-memory rate limiting** — 10 requests / 60 seconds per client IP, enforced in the Lambda handler.
- **GitHub OIDC** — short-lived tokens for deployments; no long-lived AWS secrets stored in GitHub.

### Provisioning

```bash
cd infra
terraform init
terraform plan
terraform apply
```

After provisioning, set the OpenAI API key out-of-band:

```bash
aws ssm put-parameter \
  --name "/world-of-einari/openai-api-key" \
  --value "sk-..." \
  --type SecureString \
  --overwrite
```

Required GitHub secrets for CI/CD:

```
AWS_ROLE_ARN
AWS_REGION
S3_BUCKET
CLOUDFRONT_DISTRIBUTION_ID
CHAT_LAMBDA_ARN
GITLEAKS_LICENSE
```

---

## CI/CD

All workflows live in [.github/workflows/](.github/workflows/).

### Workflows

| Workflow | Trigger | What it does |
|---|---|---|
| `tests.yml` | PR / push to `main` | Install → Build → Lint → Test |
| `secret-scanning.yml` | PR / push to `main` | Gitleaks scan across full git history |
| `deploy-fe.yml` | Push to `main` (changes in `apps/web/`) | Build → Sync to S3 → Update CloudFront Function → Invalidate cache |
| `deploy-api.yml` | Push to `main` (changes in `apps/api/`) | Build → Zip → Update Lambda function code |
| `release.yml` | Push to `main` | semantic-release — updates CHANGELOG, creates GitHub release and git tag |
| `rollback-fe.yaml` | Manual (input: git SHA) | Update CloudFront Function to point at a previous S3 release |

Deployments skip commits starting with `chore(release):` to avoid re-deploying on version bump commits.

### Frontend Caching Strategy

- Static assets (JS, CSS, fonts): `max-age=31536000, immutable` — safe because filenames are hashed
- HTML files: `max-age=0, must-revalidate` — always revalidated

---

## Releases

Uses [semantic-release](https://semantic-release.gitbook.io/) with conventional commits. Merging to `main` automatically creates a release, updates [CHANGELOG.md](CHANGELOG.md), and tags the commit.

Current version: **1.13.0**
