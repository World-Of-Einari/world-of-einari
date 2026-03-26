import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';

import { ChatMessage } from '../../types/chat-message.interface';
import {
  ChatContactFormComponent,
  ContactFormData,
} from '../chat-contact-form/chat-contact-form.component';

@Component({
  selector: 'en-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrl: './chat-messages.component.scss',
  imports: [ChatContactFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ChatMessagesComponent {
  readonly messages = input.required<ChatMessage[]>();
  readonly loading = input.required<boolean>();
  readonly suggestionSelect = output<string>();
  readonly contactSubmit = output<ContactFormData>();

  private readonly messagesEnd = viewChild<ElementRef<HTMLDivElement>>('messagesEnd');

  scrollToBottom(): void {
    const el = this.messagesEnd()?.nativeElement;
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 0);
    }
  }
}
