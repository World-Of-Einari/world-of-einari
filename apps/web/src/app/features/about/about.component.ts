import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ResumeService } from '../../core/services/resume.service';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  private readonly resume = inject(ResumeService);

  readonly paragraphs = this.resume.aboutParagraphs;
  readonly skills = this.resume.skills;

  isFeatured(group: ReturnType<typeof this.resume.skills>[number], tag: string): boolean {
    return group.featured?.includes(tag) ?? false;
  }
}
