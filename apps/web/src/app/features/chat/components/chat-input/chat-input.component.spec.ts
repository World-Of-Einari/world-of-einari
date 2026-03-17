import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ChatInputComponent } from './chat-input.component';

describe('ChatInputComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatInputComponent],
    }).compileComponents();
  });

  function createComponent(value: string, loading: boolean) {
    const fixture = TestBed.createComponent(ChatInputComponent);
    fixture.componentRef.setInput('value', value);
    fixture.componentRef.setInput('loading', loading);
    fixture.detectChanges();
    return fixture;
  }

  it('should create', () => {
    const fixture = createComponent('', false);
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('snapshots', () => {
    it('should match snapshot with empty value and not loading', () => {
      const fixture = createComponent('', false);
      expect(fixture.nativeElement).toMatchSnapshot();
    });

    it('should match snapshot with value and not loading', () => {
      const fixture = createComponent('Hello world', false);
      expect(fixture.nativeElement).toMatchSnapshot();
    });

    it('should match snapshot when loading', () => {
      const fixture = createComponent('Hello world', true);
      expect(fixture.nativeElement).toMatchSnapshot();
    });
  });

  describe('textarea', () => {
    it('should display the current value', () => {
      const fixture = createComponent('test input', false);
      const textarea = fixture.debugElement.query(By.css('.chat-input__field'));
      expect(textarea.nativeElement.value).toBe('test input');
    });

    it('should be disabled when loading is true', () => {
      const fixture = createComponent('', true);
      const textarea = fixture.debugElement.query(By.css('.chat-input__field'));
      expect(textarea.nativeElement.disabled).toBe(true);
    });

    it('should be enabled when loading is false', () => {
      const fixture = createComponent('', false);
      const textarea = fixture.debugElement.query(By.css('.chat-input__field'));
      expect(textarea.nativeElement.disabled).toBe(false);
    });

    it('should emit valueChange on input event', () => {
      const fixture = createComponent('', false);
      let emittedValue: string | undefined;
      fixture.componentInstance.valueChange.subscribe((v: string) => (emittedValue = v));

      const textarea = fixture.debugElement.query(By.css('.chat-input__field'));
      textarea.nativeElement.value = 'new text';
      textarea.triggerEventHandler('input', { target: textarea.nativeElement });

      expect(emittedValue).toBe('new text');
    });
  });

  describe('send button', () => {
    it('should be disabled when loading is true', () => {
      const fixture = createComponent('hello', true);
      const btn = fixture.debugElement.query(By.css('.chat-input__send'));
      expect(btn.nativeElement.disabled).toBe(true);
    });

    it('should be disabled when value is empty', () => {
      const fixture = createComponent('', false);
      const btn = fixture.debugElement.query(By.css('.chat-input__send'));
      expect(btn.nativeElement.disabled).toBe(true);
    });

    it('should be disabled when value is only whitespace', () => {
      const fixture = createComponent('   ', false);
      const btn = fixture.debugElement.query(By.css('.chat-input__send'));
      expect(btn.nativeElement.disabled).toBe(true);
    });

    it('should be enabled when value is non-empty and not loading', () => {
      const fixture = createComponent('hello', false);
      const btn = fixture.debugElement.query(By.css('.chat-input__send'));
      expect(btn.nativeElement.disabled).toBe(false);
    });

    it('should emit send when clicked', () => {
      const fixture = createComponent('hello', false);
      let emitted = false;
      fixture.componentInstance.send.subscribe(() => (emitted = true));

      const btn = fixture.debugElement.query(By.css('.chat-input__send'));
      btn.triggerEventHandler('click', null);

      expect(emitted).toBe(true);
    });
  });

  describe('onKeyDown()', () => {
    it('should emit send and prevent default on Enter without Shift', () => {
      const fixture = createComponent('hello', false);
      let emitted = false;
      fixture.componentInstance.send.subscribe(() => (emitted = true));

      const event = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: false });
      jest.spyOn(event, 'preventDefault');
      fixture.componentInstance.onKeyDown(event);

      expect(emitted).toBe(true);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should not emit send on Shift+Enter', () => {
      const fixture = createComponent('hello', false);
      let emitted = false;
      fixture.componentInstance.send.subscribe(() => (emitted = true));

      const event = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true });
      fixture.componentInstance.onKeyDown(event);

      expect(emitted).toBe(false);
    });

    it('should not emit send on other keys', () => {
      const fixture = createComponent('hello', false);
      let emitted = false;
      fixture.componentInstance.send.subscribe(() => (emitted = true));

      const event = new KeyboardEvent('keydown', { key: 'a' });
      fixture.componentInstance.onKeyDown(event);

      expect(emitted).toBe(false);
    });

    it('should trigger onKeyDown from textarea keydown event', () => {
      const fixture = createComponent('hello', false);
      jest.spyOn(fixture.componentInstance, 'onKeyDown');

      const textarea = fixture.debugElement.query(By.css('.chat-input__field'));
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      textarea.triggerEventHandler('keydown', event);

      expect(fixture.componentInstance.onKeyDown).toHaveBeenCalledWith(event);
    });
  });
});
