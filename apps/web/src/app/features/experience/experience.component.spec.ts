import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ResumeService } from '@en/core/services/resume.service';
import { Experience } from '@en/core/models/resume.model';
import { ExperienceComponent } from './experience.component';

const MOCK_EXPERIENCE: Experience[] = [
  {
    date: 'Dec 2020 — Present',
    company: 'Acme Corp',
    role: 'Principal Engineer',
    description: 'Led engineering initiatives.',
    tags: ['TypeScript', 'AWS'],
  },
  {
    date: 'Jan 2018 — Dec 2020',
    company: 'Beta Ltd',
    role: 'Senior Engineer',
    description: 'Built full-stack products.',
    tags: ['Angular', 'Node.js'],
  },
];

describe('ExperienceComponent', () => {
  let mockResume: { experience: ReturnType<typeof signal<Experience[]>> };

  beforeEach(async () => {
    mockResume = { experience: signal(MOCK_EXPERIENCE) };

    await TestBed.configureTestingModule({
      imports: [ExperienceComponent],
    })
      .overrideProvider(ResumeService, { useValue: mockResume })
      .compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ExperienceComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should match snapshot', () => {
    const fixture = TestBed.createComponent(ExperienceComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should render one item per experience entry', () => {
    const fixture = TestBed.createComponent(ExperienceComponent);
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('.experience__item'));
    expect(items).toHaveLength(MOCK_EXPERIENCE.length);
  });

  it('should render role and company for each entry', () => {
    const fixture = TestBed.createComponent(ExperienceComponent);
    fixture.detectChanges();
    const roles = fixture.debugElement.queryAll(By.css('.experience__role'));
    const companies = fixture.debugElement.queryAll(By.css('.experience__company'));
    expect(roles[0].nativeElement.textContent.trim()).toBe('Principal Engineer');
    expect(companies[0].nativeElement.textContent.trim()).toBe('Acme Corp');
    expect(roles[1].nativeElement.textContent.trim()).toBe('Senior Engineer');
    expect(companies[1].nativeElement.textContent.trim()).toBe('Beta Ltd');
  });

  it('should render dates', () => {
    const fixture = TestBed.createComponent(ExperienceComponent);
    fixture.detectChanges();
    const dates = fixture.debugElement.queryAll(By.css('.experience__date'));
    expect(dates[0].nativeElement.textContent.trim()).toBe('Dec 2020 — Present');
  });

  it('should render all tags for each entry', () => {
    const fixture = TestBed.createComponent(ExperienceComponent);
    fixture.detectChanges();
    const tags = fixture.debugElement.queryAll(By.css('.experience__tag'));
    const expected = MOCK_EXPERIENCE.reduce((sum, e) => sum + e.tags.length, 0);
    expect(tags).toHaveLength(expected);
  });

  it('should render no items when experience list is empty', () => {
    mockResume.experience.set([]);
    const fixture = TestBed.createComponent(ExperienceComponent);
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('.experience__item'));
    expect(items).toHaveLength(0);
  });
});
