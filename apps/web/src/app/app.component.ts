import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './layout/nav/nav.component';
import { FooterComponent } from './layout/footer/footer.component';
import { CursorComponent } from './shared/components/cursor/cursor.component';
// import { ChatComponent } from './features/chat/chat.component';

@Component({
  selector: 'en-root',
  templateUrl: './app.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, NavComponent, FooterComponent, CursorComponent /* ChatComponent */],
})
export class AppComponent {}
