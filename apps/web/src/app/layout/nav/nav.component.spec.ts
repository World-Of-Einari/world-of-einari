import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

import { ResumeService } from '@en/core/services/resume.service';
import { NavComponent } from './nav.component';

describe('NavComponent', () => {
  let mockResume: { initials: ReturnType<typeof signal<string>> };

  beforeEach(async () => {
    mockResume = { initials: signal('EN') };

    await TestBed.configureTestingModule({
      imports: [NavComponent],
    })
      .overrideProvider(ResumeService, { useValue: mockResume })
      .compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(NavComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should match snapshot', () => {
    const fixture = TestBed.createComponent(NavComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should render the initials in the logo', () => {
    const fixture = TestBed.createComponent(NavComponent);
    fixture.detectChanges();
    const logo = fixture.debugElement.query(By.css('.nav__logo'));
    expect(logo.nativeElement.textContent).toContain('EN');
  });

  it('should render all nav links', () => {
    const fixture = TestBed.createComponent(NavComponent);
    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('.nav__link'));
    const { navLinks } = fixture.componentInstance;
    expect(links).toHaveLength(navLinks.length);
    links.forEach((link, i) => {
      expect(link.nativeElement.textContent.trim()).toBe(navLinks[i].label);
      expect(link.nativeElement.getAttribute('href')).toBe(`#${navLinks[i].href}`);
    });
  });

  it('should apply --active class to the link matching activeSection', () => {
    const fixture = TestBed.createComponent(NavComponent);
    fixture.componentInstance.activeSection.set('experience');
    fixture.detectChanges();

    const links = fixture.debugElement.queryAll(By.css('.nav__link'));
    const active = links.filter((l) => l.nativeElement.classList.contains('nav__link--active'));
    expect(active).toHaveLength(1);
    expect(active[0].nativeElement.getAttribute('href')).toBe('#experience');
  });

  it('should apply nav--scrolled class when scrolled signal is true', () => {
    const fixture = TestBed.createComponent(NavComponent);
    fixture.componentInstance.scrolled.set(true);
    fixture.detectChanges();

    const nav = fixture.debugElement.query(By.css('.nav'));
    expect(nav.nativeElement.classList).toContain('nav--scrolled');
  });

  it('should not apply nav--scrolled class when scrolled signal is false', () => {
    const fixture = TestBed.createComponent(NavComponent);
    fixture.detectChanges();

    const nav = fixture.debugElement.query(By.css('.nav'));
    expect(nav.nativeElement.classList).not.toContain('nav--scrolled');
  });

  it('should call scrollIntoView and prevent default when scrollTo is invoked', () => {
    const fixture = TestBed.createComponent(NavComponent);
    fixture.detectChanges();

    const doc = TestBed.inject(DOCUMENT);
    const mockEl = { scrollIntoView: jest.fn() } as unknown as HTMLElement;
    jest.spyOn(doc, 'getElementById').mockReturnValue(mockEl);

    const event = new MouseEvent('click');
    jest.spyOn(event, 'preventDefault');

    fixture.componentInstance.scrollTo(event, 'about');

    expect(event.preventDefault).toHaveBeenCalled();
    expect(doc.getElementById).toHaveBeenCalledWith('about');
    expect(mockEl.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('should remove scroll listener on destroy', () => {
    const fixture = TestBed.createComponent(NavComponent);
    fixture.detectChanges();
    const removeSpy = jest.spyOn(window, 'removeEventListener');
    fixture.destroy();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
