import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Project } from '@en/core/models/resume.model';
import { ResumeService } from '@en/core/services/resume.service';
import { ProjectsComponent } from './projects.component';

const FEATURED_PROJECT: Project = {
  num: '01',
  title: 'Featured Project',
  description: 'A featured project with a visual panel.',
  tags: ['TypeScript', 'Angular'],
  featured: true,
  visual: [
    { label: 'scope', value: 'org-wide' },
    { label: 'status', value: 'active' },
  ],
  link: 'https://example.com',
  linkLabel: 'View',
};

const STANDARD_PROJECT: Project = {
  num: '02',
  title: 'Standard Project',
  description: 'A plain project card with no link.',
  tags: ['React', 'Node.js'],
};

describe('ProjectsComponent', () => {
  let mockResume: { projects: ReturnType<typeof signal<Project[]>> };

  beforeEach(async () => {
    mockResume = { projects: signal([FEATURED_PROJECT, STANDARD_PROJECT]) };

    await TestBed.configureTestingModule({
      imports: [ProjectsComponent],
    })
      .overrideProvider(ResumeService, { useValue: mockResume })
      .compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should match snapshot', () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should render one card per project', () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.css('.projects__card'));
    expect(cards).toHaveLength(2);
  });

  it('should apply --featured modifier only to featured cards', () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.css('.projects__card'));
    expect(cards[0].nativeElement.classList).toContain('projects__card--featured');
    expect(cards[1].nativeElement.classList).not.toContain('projects__card--featured');
  });

  it('should render visual panel for featured project with visual data', () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    fixture.detectChanges();
    const visual = fixture.debugElement.query(By.css('.projects__card-visual'));
    expect(visual).toBeTruthy();
    const lines = visual.queryAll(By.css('.projects__visual-line'));
    expect(lines).toHaveLength(FEATURED_PROJECT.visual!.length);
  });

  it('should render project titles', () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    fixture.detectChanges();
    const titles = fixture.debugElement.queryAll(By.css('.projects__card-title'));
    expect(titles[0].nativeElement.textContent.trim()).toBe('Featured Project');
    expect(titles[1].nativeElement.textContent.trim()).toBe('Standard Project');
  });

  it('should render all tags across all projects', () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    fixture.detectChanges();
    const tags = fixture.debugElement.queryAll(By.css('.projects__card-tag'));
    const expected = FEATURED_PROJECT.tags.length + STANDARD_PROJECT.tags.length;
    expect(tags).toHaveLength(expected);
  });

  it('should render a link when project.link is set', () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('.projects__card-link'));
    expect(links).toHaveLength(1);
    expect(links[0].nativeElement.getAttribute('href')).toBe('https://example.com');
  });

  it('should not render a link when project.link is absent', () => {
    mockResume.projects.set([STANDARD_PROJECT]);
    const fixture = TestBed.createComponent(ProjectsComponent);
    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('.projects__card-link'));
    expect(links).toHaveLength(0);
  });

  it('should render no cards when projects list is empty', () => {
    mockResume.projects.set([]);
    const fixture = TestBed.createComponent(ProjectsComponent);
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.css('.projects__card'));
    expect(cards).toHaveLength(0);
  });
});
