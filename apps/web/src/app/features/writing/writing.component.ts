import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { RevealDirective } from '@en/shared/directives/reveal.directive';
import { SectionHeaderComponent } from '@en/shared/section-header/section-header.component';
import { ResumeService } from '@en/core/services/resume.service';
import { ArticleService } from '@en/core/services/article.service';

@Component({
  selector: 'en-writing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, SectionHeaderComponent],
  templateUrl: './writing.component.html',
  styleUrl: './writing.component.scss',
})
export class WritingComponent {
  private readonly artService = inject(ArticleService);
  readonly articles = this.artService.articles;
}
