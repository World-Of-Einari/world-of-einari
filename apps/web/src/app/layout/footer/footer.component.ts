import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ResumeService } from '../../core/services/resume.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  private readonly resume = inject(ResumeService);

  readonly name = this.resume.name;
  readonly domain = this.resume.domain;
}
