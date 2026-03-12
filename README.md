# World of Einari

[![Tests](https://github.com/enaukkarinen/world-of-einari/actions/workflows/tests.yml/badge.svg)](https://github.com/enaukkarinen/world-of-einari/actions/workflows/tests.yml)
[![Deploy](https://github.com/enaukkarinen/world-of-einari/actions/workflows/deploy.yml/badge.svg)](https://github.com/enaukkarinen/world-of-einari/actions/workflows/deploy.yml)
[![Secret Scanning](https://github.com/enaukkarinen/world-of-einari/actions/workflows/secret-scanning.yml/badge.svg)](https://github.com/enaukkarinen/world-of-einari/actions/workflows/secret-scanning.yml)

Personal portfolio website built with Angular, deployed to AWS S3 + CloudFront.

## Prerequisites

- [Node.js](https://nodejs.org/) (see `.nvmrc` for the required version)
- [pnpm](https://pnpm.io/) 9.15.6+

## Installation
```bash
pnpm install
```

## Development

Start the Angular dev server:
```bash
pnpm dev:fe
```

To also run the chat API locally:
```bash
cd apps/api && cp .env.example .env  # add your OPENAI_API_KEY
pnpm dev
```

The app will be available at `http://localhost:4200`.

## Build
```bash
pnpm build
```

## Test
```bash
pnpm test
```

## Lint
```bash
pnpm lint
```