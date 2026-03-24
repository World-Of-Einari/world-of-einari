import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ChatComponent } from './chat.component';

type GlobalWithFetch = typeof globalThis & { fetch: jest.Mock };

function mockFetch(response: Response): jest.Mock {
  const mock = jest.fn().mockResolvedValue(response);
  (globalThis as GlobalWithFetch).fetch = mock;
  return mock;
}

function mockFetchRejected(error: unknown): jest.Mock {
  const mock = jest.fn().mockRejectedValue(error);
  (globalThis as GlobalWithFetch).fetch = mock;
  return mock;
}

function makeStreamResponse(chunks: string[]): Response {
  const encoder = new TextEncoder();
  const encoded = chunks.map((c) => encoder.encode(c));
  let index = 0;
  const reader = {
    read: jest.fn().mockImplementation(() => {
      if (index < encoded.length) {
        return Promise.resolve({ done: false, value: encoded[index++] });
      }
      return Promise.resolve({ done: true, value: undefined });
    }),
  };
  return {
    ok: true,
    status: 200,
    body: { getReader: () => reader },
  } as unknown as Response;
}

function makeErrorResponse(status: number): Response {
  return { ok: false, status, body: null } as unknown as Response;
}

describe('ChatComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  afterEach(() => {
    delete (globalThis as Partial<GlobalWithFetch>).fetch;
  });

  function createComponent() {
    const fixture = TestBed.createComponent(ChatComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('should create', () => {
    const fixture = createComponent();
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('toggle()', () => {
    it('should open when closed', () => {
      const { componentInstance: c } = createComponent();
      expect(c.isOpen()).toBe(false);
      c.toggle();
      expect(c.isOpen()).toBe(true);
    });

    it('should close when open', () => {
      const { componentInstance: c } = createComponent();
      c.toggle();
      c.toggle();
      expect(c.isOpen()).toBe(false);
    });

    it('should clear hasUnread when opening', () => {
      const { componentInstance: c } = createComponent();
      c.hasUnread.set(true);
      c.toggle();
      expect(c.hasUnread()).toBe(false);
    });

    it('should not clear hasUnread when closing', () => {
      const { componentInstance: c } = createComponent();
      c.toggle(); // open
      c.hasUnread.set(true);
      c.toggle(); // close
      expect(c.hasUnread()).toBe(true);
    });
  });

  describe('close()', () => {
    it('should set isOpen to false', () => {
      const { componentInstance: c } = createComponent();
      c.toggle();
      expect(c.isOpen()).toBe(true);
      c.close();
      expect(c.isOpen()).toBe(false);
    });

    it('should be a no-op when already closed', () => {
      const { componentInstance: c } = createComponent();
      c.close();
      expect(c.isOpen()).toBe(false);
    });
  });

  describe('send()', () => {
    it('should do nothing when inputValue is empty', async () => {
      const fetchMock = mockFetch(makeStreamResponse([]));
      const { componentInstance: c } = createComponent();
      c.inputValue.set('');
      await c.send();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('should do nothing when inputValue is only whitespace', async () => {
      const fetchMock = mockFetch(makeStreamResponse([]));
      const { componentInstance: c } = createComponent();
      c.inputValue.set('   ');
      await c.send();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('should do nothing when already loading', async () => {
      const fetchMock = mockFetch(makeStreamResponse([]));
      const { componentInstance: c } = createComponent();
      c.inputValue.set('hello');
      c.loading.set(true);
      await c.send();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('should add user message and clear input', async () => {
      mockFetch(makeStreamResponse([]));
      const { componentInstance: c } = createComponent();
      c.inputValue.set('hello');

      await c.send();

      expect(c.messages()[0]).toEqual({ role: 'user', content: 'hello' });
      expect(c.inputValue()).toBe('');
    });

    it('should set loading to true during fetch and false after', async () => {
      let resolveResponse!: (r: Response) => void;
      const pendingFetch = jest.fn().mockReturnValue(new Promise<Response>((res) => (resolveResponse = res)));
      (globalThis as GlobalWithFetch).fetch = pendingFetch;

      const { componentInstance: c } = createComponent();
      c.inputValue.set('hello');

      const sendPromise = c.send();
      expect(c.loading()).toBe(true);

      resolveResponse(makeStreamResponse(['reply']));
      await sendPromise;
      expect(c.loading()).toBe(false);
    });

    it('should add empty assistant message placeholder before streaming', async () => {
      mockFetch(makeStreamResponse([]));
      const { componentInstance: c } = createComponent();
      c.inputValue.set('hello');

      await c.send();

      expect(c.messages()).toHaveLength(2);
      expect(c.messages()[1]).toEqual({ role: 'assistant', content: '' });
    });

    it('should stream tokens into the assistant message', async () => {
      mockFetch(makeStreamResponse(['Hello', ' world']));
      const { componentInstance: c } = createComponent();
      c.inputValue.set('hi');

      await c.send();

      expect(c.messages()[1].content).toBe('Hello world');
    });

    it('should pass message history to the API', async () => {
      const fetchMock = mockFetch(makeStreamResponse([]));
      const { componentInstance: c } = createComponent();
      c.messages.set([
        { role: 'user', content: 'first' },
        { role: 'assistant', content: 'response' },
      ]);
      c.inputValue.set('second');

      await c.send();

      expect(fetchMock).toHaveBeenCalledWith(
        '/api/chat',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            message: 'second',
            history: [
              { role: 'user', content: 'first' },
              { role: 'assistant', content: 'response' },
            ],
          }),
        }),
      );
    });

    it('should set generic error message on fetch failure', async () => {
      mockFetchRejected(new Error('Network error'));
      const { componentInstance: c } = createComponent();
      c.inputValue.set('hello');

      await c.send();

      expect(c.messages()[1].content).toBe('Something went wrong. Please try again.');
    });

    it('should set 429 error message when error includes 429', async () => {
      mockFetchRejected(new Error('Request failed: 429'));
      const { componentInstance: c } = createComponent();
      c.inputValue.set('hello');

      await c.send();

      expect(c.messages()[1].content).toBe('Too many messages — please wait a moment before trying again.');
    });

    it('should set error message when response is not ok', async () => {
      mockFetch(makeErrorResponse(500));
      const { componentInstance: c } = createComponent();
      c.inputValue.set('hello');

      await c.send();

      expect(c.messages()[1].content).toBe('Something went wrong. Please try again.');
    });

    it('should silently ignore AbortError and leave assistant message empty', async () => {
      mockFetchRejected(new DOMException('Aborted', 'AbortError'));
      const { componentInstance: c } = createComponent();
      c.inputValue.set('hello');

      await c.send();

      expect(c.messages()[1].content).toBe('');
    });

    it('should set hasUnread when chat is closed after receiving a response', async () => {
      mockFetch(makeStreamResponse(['reply']));
      const { componentInstance: c } = createComponent();
      c.inputValue.set('hello');
      // isOpen defaults to false

      await c.send();

      expect(c.hasUnread()).toBe(true);
    });

    it('should not set hasUnread when chat is open', async () => {
      mockFetch(makeStreamResponse(['reply']));
      const { componentInstance: c } = createComponent();
      c.inputValue.set('hello');
      c.isOpen.set(true);

      await c.send();

      expect(c.hasUnread()).toBe(false);
    });
  });

  describe('sendSuggestion()', () => {
    it('should send the suggestion as a user message', async () => {
      mockFetch(makeStreamResponse([]));
      const { componentInstance: c } = createComponent();
      const sendSpy = jest.spyOn(c, 'send');

      await c.sendSuggestion('Tell me about yourself');

      // send() clears inputValue after use; verify the suggestion reached the messages list
      expect(sendSpy).toHaveBeenCalled();
      expect(c.messages()[0]).toEqual({ role: 'user', content: 'Tell me about yourself' });
    });
  });

  describe('ngOnDestroy()', () => {
    it('should abort the active request on destroy', () => {
      const { componentInstance: c } = createComponent();
      const abortSpy = jest.fn();
      (c as unknown as { abortController: AbortController }).abortController = {
        abort: abortSpy,
      } as unknown as AbortController;

      c.ngOnDestroy();

      expect(abortSpy).toHaveBeenCalled();
    });

    it('should not throw when there is no active request', () => {
      const { componentInstance: c } = createComponent();
      expect(() => c.ngOnDestroy()).not.toThrow();
    });
  });
});
