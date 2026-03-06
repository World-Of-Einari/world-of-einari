import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ResumeService } from '@en/core/services/resume.service';
import { SkillGroup } from '@en/core/models/resume.model';
import { AboutComponent } from './about.component';

const MOCK_PARAGRAPHS = ['First paragraph.', 'Second paragraph.'];

const MOCK_SKILLS: SkillGroup[] = [
  { group: 'Frontend', tags: ['TypeScript', 'Angular', 'React'], featured: ['TypeScript', 'Angular'] },
  { group: 'Backend', tags: ['Node.js', 'AWS'], featured: [] },
];

describe('AboutComponent', () => {
  let mockResume: {
    aboutParagraphs: ReturnType<typeof signal<string[]>>;
    skills: ReturnType<typeof signal<SkillGroup[]>>;
  };

  beforeEach(async () => {
    mockResume = {
      aboutParagraphs: signal(MOCK_PARAGRAPHS),
      skills: signal(MOCK_SKILLS),
    };

    await TestBed.configureTestingModule({
      imports: [AboutComponent],
    })
      .overrideProvider(ResumeService, { useValue: mockResume })
      .compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AboutComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should match snapshot', () => {
    const fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should render one paragraph per entry', () => {
    const fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();
    const paras = fixture.debugElement.queryAll(By.css('.about__paragraph'));
    expect(paras).toHaveLength(MOCK_PARAGRAPHS.length);
  });

  it('should render one skill group per entry', () => {
    const fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();
    const groups = fixture.debugElement.queryAll(By.css('.about__skill-group'));
    expect(groups).toHaveLength(MOCK_SKILLS.length);
  });

  it('should render group labels', () => {
    const fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();
    const labels = fixture.debugElement.queryAll(By.css('.about__skill-label'));
    expect(labels[0].nativeElement.textContent.trim()).toBe('Frontend');
    expect(labels[1].nativeElement.textContent.trim()).toBe('Backend');
  });

  it('should apply --featured modifier to featured tags only', () => {
    const fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();
    const tags = fixture.debugElement.queryAll(By.css('.about__tag'));
    // TypeScript and Angular are featured; React, Node.js, AWS are not
    const featured = tags.filter((t) => t.nativeElement.classList.contains('about__tag--featured'));
    expect(featured).toHaveLength(2);
    expect(featured[0].nativeElement.textContent.trim()).toBe('TypeScript');
    expect(featured[1].nativeElement.textContent.trim()).toBe('Angular');
  });

  describe('isFeatured()', () => {
    it('returns true when tag is in the featured list', () => {
      const fixture = TestBed.createComponent(AboutComponent);
      const { isFeatured } = fixture.componentInstance;
      expect(isFeatured(MOCK_SKILLS[0], 'TypeScript')).toBe(true);
    });

    it('returns false when tag is not in the featured list', () => {
      const fixture = TestBed.createComponent(AboutComponent);
      const { isFeatured } = fixture.componentInstance;
      expect(isFeatured(MOCK_SKILLS[0], 'React')).toBe(false);
    });

    it('returns false when featured is undefined', () => {
      const fixture = TestBed.createComponent(AboutComponent);
      const group: SkillGroup = { group: 'Other', tags: ['Go'] };
      expect(fixture.componentInstance.isFeatured(group, 'Go')).toBe(false);
    });
  });
});
