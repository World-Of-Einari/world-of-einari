# einarinau.com — starter (Angular SSR + Material 3)

This repo is structured to keep deployment flexible (AWS/Vercel/etc.).

## What you get out of the box
- Angular **SSR** app with **Material 3** custom theme (dark-first)
- Modern routing skeleton: Home, Projects, Writing, AI Lab, About
- Markdown content for Projects/Writing (file-based)
- API service (Fastify) with `/health` and `/chat` stub

## Prereqs
- Node 20+ recommended
- pnpm 9+

## 1) Scaffold the Angular SSR app
From repo root:

```bash
pnpm install
pnpm setup:web
```

This runs `@angular/cli` to create `apps/web`, then overlays the curated starter files.

## 2) Run locally
```bash
pnpm --filter web dev
pnpm --filter api dev
```

- Web: http://localhost:4200
- API: http://localhost:8787/health

## 3) Content
Edit markdown:
- `content/projects/*.md`
- `content/writing/*.md`

Re-run the web dev server (or it should pick up changes depending on your watcher).

---

### Next milestones (optional)
- Add Postgres + pgvector + RAG ingest pipeline in `apps/api` + `packages/*`
- Wire `/ai` page to stream responses and show cited sources
