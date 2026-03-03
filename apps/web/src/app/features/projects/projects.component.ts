import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ResumeService } from '../../core/services/resume.service';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-projects',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  private readonly resume = inject(ResumeService);
  readonly projects = this.resume.projects;
}
