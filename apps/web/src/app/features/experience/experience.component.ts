import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ResumeService } from '../../core/services/resume.service';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-experience',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent {
  private readonly resume = inject(ResumeService);
  readonly experience = this.resume.experience;
}
