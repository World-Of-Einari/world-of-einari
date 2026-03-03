import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MarkdownComponent } from '../../shared/markdown/markdown.component';
import { ContentService } from '../../core/content.service';
import type { ContentListItem } from '../../core/content.types';

@Component({
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatChipsModule, MarkdownComponent],
  styles: [
    `
    h1 { margin: 0; letter-spacing: -0.03em; }
    .summary { color: var(--text-2); margin-top: 8px; max-width: 72ch; }

    .page {
      margin-top: 16px;
      padding: 18px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--surface);
    }
    `
  ],
  template: `
    <a mat-button routerLink="/writing">← Writing</a>

    @if (loading()) {
      <div class="muted">Loading…</div>
    } @else {
      @if (item(); as it) {
        <div style="margin-top:10px">
          <h1>{{ it.title }}</h1>
          <div class="summary">{{ it.summary }}</div>
          @if (it.tags?.length) {
            <div style="height:12px"></div>
            <mat-chip-set>
              @for (t of it.tags!; track t) { <mat-chip>{{ t }}</mat-chip> }
            </mat-chip-set>
          }
        </div>

        <div class="page">
          <app-markdown [markdown]="markdown()" />
        </div>
      } @else {
        <div class="muted">Not found.</div>
      }
    }
  `
})
export class WritingDetailPage {
  private route = inject(ActivatedRoute);
  private content = inject(ContentService);

  private loadingSig = signal(true);
  loading = computed(() => this.loadingSig());

  private itemSig = signal<ContentListItem | null>(null);
  item = computed(() => this.itemSig());

  private mdSig = signal('');
  markdown = computed(() => this.mdSig());

  constructor() {
    void this.load();
  }

  private async load() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    const item = await this.content.getItem('writing', slug);
    this.itemSig.set(item);
    if (item) {
      this.mdSig.set(await this.content.getMarkdown('writing', slug));
    }
    this.loadingSig.set(false);
  }
}
