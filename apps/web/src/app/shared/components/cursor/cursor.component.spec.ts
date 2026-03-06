import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CursorComponent } from './cursor.component';

describe('CursorComponent', () => {
  beforeEach(async () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 0);
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);

    await TestBed.configureTestingModule({
      imports: [CursorComponent],
    }).compileComponents();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CursorComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should match snapshot', () => {
    const fixture = TestBed.createComponent(CursorComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should initialise position signals to 0', () => {
    const fixture = TestBed.createComponent(CursorComponent);
    const { mouseX, mouseY, ringX, ringY } = fixture.componentInstance;
    expect(mouseX()).toBe(0);
    expect(mouseY()).toBe(0);
    expect(ringX()).toBe(0);
    expect(ringY()).toBe(0);
  });

  it('should initialise hovering signal to false', () => {
    const fixture = TestBed.createComponent(CursorComponent);
    expect(fixture.componentInstance.hovering()).toBe(false);
  });

  it('should update mouseX/mouseY on document mousemove', () => {
    const fixture = TestBed.createComponent(CursorComponent);
    fixture.detectChanges();

    const doc = fixture.componentInstance['document'] as Document;
    doc.dispatchEvent(new MouseEvent('mousemove', { clientX: 120, clientY: 240 }));

    expect(fixture.componentInstance.mouseX()).toBe(120);
    expect(fixture.componentInstance.mouseY()).toBe(240);
  });

  it('should set hovering to true on mouseover of an anchor', () => {
    const fixture = TestBed.createComponent(CursorComponent);
    fixture.detectChanges();

    const doc = fixture.componentInstance['document'] as Document;
    const anchor = doc.createElement('a');
    doc.body.appendChild(anchor);

    // Dispatch on the element so it bubbles — e.target will be the anchor (has closest())
    anchor.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

    expect(fixture.componentInstance.hovering()).toBe(true);
    doc.body.removeChild(anchor);
  });

  it('should set hovering to false on mouseout of an anchor', () => {
    const fixture = TestBed.createComponent(CursorComponent);
    fixture.componentInstance.hovering.set(true);
    fixture.detectChanges();

    const doc = fixture.componentInstance['document'] as Document;
    const anchor = doc.createElement('a');
    doc.body.appendChild(anchor);

    anchor.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));

    expect(fixture.componentInstance.hovering()).toBe(false);
    doc.body.removeChild(anchor);
  });

  it('should bind cursor dot position via style bindings', () => {
    const fixture = TestBed.createComponent(CursorComponent);
    fixture.componentInstance.mouseX.set(50);
    fixture.componentInstance.mouseY.set(75);
    fixture.detectChanges();

    const dot = fixture.debugElement.query(By.css('.cursor'));
    expect(dot.nativeElement.style.left).toBe('50px');
    expect(dot.nativeElement.style.top).toBe('75px');
  });

  it('should apply cursor--hovering class when hovering is true', () => {
    const fixture = TestBed.createComponent(CursorComponent);
    fixture.componentInstance.hovering.set(true);
    fixture.detectChanges();

    const dot = fixture.debugElement.query(By.css('.cursor'));
    const ring = fixture.debugElement.query(By.css('.cursor__ring'));
    expect(dot.nativeElement.classList).toContain('cursor--hovering');
    expect(ring.nativeElement.classList).toContain('cursor__ring--hovering');
  });

  it('should cancel animation frame and remove listeners on destroy', () => {
    const fixture = TestBed.createComponent(CursorComponent);
    fixture.detectChanges();
    fixture.destroy();

    expect(cancelAnimationFrame).toHaveBeenCalled();
  });
});
