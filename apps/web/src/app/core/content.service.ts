import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type { ContentIndex, ContentKind, ContentListItem } from './content.types';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private indexSig = signal<ContentIndex | null>(null);
  index = computed(() => this.indexSig());

  constructor(private http: HttpClient) {}

  async ensureIndexLoaded(): Promise<ContentIndex> {
    const existing = this.indexSig();
    if (existing) return existing;

    const idx = await firstValueFrom(
      this.http.get<ContentIndex>('/assets/content/index.json', { responseType: 'json' as const })
    );
    this.indexSig.set(idx);
    return idx;
  }

  async list(kind: ContentKind): Promise<ContentListItem[]> {
    const idx = await this.ensureIndexLoaded();
    return idx[kind];
  }

  async getItem(kind: ContentKind, slug: string): Promise<ContentListItem | null> {
    const items = await this.list(kind);
    return items.find(i => i.slug === slug) ?? null;
  }

  async getMarkdown(kind: ContentKind, slug: string): Promise<string> {
    // Stored as assets/content/<kind>/<slug>.md
    return await firstValueFrom(
      this.http.get(`/assets/content/${kind}/${slug}.md`, { responseType: 'text' })
    );
  }
}
