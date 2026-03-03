import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { RevealDirective } from '@en/shared/directives/reveal.directive';
import { SectionHeaderComponent } from '@en/shared/section-header/section-header.component';
import { ResumeService } from '@en/core/services/resume.service';

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, SectionHeaderComponent],
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
