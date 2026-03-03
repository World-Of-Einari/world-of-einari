import { DOCUMENT } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';

import { SectionHeaderComponent } from '@en/shared/section-header/section-header.component';
import { ResumeService } from '@en/core/services/resume.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  private readonly document = inject(DOCUMENT);
  private readonly resume = inject(ResumeService);

  readonly title = this.resume.title;
  readonly tagline = this.resume.tagline;
  readonly stats = this.resume.stats;
  readonly nameParts = computed(() => {
    const parts = this.resume.name().split(' ');
    return {
      first: parts[0],
      last: parts.slice(1).join(' '),
    };
  });

  scrollTo(event: Event, id: string): void {
    event.preventDefault();
    this.document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
