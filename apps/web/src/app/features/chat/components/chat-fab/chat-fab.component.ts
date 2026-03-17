import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'en-chat-fab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat-fab.component.html',
  styleUrl: './chat-fab.component.scss',
})
export class ChatFabComponent {
  readonly isOpen = input.required<boolean>();
  readonly hasUnread = input.required<boolean>();
  readonly toggled = output<void>();
}
