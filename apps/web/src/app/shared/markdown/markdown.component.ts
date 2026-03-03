import { Component, Input, computed, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import hljs from 'highlight.js/lib/common';

// ✅ Marked v5+ friendly highlighting:
// Instead of `marked.setOptions({ highlight })`, override the renderer.
const renderer = new marked.Renderer();

renderer.code = ({ text, lang }) => {
  try {
    const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
    const highlighted =
      language === 'plaintext'
        ? hljs.highlightAuto(text).value
        : hljs.highlight(text, { language }).value;

    return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
  } catch {
    // Fallback: escape nothing (marked already does minimal handling) and render raw
    return `<pre><code class="hljs">${text}</code></pre>`;
  }
};

marked.use({
  gfm: true,
  breaks: false,
  renderer,
});

@Component({
  selector: 'app-markdown',
  template: `<div class="md" [innerHTML]="html()"></div>`,
  styleUrls: ['./markdown.component.scss']
})
export class MarkdownComponent {
  private mdSig = signal('');

  @Input({ required: true })
  set markdown(value: string) {
    this.mdSig.set(value ?? '');
  }

  html = computed<SafeHtml>(() => {
    const raw = this.mdSig();
    const rendered = marked.parse(raw) as string;
    return this.sanitizer.bypassSecurityTrustHtml(rendered);
  });

  constructor(private sanitizer: DomSanitizer) {}
}