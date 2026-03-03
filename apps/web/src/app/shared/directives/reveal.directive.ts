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

// Adds reveal animation to an element when it enters the viewport.
// It uses IntersectionObserver to detect when the element is visible.
// Adds CSS classes 'reveal' and 'reveal--visible' to control animation states.
@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: {
    '[class.reveal]': 'true',
    '[class.reveal--visible]': 'visible()',
  },
})
export class RevealDirective implements OnInit, OnDestroy {
  readonly delay = input<number>(0, { alias: 'appRevealDelay' });

  protected readonly visible = signal(false);

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      this.visible.set(true);
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => this.visible.set(true), this.delay());
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
