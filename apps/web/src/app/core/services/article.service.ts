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
    thumbnail?: string;
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
          subtitle: stripHtml(item.description).slice(0, 160).trim() + '...',
          url: item.link,
          publishedAt: new Date(item.pubDate),
          thumbnail:
            item.thumbnail ||
            item.description.toString().match(/<img[^>]+src="([^">]+)"/)?.[1] ||
            null,
        })
      );
    },
  });
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}
