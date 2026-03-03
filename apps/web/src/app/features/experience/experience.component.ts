import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { RevealDirective } from '@en/shared/directives/reveal.directive';
import { SectionHeaderComponent } from '@en/shared/section-header/section-header.component';
import { ResumeService } from '@en/core/services/resume.service';

@Component({
  selector: 'en-experience',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, SectionHeaderComponent],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent {
  private readonly resume = inject(ResumeService);
  readonly experience = this.resume.experience;
}
