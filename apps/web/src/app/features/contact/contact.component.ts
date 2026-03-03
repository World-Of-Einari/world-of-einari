import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ResumeService } from '../../core/services/resume.service';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { SectionHeaderComponent } from '@en/shared/section-header/section-header.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, SectionHeaderComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  private readonly resume = inject(ResumeService);

  readonly email = this.resume.email;
  readonly socialLinks = this.resume.socialLinks;
}
