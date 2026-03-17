import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ChatFabComponent } from './chat-fab.component';

describe('ChatFabComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatFabComponent],
    }).compileComponents();
  });

  function createComponent(isOpen: boolean, hasUnread: boolean) {
    const fixture = TestBed.createComponent(ChatFabComponent);
    fixture.componentRef.setInput('isOpen', isOpen);
    fixture.componentRef.setInput('hasUnread', hasUnread);
    fixture.detectChanges();
    return fixture;
  }

  it('should create', () => {
    const fixture = createComponent(false, false);
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('snapshots', () => {
    it('should match snapshot when closed without unread', () => {
      const fixture = createComponent(false, false);
      expect(fixture.nativeElement).toMatchSnapshot();
    });

    it('should match snapshot when closed with unread', () => {
      const fixture = createComponent(false, true);
      expect(fixture.nativeElement).toMatchSnapshot();
    });

    it('should match snapshot when open', () => {
      const fixture = createComponent(true, false);
      expect(fixture.nativeElement).toMatchSnapshot();
    });
  });

  describe('button CSS class', () => {
    it('should not have --open modifier when isOpen is false', () => {
      const fixture = createComponent(false, false);
      const btn = fixture.debugElement.query(By.css('.chat-fab'));
      expect(btn.nativeElement.classList.contains('chat-fab--open')).toBe(false);
    });

    it('should have --open modifier when isOpen is true', () => {
      const fixture = createComponent(true, false);
      const btn = fixture.debugElement.query(By.css('.chat-fab'));
      expect(btn.nativeElement.classList.contains('chat-fab--open')).toBe(true);
    });
  });

  describe('icons', () => {
    it('should render the chat icon when closed', () => {
      const fixture = createComponent(false, false);
      const svgs = fixture.debugElement.queryAll(By.css('svg'));
      // Chat icon path
      const path = fixture.debugElement.query(By.css('path'));
      expect(svgs).toHaveLength(1);
      expect(path).toBeTruthy();
    });

    it('should render the close (X) icon when open', () => {
      const fixture = createComponent(true, false);
      const svgs = fixture.debugElement.queryAll(By.css('svg'));
      // Close icon uses <line> elements
      const lines = fixture.debugElement.queryAll(By.css('line'));
      expect(svgs).toHaveLength(1);
      expect(lines).toHaveLength(2);
    });
  });

  describe('unread badge', () => {
    it('should show unread badge when hasUnread is true and isOpen is false', () => {
      const fixture = createComponent(false, true);
      const badge = fixture.debugElement.query(By.css('.chat-fab__unread'));
      expect(badge).toBeTruthy();
    });

    it('should not show unread badge when isOpen is true even if hasUnread is true', () => {
      const fixture = createComponent(true, true);
      const badge = fixture.debugElement.query(By.css('.chat-fab__unread'));
      expect(badge).toBeNull();
    });

    it('should not show unread badge when hasUnread is false', () => {
      const fixture = createComponent(false, false);
      const badge = fixture.debugElement.query(By.css('.chat-fab__unread'));
      expect(badge).toBeNull();
    });
  });

  describe('toggled output', () => {
    it('should emit toggled when button is clicked', () => {
      const fixture = createComponent(false, false);
      let emitted = false;
      fixture.componentInstance.toggled.subscribe(() => (emitted = true));

      const btn = fixture.debugElement.query(By.css('.chat-fab'));
      btn.triggerEventHandler('click', null);

      expect(emitted).toBe(true);
    });

    it('should emit toggle when open state button is clicked', () => {
      const fixture = createComponent(true, false);
      let emitted = false;
      fixture.componentInstance.toggled.subscribe(() => (emitted = true));

      const btn = fixture.debugElement.query(By.css('.chat-fab'));
      btn.triggerEventHandler('click', null);

      expect(emitted).toBe(true);
    });
  });
});
