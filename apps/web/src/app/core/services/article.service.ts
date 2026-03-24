import { Injectable, resource } from '@angular/core';
import { Article } from '@en/core/models/article.model';

const MEDIUM_RSS =
  'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@einarinau';

interface MediumResponse {
  status: string;
  feed: {
    title: string;
    description: string;
    link: string;
    image: string;
  };
  items: {
    title: string;
    description: string;
    link: string;
    pubDate: string;
    thumbnail: '';
    categories?: string[];
  }[];
}

@Injectable({ providedIn: 'root' })
export class ArticleService {
  readonly articles = resource({
    loader: async () => {
      const res = await fetch(MEDIUM_RSS);
      const json = (await res.json()) as MediumResponse;
      return json.items.map(
        (item): Article => ({
          title: item.title,
          subtitle: this.stripHtml(item.description),
          url: item.link,
          publishedAt: new Date(item.pubDate),
          thumbnail: this.getThumbnail(item),
          categories: item.categories,
        })
      );
    },
  });

  // DOMParser is browser-only — safe here as WritingService is client-side
  private stripHtml(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body?.textContent ?? '';
  }

  private getThumbnail(item: MediumResponse['items'][0]): string | null {
    const url = item.thumbnail || item.description?.match(/<img[^>]+src="([^">]+)"/)?.[1] || null;
    return this.resizeMediumImage(url, 200);
  }

  private resizeMediumImage(url: string | null, size: number): string | null {
    if (!url) return null;
    // Handle old format: /max/1024/filename
    if (url.includes('/max/')) {
      return url.replace(/\/max\/\d+\//, `/v2/resize:fit:${size}/`);
    }
    // Handle new format: /v2/resize:fit:1024/filename
    return url.replace(/resize:fit:\d+/, `resize:fit:${size}`);
  }
}
