import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'en-section-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss',
})
export class SectionHeaderComponent {
  readonly label = input.required<string>();
  readonly title = input.required<string>();
  readonly ghost = input.required<string>();
  readonly size = input<'default' | 'large' | 'hero'>('default');
  readonly centered = input<boolean>(false);
}
