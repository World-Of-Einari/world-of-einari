import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { RevealDirective } from '@en/shared/directives/reveal.directive';
import { SectionHeaderComponent } from '@en/shared/section-header/section-header.component';
import { ResumeService } from '@en/core/services/resume.service';

@Component({
  selector: 'en-projects',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, SectionHeaderComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  private readonly resume = inject(ResumeService);
  readonly projects = this.resume.projects;
}
