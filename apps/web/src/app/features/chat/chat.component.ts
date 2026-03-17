import { ChangeDetectionStrategy, Component, OnDestroy, signal, viewChild } from '@angular/core';
import { ChatMessagesComponent } from './components/chat-messages/chat-messages.component';
import { ChatFabComponent } from './components/chat-fab/chat-fab.component';
import { ChatInputComponent } from './components/chat-input/chat-input.component';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'en-chat',
  standalone: true,
  imports: [ChatFabComponent, ChatMessagesComponent, ChatInputComponent],
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

  private readonly chatMessages = viewChild(ChatMessagesComponent);
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

  async send(): Promise<void> {
    const message = this.inputValue().trim();
    if (!message || this.loading()) return;

    const history = this.messages().map(({ role, content }) => ({ role, content }));

    this.messages.update((msgs) => [...msgs, { role: 'user', content: message }]);
    this.inputValue.set('');
    this.loading.set(true);

    this.messages.update((msgs) => [...msgs, { role: 'assistant', content: '' }]);
    this.chatMessages()?.scrollToBottom();

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
        this.chatMessages()?.scrollToBottom();
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
      this.chatMessages()?.scrollToBottom();
    }
  }

  ngOnDestroy(): void {
    this.abortController?.abort();
  }
}
