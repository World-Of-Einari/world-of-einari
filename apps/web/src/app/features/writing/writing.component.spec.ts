/// <reference types="jest" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';

import { WritingComponent } from './writing.component';
import { ArticleService } from '@en/core/services/article.service';
import { Article } from '@en/core/models/article.model';

const MOCK_ARTICLES: Article[] = [
  {
    title: 'My First Article',
    subtitle: 'A short subtitle here',
    url: 'https://medium.com/@einarinau/first',
    publishedAt: new Date('2024-01-15'),
    thumbnail: 'https://cdn.example.com/thumb1.jpg',
    categories: ['Angular', 'TypeScript'],
  },
  {
    title: 'Second Article',
    subtitle: 'Another subtitle',
    url: 'https://medium.com/@einarinau/second',
    publishedAt: new Date('2024-03-10'),
    thumbnail: null,
    categories: [],
  },
];

function createMockArticleService(articles: Article[] | undefined = MOCK_ARTICLES) {
  return {
    articles: {
      value: signal(articles),
    },
  };
}

describe('WritingComponent', () => {
  let fixture: ComponentFixture<WritingComponent>;
  let mockArticleService: ReturnType<typeof createMockArticleService>;

  beforeEach(() => {
    mockArticleService = createMockArticleService();

    // RevealDirective uses IntersectionObserver
    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      value: jest.fn(() => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      })),
    });

    TestBed.configureTestingModule({
      imports: [WritingComponent],
      providers: [{ provide: ArticleService, useValue: mockArticleService }],
    });

    fixture = TestBed.createComponent(WritingComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should match snapshot', () => {
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should render an article card for each article', () => {
    const cards = fixture.debugElement.queryAll(By.css('.writing__card'));
    expect(cards).toHaveLength(MOCK_ARTICLES.length);
  });

  it('should render article title and link', () => {
    const titleLinks = fixture.debugElement.queryAll(By.css('.writing__card-title'));
    expect(titleLinks[0].nativeElement.textContent.trim()).toBe('My First Article');
    expect(titleLinks[0].nativeElement.getAttribute('href')).toBe(
      'https://medium.com/@einarinau/first'
    );
    expect(titleLinks[0].nativeElement.getAttribute('target')).toBe('_blank');
  });

  it('should render article subtitle', () => {
    const subtitles = fixture.debugElement.queryAll(By.css('.writing__card-subtitle'));
    expect(subtitles[0].nativeElement.textContent.trim()).toBe('A short subtitle here');
  });

  it('should render thumbnail when present', () => {
    const cards = fixture.debugElement.queryAll(By.css('.writing__card'));
    const thumbInFirst = cards[0].query(By.css('.writing__card-thumb'));
    expect(thumbInFirst).toBeTruthy();
    expect(thumbInFirst.nativeElement.getAttribute('src')).toBe(
      'https://cdn.example.com/thumb1.jpg'
    );
    expect(thumbInFirst.nativeElement.getAttribute('alt')).toBe('My First Article');
  });

  it('should not render thumbnail when null', () => {
    const cards = fixture.debugElement.queryAll(By.css('.writing__card'));
    const thumbInSecond = cards[1].query(By.css('.writing__card-thumb'));
    expect(thumbInSecond).toBeNull();
  });

  it('should render category tags', () => {
    const cards = fixture.debugElement.queryAll(By.css('.writing__card'));
    const tags = cards[0].queryAll(By.css('.writing__card-tag'));
    expect(tags).toHaveLength(2);
    expect(tags[0].nativeElement.textContent.trim()).toBe('Angular');
    expect(tags[1].nativeElement.textContent.trim()).toBe('TypeScript');
  });

  it('should render no tags when categories are empty', () => {
    const cards = fixture.debugElement.queryAll(By.css('.writing__card'));
    const tags = cards[1].queryAll(By.css('.writing__card-tag'));
    expect(tags).toHaveLength(0);
  });

  it('should render "Read more" link with correct href', () => {
    const readMoreLinks = fixture.debugElement.queryAll(By.css('.writing__card-link'));
    expect(readMoreLinks[0].nativeElement.getAttribute('href')).toBe(
      'https://medium.com/@einarinau/first'
    );
    expect(readMoreLinks[0].nativeElement.getAttribute('rel')).toBe('noopener');
  });

  it('should render no cards when articles are missing', () => {
    mockArticleService.articles.value.set([]);
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('.writing__card'));
    expect(cards).toHaveLength(0);
  });
});
