import {
  Directive,
  ElementRef,
  OnInit,
  OnDestroy,
  inject,
  input,
  signal,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Adds a scroll-triggered reveal animation to any host element via IntersectionObserver.
// Animation styles live in global styles.scss under .reveal / .reveal--visible.
@Directive({
  selector: '[enReveal]',
  standalone: true,
  host: {
    '[class.reveal]': 'true',
    '[class.reveal--visible]': 'visible()',
  },
})
export class RevealDirective implements OnInit, OnDestroy {
  readonly delay = input<number>(0, { alias: 'enRevealDelay' });

  protected readonly visible = signal(false);

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;
  private timeoutIds: ReturnType<typeof setTimeout>[] = [];

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      this.visible.set(true);
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (this.delay() > 0) {
              const id = setTimeout(() => this.visible.set(true), this.delay());
              this.timeoutIds.push(id);
            } else {
              this.visible.set(true);
            }
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.timeoutIds.forEach(clearTimeout);
    this.observer?.disconnect();
  }
}
