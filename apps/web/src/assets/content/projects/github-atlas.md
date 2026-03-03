# GitHub Atlas

A graph-based discovery tool for large GitHub organisations.

## What problem it solves
In big orgs, the hardest part isn’t creating repos — it’s *finding* the right one, and knowing:

- who owns what
- where expertise lives
- how systems connect

## Approach
- Ingest GitHub org metadata (repos, languages, CODEOWNERS)
- Normalize it into a graph-friendly shape
- Present it as an interactive UI for exploration

## Why it’s interesting
- Ownership graphs are surprisingly hard to keep accurate.
- CODEOWNERS parsing is messy in the wild.
- “Search by capability” becomes possible once you treat signals as first-class.

## Tech
- Angular (UI)
- Node/TypeScript (ingest + API)
- Postgres (persistence)

