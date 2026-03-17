import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';

import { ChatMessage } from '../../types/chat-message.interface';

@Component({
  selector: 'en-chat-messages',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat-messages.component.html',
  styleUrl: './chat-messages.component.scss',
})
export class ChatMessagesComponent {
  readonly messages = input.required<ChatMessage[]>();
  readonly loading = input.required<boolean>();
  readonly suggestionSelect = output<string>();

  private readonly messagesEnd = viewChild<ElementRef<HTMLDivElement>>('messagesEnd');

  scrollToBottom(): void {
    const el = this.messagesEnd()?.nativeElement;
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 0);
    }
  }
}
