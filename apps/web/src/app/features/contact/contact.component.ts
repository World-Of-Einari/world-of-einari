import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { RevealDirective } from '@en/shared/directives/reveal.directive';
import { SectionHeaderComponent } from '@en/shared/section-header/section-header.component';
import { ResumeService } from '@en/core/services/resume.service';

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
