import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { ContentService } from '../../core/content.service';
import type { ContentListItem } from '../../core/content.types';

@Component({
  standalone: true,
  imports: [RouterLink, MatCardModule, MatChipsModule],
  styles: [
    `
    header { margin-bottom: 18px; }
    h1 { margin: 0; font-size: 34px; letter-spacing: -0.03em; }

    .list {
      display: grid;
      gap: 12px;
    }

    mat-card {
      border-radius: var(--radius);
      border: 1px solid var(--border);
      background: var(--surface);
      box-shadow: none;
      transition: border-color 160ms ease;
    }

    mat-card:hover {
      border-color: color-mix(in srgb, var(--brand) 40%, var(--border));
    }

    .row {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 14px;
      align-items: start;
    }

    .title { font-weight: 650; letter-spacing: -0.01em; margin-bottom: 6px; }
    .summary { color: var(--text-2); line-height: 1.55; }
    .date { color: var(--text-2); font-size: 12px; white-space: nowrap; margin-top: 2px; }
    `
  ],
  template: `
    <header>
      <h1>Writing</h1>
      <div class="muted">Short notes on Angular, architecture, and building AI features that actually ship.</div>
    </header>

    @if (loading()) {
      <div class="muted">Loading…</div>
    } @else {
      <div class="list">
        @for (w of items(); track w.slug) {
          <a [routerLink]="['/writing', w.slug]" style="text-decoration:none">
            <mat-card>
              <mat-card-content>
                <div class="row">
                  <div>
                    <div class="title">{{ w.title }}</div>
                    <div class="summary">{{ w.summary }}</div>
                    @if (w.tags?.length) {
                      <div style="height:12px"></div>
                      <mat-chip-set>
                        @for (t of w.tags!; track t) { <mat-chip>{{ t }}</mat-chip> }
                      </mat-chip-set>
                    }
                  </div>
                  @if (w.date) { <div class="date">{{ w.date }}</div> }
                </div>
              </mat-card-content>
            </mat-card>
          </a>
        }
      </div>
    }
  `
})
export class WritingPage {
  private content = inject(ContentService);

  private loadingSig = signal(true);
  loading = computed(() => this.loadingSig());

  private itemsSig = signal<ContentListItem[]>([]);
  items = computed(() => this.itemsSig());

  constructor() {
    void this.load();
  }

  private async load() {
    const items = await this.content.list('writing');
    this.itemsSig.set(items);
    this.loadingSig.set(false);
  }
}
