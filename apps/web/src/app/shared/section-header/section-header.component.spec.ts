import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SectionHeaderComponent } from './section-header.component';

function createComponent(inputs: {
  label: string;
  title: string;
  ghost: string;
  size?: 'default' | 'large' | 'hero';
  centered?: boolean;
}) {
  const fixture = TestBed.createComponent(SectionHeaderComponent);
  fixture.componentRef.setInput('label', inputs.label);
  fixture.componentRef.setInput('title', inputs.title);
  fixture.componentRef.setInput('ghost', inputs.ghost);
  if (inputs.size !== undefined) fixture.componentRef.setInput('size', inputs.size);
  if (inputs.centered !== undefined) fixture.componentRef.setInput('centered', inputs.centered);
  fixture.detectChanges();
  return fixture;
}

describe('SectionHeaderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionHeaderComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = createComponent({ label: 'L', title: 'T', ghost: 'G' });
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should match snapshot with default inputs', () => {
    const fixture = createComponent({ label: 'Projects', title: 'Selected', ghost: 'work' });
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should render label, title and ghost text', () => {
    const fixture = createComponent({ label: 'About', title: 'Bridging tech', ghost: 'and people' });
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.section-header__label')?.textContent?.trim()).toBe('About');
    expect(el.querySelector('.section-header__title')?.textContent).toContain('Bridging tech');
    expect(el.querySelector('.section-header__ghost')?.textContent?.trim()).toBe('and people');
  });

  it('should apply --large modifier when size is large', () => {
    const fixture = createComponent({ label: 'L', title: 'T', ghost: 'G', size: 'large' });
    const title = fixture.debugElement.query(By.css('.section-header__title'));
    expect(title.nativeElement.classList).toContain('section-header__title--large');
    expect(title.nativeElement.classList).not.toContain('section-header__title--hero');
  });

  it('should apply --hero modifier when size is hero', () => {
    const fixture = createComponent({ label: 'L', title: 'T', ghost: 'G', size: 'hero' });
    const title = fixture.debugElement.query(By.css('.section-header__title'));
    expect(title.nativeElement.classList).toContain('section-header__title--hero');
  });

  it('should not apply size modifiers when size is default', () => {
    const fixture = createComponent({ label: 'L', title: 'T', ghost: 'G', size: 'default' });
    const title = fixture.debugElement.query(By.css('.section-header__title'));
    expect(title.nativeElement.classList).not.toContain('section-header__title--large');
    expect(title.nativeElement.classList).not.toContain('section-header__title--hero');
  });

  it('should apply --centered modifiers when centered is true', () => {
    const fixture = createComponent({ label: 'L', title: 'T', ghost: 'G', centered: true });
    const label = fixture.debugElement.query(By.css('.section-header__label'));
    const title = fixture.debugElement.query(By.css('.section-header__title'));
    expect(label.nativeElement.classList).toContain('section-header__label--centered');
    expect(title.nativeElement.classList).toContain('section-header__title--centered');
  });

  it('should not apply --centered modifiers when centered is false', () => {
    const fixture = createComponent({ label: 'L', title: 'T', ghost: 'G', centered: false });
    const label = fixture.debugElement.query(By.css('.section-header__label'));
    expect(label.nativeElement.classList).not.toContain('section-header__label--centered');
  });
});