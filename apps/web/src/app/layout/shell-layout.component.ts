import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  styles: [
    `
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 20;
      background: color-mix(in srgb, var(--bg) 85%, transparent);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border);
    }

    .toolbar-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: var(--brand);
      box-shadow: 0 0 0 1px rgba(99,102,241,.25), 0 8px 18px rgba(99,102,241,.18);
    }

    nav {
      display: flex;
      gap: 6px;
      align-items: center;
    }

    a[mat-button] {
      color: var(--text-2);
      border-radius: 999px;
    }

    a[mat-button].active {
      color: var(--text);
      background: color-mix(in srgb, var(--surface) 80%, transparent);
      border: 1px solid var(--border);
    }

    main {
      padding: 40px 0 64px;
    }

    footer {
      padding: 36px 0;
      border-top: 1px solid var(--border);
      color: var(--text-2);
    }

    .footer-inner {
      display: flex;
      gap: 16px;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
    }

    .links {
      display: flex;
      gap: 14px;
      align-items: center;
      flex-wrap: wrap;
    }

    .pill {
      border: 1px solid var(--border);
      background: var(--surface);
      padding: 6px 10px;
      border-radius: 999px;
      font-size: 12px;
    }
    `
  ],
  template: `
    <mat-toolbar class="toolbar" color="primary">
      <div class="container toolbar-inner">
        <a class="brand" routerLink="/" aria-label="Home">
          <span class="dot" aria-hidden="true"></span>
          <span>einarinau.com</span>
          <span class="pill">Angular • Material 3</span>
        </a>

        <nav aria-label="Primary">
          <a mat-button routerLink="/projects" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Projects</a>
          <a mat-button routerLink="/writing" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Writing</a>
          <a mat-button routerLink="/ai" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">AI Lab</a>
          <a mat-button routerLink="/about" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">About</a>
        </nav>
      </div>
    </mat-toolbar>

    <main class="container">
      <router-outlet />
    </main>

    <footer>
      <div class="container footer-inner">
        <div>© {{year()}} Einari Naukkarinen</div>
        <div class="links">
          <a class="muted" href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
          <a class="muted" href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a class="muted" href="mailto:hello@einarinau.com">hello@einarinau.com</a>
        </div>
      </div>
    </footer>
  `
})
export class ShellLayoutComponent {
  private now = signal(new Date());
  year = computed(() => this.now().getFullYear());
}
