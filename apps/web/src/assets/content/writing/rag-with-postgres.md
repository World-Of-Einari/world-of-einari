# RAG without the magic

RAG is mostly:

- good chunking
- reliable retrieval
- a UI that shows your work

## Chunking basics
Chunk by headings first, then enforce a size window.

## Retrieval
Use pgvector for similarity search and keep your schema boring.

```sql
-- pseudo
select id, content
from chunks
order by embedding <-> $query_embedding
limit 8;
```

## UX
Always show:
- what was retrieved
- what was used
- latency

