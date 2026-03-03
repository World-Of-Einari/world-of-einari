# RAG + MCP Playground

A small reference implementation that prioritises transparency.

## Goals
- Fast answers
- Clear sources
- Safe tool calls

## Pipeline (v1)
1. Load markdown content
2. Chunk by heading + size threshold
3. Embed chunks and store in Postgres (pgvector)
4. Retrieve top-k by similarity
5. Compose an answer **with citations**

## MCP integration idea
Expose read-only tools:
- `listProjects()`
- `getProject(slug)`
- `searchWriting(query)`

Then let the model decide when to call them. The UI shows tool calls and their outputs.

