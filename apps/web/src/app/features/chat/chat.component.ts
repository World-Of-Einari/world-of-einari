import { ChangeDetectionStrategy, Component, OnDestroy, signal, viewChild } from '@angular/core';
import { ChatMessagesComponent } from './components/chat-messages/chat-messages.component';
import { ChatFabComponent } from './components/chat-fab/chat-fab.component';
import { ChatInputComponent } from './components/chat-input/chat-input.component';
import { ChatMessage } from './types/chat-message.interface';
import { ContactFormData } from './components/chat-contact-form/chat-contact-form.component';

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

  toggle() {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      this.hasUnread.set(false);
    }
  }

  close() {
    this.isOpen.set(false);
  }

  async send(overrideMessage?: string, options: { hidden?: boolean } = {}) {
    const message = (overrideMessage ?? this.inputValue()).trim();
    if (!message || this.loading()) return;

    const history = this.messages()
      .filter((m) => m.role !== 'contact_form')
      .map(({ role, content }) => ({ role: role as 'user' | 'assistant', content }));

    if (!options.hidden) {
      this.messages.update((msgs) => [...msgs, { role: 'user', content: message }]);
    }

    if (!overrideMessage) {
      this.inputValue.set('');
    }

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

      // Check for tool action after stream completes
      const toolAction = response.headers.get('X-Tool-Action');
      if (toolAction === 'show_contact_form') {
        this.messages.update((msgs) => [
          ...msgs.slice(0, -1),
          { role: 'assistant', content: msgs[msgs.length - 1].content },
          { role: 'contact_form', content: '' },
        ]);
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

  sendSuggestion(suggestion: string) {
    if (suggestion === 'get_in_touch') {
      this.messages.update((msgs) => [...msgs, { role: 'contact_form', content: '' }]);
      return;
    }
    this.inputValue.set(suggestion);
    this.send();
  }

  async submitContact(data: ContactFormData) {
    await this.send(JSON.stringify(data), { hidden: true });
  }

  ngOnDestroy() {
    this.abortController?.abort();
  }
}
