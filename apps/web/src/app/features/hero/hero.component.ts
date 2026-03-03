import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ResumeService } from '../../core/services/resume.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  private readonly document = inject(DOCUMENT);
  private readonly resume = inject(ResumeService);

  readonly title = this.resume.title;
  readonly tagline = this.resume.tagline;
  readonly stats = this.resume.stats;

  // Split name into two lines
  readonly nameLine1 = 'Einari';
  readonly nameLine2 = 'Naukkarinen';

  scrollTo(event: Event, id: string): void {
    event.preventDefault();
    this.document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
