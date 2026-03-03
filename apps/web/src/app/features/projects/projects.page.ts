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
    header {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 14px;
      flex-wrap: wrap;
      margin-bottom: 18px;
    }

    h1 {
      margin: 0;
      font-size: 34px;
      letter-spacing: -0.03em;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
    }

    @media (max-width: 900px) {
      .grid { grid-template-columns: 1fr; }
    }

    mat-card {
      border-radius: var(--radius);
      border: 1px solid var(--border);
      background: var(--surface);
      box-shadow: none;
      transition: transform 160ms ease, border-color 160ms ease;
      cursor: pointer;
    }

    mat-card:hover {
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--brand) 40%, var(--border));
    }

    .title {
      font-weight: 650;
      letter-spacing: -0.01em;
      margin-bottom: 6px;
      font-size: 18px;
    }

    .summary { color: var(--text-2); line-height: 1.55; }
    `
  ],
  template: `
    <header>
      <div>
        <h1>Projects</h1>
        <div class="muted">Case studies and experiments — focused on Angular, platform tooling, and practical AI.</div>
      </div>
    </header>

    @if (loading()) {
      <div class="muted">Loading…</div>
    } @else {
      <div class="grid">
        @for (p of projects(); track p.slug) {
          <a [routerLink]="['/projects', p.slug]" style="text-decoration:none">
            <mat-card>
              <mat-card-content>
                <div class="title">{{ p.title }}</div>
                <div class="summary">{{ p.summary }}</div>
                @if (p.tags?.length) {
                  <div style="height:12px"></div>
                  <mat-chip-set>
                    @for (t of p.tags!; track t) { <mat-chip>{{ t }}</mat-chip> }
                  </mat-chip-set>
                }
              </mat-card-content>
            </mat-card>
          </a>
        }
      </div>
    }
  `
})
export class ProjectsPage {
  private content = inject(ContentService);

  private loadingSig = signal(true);
  loading = computed(() => this.loadingSig());

  private projectsSig = signal<ContentListItem[]>([]);
  projects = computed(() => this.projectsSig());

  constructor() {
    void this.load();
  }

  private async load() {
    const items = await this.content.list('projects');
    this.projectsSig.set(items);
    this.loadingSig.set(false);
  }
}
