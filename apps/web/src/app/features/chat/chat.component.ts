import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  signal,
  computed,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatFabComponent } from './components/chat-fab/chat-fab.component';
import { ChatInputComponent } from './components/chat-input/chat-input.component';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'en-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatFabComponent, ChatInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnDestroy {
  readonly isOpen = signal(false);
  readonly messages = signal<ChatMessage[]>([]);
  readonly inputValue = signal('');
  readonly loading = signal(false);
  readonly hasUnread = signal(false);

  readonly isEmpty = computed(() => this.messages().length === 0);

  private readonly messagesEnd = viewChild<ElementRef<HTMLDivElement>>('messagesEnd');
  private abortController: AbortController | null = null;

  toggle(): void {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      this.hasUnread.set(false);
    }
  }

  close(): void {
    this.isOpen.set(false);
  }

  setInput(value: string): void {
    this.inputValue.set(value);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void this.send();
    }
  }

  async send(): Promise<void> {
    const message = this.inputValue().trim();
    if (!message || this.loading()) return;

    const history = this.messages().map(({ role, content }) => ({ role, content }));

    this.messages.update((msgs) => [...msgs, { role: 'user', content: message }]);
    this.inputValue.set('');
    this.loading.set(true);

    this.messages.update((msgs) => [...msgs, { role: 'assistant', content: '' }]);
    this.scrollToBottom();

    this.abortController = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
        signal: this.abortController.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const token = decoder.decode(value, { stream: true });
        this.messages.update((msgs) => {
          const updated = [...msgs];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: updated[updated.length - 1].content + token,
          };
          return updated;
        });
        this.scrollToBottom();
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      console.error('[chat] error:', err);
      const is429 = err instanceof Error && err.message.includes('429');
      this.messages.update((msgs) => {
        const updated = [...msgs];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: is429
            ? 'Too many messages — please wait a moment before trying again.'
            : 'Something went wrong. Please try again.',
        };
        return updated;
      });
    } finally {
      this.loading.set(false);
      if (!this.isOpen()) this.hasUnread.set(true);
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    const el = this.messagesEnd()?.nativeElement;
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 0);
    }
  }

  ngOnDestroy(): void {
    this.abortController?.abort();
  }
}
