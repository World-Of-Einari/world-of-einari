import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { ContentService } from '../../core/content.service';
import { MarkdownComponent } from '../../shared/markdown/markdown.component';
import type { ContentListItem } from '../../core/content.types';

@Component({
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatChipsModule, MarkdownComponent],
  styles: [
    `
    .top {
      display: flex;
      align-items: start;
      justify-content: space-between;
      gap: 14px;
      flex-wrap: wrap;
      margin-bottom: 14px;
    }

    h1 { margin: 0; letter-spacing: -0.03em; }
    .summary { color: var(--text-2); margin-top: 8px; max-width: 72ch; }

    .meta {
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
      color: var(--text-2);
      font-size: 13px;
      margin-top: 10px;
    }

    .page {
      padding: 18px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--surface);
    }
    `
  ],
  template: `
    <div class="top">
      <a mat-button routerLink="/projects">← Projects</a>
    </div>

    @if (loading()) {
      <div class="muted">Loading…</div>
    } @else {
      @if (item(); as it) {
        <div style="margin-bottom: 16px;">
          <h1>{{ it.title }}</h1>
          <div class="summary">{{ it.summary }}</div>
          <div class="meta">
            @if (it.stack?.length) { <span>Stack:</span> }
            @if (it.stack?.length) {
              <mat-chip-set>
                @for (s of it.stack!; track s) { <mat-chip>{{ s }}</mat-chip> }
              </mat-chip-set>
            }
          </div>
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
export class ProjectDetailPage {
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
    const item = await this.content.getItem('projects', slug);
    this.itemSig.set(item);
    if (item) {
      this.mdSig.set(await this.content.getMarkdown('projects', slug));
    }
    this.loadingSig.set(false);
  }
}
