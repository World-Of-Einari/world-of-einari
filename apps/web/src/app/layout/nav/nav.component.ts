import {
  Component,
  ChangeDetectionStrategy,
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
export class NavComponent implements OnDestroy {
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
    { href: 'writing', label: 'Writing' },
    { href: 'contact', label: 'Contact' },
  ];

  private readonly sectionIds = ['hero', ...this.navLinks.map((l) => l.href)];

  private readonly onScroll = () => {
    this.scrolled.set(window.scrollY > 40);
    this.updateActiveSection();
  };

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  private updateActiveSection(): void {
    const threshold = window.innerHeight * 0.35;
    for (let i = this.sectionIds.length - 1; i >= 0; i--) {
      const el = this.document.getElementById(this.sectionIds[i]);
      if (el && el.getBoundingClientRect().top <= threshold) {
        this.activeSection.set(this.sectionIds[i]);
        return;
      }
    }
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.removeEventListener('scroll', this.onScroll);
  }

  scrollTo(event: Event, id: string): void {
    event.preventDefault();
    this.document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
