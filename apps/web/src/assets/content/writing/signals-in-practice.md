# Signals in practice

Signals shine when you keep them **close to the UI** and model state as **derivations**.

## Pattern
- Store the minimal mutable state in a few signals
- Build the rest with `computed()`
- Keep async flows explicit

```ts
const filters = signal({ query: '', tags: [] as string[] });
const items = signal<Item[]>([]);

const visible = computed(() => {
  const f = filters();
  return items().filter(i => i.title.includes(f.query));
});
```

## Why it works
- Less indirection than a global store
- No magic: you can follow the data
- Easy to test: compute in isolation

