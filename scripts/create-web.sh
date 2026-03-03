#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEB_DIR="$ROOT_DIR/apps/web"
STARTER_DIR="$ROOT_DIR/starter/web"
CONTENT_DIR="$ROOT_DIR/starter/content"

if [ -d "$WEB_DIR" ]; then
  echo "apps/web already exists. Skipping Angular scaffolding."
else
  echo "Creating Angular SSR app in apps/web..."
  # Angular CLI: SSR + standalone + routing + SCSS
  pnpm dlx @angular/cli@latest new web \
    --directory apps/web \
    --ssr \
    --standalone \
    --routing \
    --style scss \
    --skip-git \
    --package-manager pnpm
fi

echo "Overlaying starter files..."
rsync -a "$STARTER_DIR/" "$WEB_DIR/"

echo "Adding starter content..."
mkdir -p "$ROOT_DIR/content/projects" "$ROOT_DIR/content/writing"
rsync -a --ignore-existing "$CONTENT_DIR/projects/" "$ROOT_DIR/content/projects/"
rsync -a --ignore-existing "$CONTENT_DIR/writing/" "$ROOT_DIR/content/writing/"

echo "Installing dependencies for web..."
pnpm --filter web add @angular/material @angular/cdk marked highlight.js

echo "Done. Start dev server with: pnpm --filter web dev"
