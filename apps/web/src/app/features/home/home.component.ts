import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeroComponent }       from '../hero/hero.component';
import { AboutComponent }      from '../about/about.component';
import { ExperienceComponent } from '../experience/experience.component';
import { ProjectsComponent }   from '../projects/projects.component';
import { ContactComponent }    from '../contact/contact.component';
import { WritingComponent } from '../writing/writing.component';

@Component({
  selector: 'en-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeroComponent,
    AboutComponent,
    ExperienceComponent,
    ProjectsComponent,
    WritingComponent,
    ContactComponent,
  ],
  template: `
    <en-hero />
    <en-about />
    <en-experience />
    <en-projects />
    <en-writing />
    <en-contact />
  `,
})
export class HomeComponent {}
