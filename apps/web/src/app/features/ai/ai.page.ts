import { Component, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { firstValueFrom } from 'rxjs';

type ChatResponse = {
  answer: string;
  sources: Array<{ title: string; url?: string; snippet?: string }>;
  toolCalls: Array<{ tool: string; args: unknown; result: unknown }>;
};

@Component({
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  styleUrls: ['./ai.page.scss'],
  templateUrl: './ai.page.html',
})
export class AiPage {
  private http = inject(HttpClient);

  // Change this later (env, relative proxy, etc.).
  apiBase = signal('http://localhost:8787');

  message = signal('');
  busy = signal(false);

  private answerSig = signal('');
  answer = computed(() => this.answerSig());

  private sourcesSig = signal<ChatResponse['sources']>([]);
  sources = computed(() => this.sourcesSig());

  async send() {
    const msg = this.message().trim();
    if (!msg || this.busy()) return;

    this.busy.set(true);
    try {
      const res = await firstValueFrom(
        this.http.post<ChatResponse>(`${this.apiBase()}/chat`, { message: msg }),
      );
      this.answerSig.set(res.answer);
      this.sourcesSig.set(res.sources ?? []);
    } finally {
      this.busy.set(false);
    }
  }
}
