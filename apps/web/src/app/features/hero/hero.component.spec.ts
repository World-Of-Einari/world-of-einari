import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

import { ResumeService } from '@en/core/services/resume.service';
import { Stat } from '@en/core/models/resume.model';
import { HeroComponent } from './hero.component';

describe('HeroComponent', () => {
  let mockResume: {
    name: ReturnType<typeof signal<string>>;
    title: ReturnType<typeof signal<string>>;
    tagline: ReturnType<typeof signal<string>>;
    pronunciation: ReturnType<typeof signal<string>>;
    stats: ReturnType<typeof signal<Stat[]>>;
  };

  beforeEach(async () => {
    mockResume = {
      name: signal('Einari Naukkarinen'),
      title: signal('Principal Software Engineer'),
      tagline: signal('I architect & build high-scale systems.'),
      pronunciation: signal('AY-nah-ree NOW-kah-ree-nen'),
      stats: signal([
        { num: '10+', label: 'Years experience' },
        { num: '4+', label: 'Years as Principal' },
      ]),
    };

    await TestBed.configureTestingModule({
      imports: [HeroComponent],
    })
      .overrideProvider(ResumeService, { useValue: mockResume })
      .compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(HeroComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should match snapshot', () => {
    const fixture = TestBed.createComponent(HeroComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should render the tagline', () => {
    const fixture = TestBed.createComponent(HeroComponent);
    fixture.detectChanges();
    const tagline = fixture.debugElement.query(By.css('.hero__tagline'));
    expect(tagline.nativeElement.textContent.trim()).toBe('I architect & build high-scale systems.');
  });

  it('should render the pronunciation', () => {
    const fixture = TestBed.createComponent(HeroComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('AY-nah-ree NOW-kah-ree-nen');
  });

  it('should render one stat per entry', () => {
    const fixture = TestBed.createComponent(HeroComponent);
    fixture.detectChanges();
    const stats = fixture.debugElement.queryAll(By.css('.hero__stat'));
    expect(stats).toHaveLength(2);
  });

  it('should render stat numbers and labels', () => {
    const fixture = TestBed.createComponent(HeroComponent);
    fixture.detectChanges();
    const nums = fixture.debugElement.queryAll(By.css('.hero__stat-num'));
    const labels = fixture.debugElement.queryAll(By.css('.hero__stat-label'));
    expect(nums[0].nativeElement.textContent.trim()).toBe('10+');
    expect(labels[0].nativeElement.textContent.trim()).toBe('Years experience');
  });

  it('should split nameParts computed correctly', () => {
    const fixture = TestBed.createComponent(HeroComponent);
    fixture.detectChanges();
    const { nameParts } = fixture.componentInstance;
    expect(nameParts().first).toBe('Einari');
    expect(nameParts().last).toBe('Naukkarinen');
  });

  it('should call scrollIntoView when scrollTo is called', () => {
    const fixture = TestBed.createComponent(HeroComponent);
    fixture.detectChanges();

    const doc = TestBed.inject(DOCUMENT);
    const mockEl = { scrollIntoView: jest.fn() } as unknown as HTMLElement;
    jest.spyOn(doc, 'getElementById').mockReturnValue(mockEl);

    const event = new MouseEvent('click');
    jest.spyOn(event, 'preventDefault');

    fixture.componentInstance.scrollTo(event, 'projects');

    expect(event.preventDefault).toHaveBeenCalled();
    expect(doc.getElementById).toHaveBeenCalledWith('projects');
    expect(mockEl.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });
});