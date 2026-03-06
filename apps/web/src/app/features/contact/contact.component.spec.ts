import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ResumeService } from '@en/core/services/resume.service';
import { ContactComponent } from './contact.component';

const MOCK_SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/enaukkarinen' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/enaukkarinen' },
];

describe('ContactComponent', () => {
  let mockResume: {
    email: ReturnType<typeof signal<string>>;
    socialLinks: ReturnType<typeof signal<{ label: string; href: string }[]>>;
  };

  beforeEach(async () => {
    mockResume = {
      email: signal('test@example.com'),
      socialLinks: signal(MOCK_SOCIAL_LINKS),
    };

    await TestBed.configureTestingModule({
      imports: [ContactComponent],
    })
      .overrideProvider(ResumeService, { useValue: mockResume })
      .compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should match snapshot', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should render the email as a mailto link', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    fixture.detectChanges();
    const emailLink = fixture.debugElement.query(By.css('.contact__email'));
    expect(emailLink.nativeElement.getAttribute('href')).toBe('mailto:test@example.com');
    expect(emailLink.nativeElement.textContent.trim()).toBe('test@example.com');
  });

  it('should render one social link per entry', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('.contact__social-link'));
    expect(links).toHaveLength(MOCK_SOCIAL_LINKS.length);
  });

  it('should render social link labels and hrefs', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('.contact__social-link'));
    expect(links[0].nativeElement.textContent.trim()).toBe('GitHub');
    expect(links[0].nativeElement.getAttribute('href')).toBe('https://github.com/enaukkarinen');
    expect(links[1].nativeElement.textContent.trim()).toBe('LinkedIn');
  });

  it('should open social links in a new tab', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('.contact__social-link'));
    links.forEach((link) => {
      expect(link.nativeElement.getAttribute('target')).toBe('_blank');
      expect(link.nativeElement.getAttribute('rel')).toBe('noopener');
    });
  });
});
