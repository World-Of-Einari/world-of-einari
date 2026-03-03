export type ContentKind = 'projects' | 'writing';

export interface ContentListItem {
  kind: ContentKind;
  slug: string;
  title: string;
  summary: string;
  date?: string; // ISO
  tags?: string[];
  stack?: string[];
}

export interface ContentIndex {
  projects: ContentListItem[];
  writing: ContentListItem[];
}
