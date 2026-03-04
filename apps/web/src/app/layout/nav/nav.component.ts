import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  inject,
  signal,
  PLATFORM_ID,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ResumeService } from '@en/core/services/resume.service';

@Component({
  selector: 'en-nav',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly resume = inject(ResumeService);

  readonly initials = this.resume.initials;
  readonly scrolled = signal(false);
  readonly activeSection = signal<string>('hero');

  readonly navLinks = [
    { href: 'about', label: 'About' },
    { href: 'experience', label: 'Experience' },
    { href: 'projects', label: 'Projects' },
    { href: 'contact', label: 'Contact' },
  ];

  private readonly onScroll = () => this.scrolled.set(window.scrollY > 40);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    window.addEventListener('scroll', this.onScroll, { passive: true });

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.activeSection.set(entry.target.id);
          }
        });
      },
      {
        // fires when a section crosses the upper 20% of the viewport
        rootMargin: '-20% 0px -70% 0px',
      }
    );

    const sectionIds = ['hero', ...this.navLinks.map((l) => l.href)];
    sectionIds.forEach((id) => {
      const el = this.document.getElementById(id);
      if (el) this.observer!.observe(el);
    });
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.removeEventListener('scroll', this.onScroll);
    this.observer?.disconnect();
  }

  scrollTo(event: Event, id: string): void {
    event.preventDefault();
    this.document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
