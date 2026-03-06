import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ResumeService } from '@en/core/services/resume.service';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let mockResume: { name: ReturnType<typeof signal<string>>; domain: ReturnType<typeof signal<string>> };

  beforeEach(async () => {
    mockResume = {
      name: signal('Einari Naukkarinen'),
      domain: signal('einarinau.com'),
    };

    await TestBed.configureTestingModule({
      imports: [FooterComponent],
    })
      .overrideProvider(ResumeService, { useValue: mockResume })
      .compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should match snapshot', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should render the name', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Einari Naukkarinen');
  });

  it('should render the domain', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('einarinau.com');
  });

  it('should reflect updated signal values', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();

    mockResume.name.set('Jane Doe');
    mockResume.domain.set('janedoe.com');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Jane Doe');
    expect(fixture.nativeElement.textContent).toContain('janedoe.com');
  });
});