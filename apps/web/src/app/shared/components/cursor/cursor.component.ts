import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'en-cursor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cursor.component.html',
  styleUrl: './cursor.component.scss',
})
export class CursorComponent implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);

  readonly mouseX = signal(0);
  readonly mouseY = signal(0);
  readonly ringX = signal(0);
  readonly ringY = signal(0);
  readonly hovering = signal(false);

  private animFrame?: number;
  private cleanups: Array<() => void> = [];

  ngOnInit() {
    const doc = this.document;

    const onMove = (e: MouseEvent) => {
      this.mouseX.set(e.clientX);
      this.mouseY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, [data-hover]')) {
        this.hovering.set(true);
      }
    };

    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, [data-hover]')) {
        this.hovering.set(false);
      }
    };

    doc.addEventListener('mousemove', onMove);
    doc.addEventListener('mouseover', onOver);
    doc.addEventListener('mouseout', onOut);

    this.cleanups = [
      () => doc.removeEventListener('mousemove', onMove),
      () => doc.removeEventListener('mouseover', onOver),
      () => doc.removeEventListener('mouseout', onOut),
    ];

    const animate = () => {
      this.ringX.update((x) => x + (this.mouseX() - x) * 0.12);
      this.ringY.update((y) => y + (this.mouseY() - y) * 0.12);
      this.animFrame = requestAnimationFrame(animate);
    };
    this.animFrame = requestAnimationFrame(animate);
  }

  ngOnDestroy() {
    this.cleanups.forEach((fn) => fn());
    if (this.animFrame !== undefined) cancelAnimationFrame(this.animFrame);
  }
}
