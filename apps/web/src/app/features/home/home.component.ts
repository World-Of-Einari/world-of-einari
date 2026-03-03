import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeroComponent }       from '../hero/hero.component';
import { AboutComponent }      from '../about/about.component';
import { ExperienceComponent } from '../experience/experience.component';
import { ProjectsComponent }   from '../projects/projects.component';
import { ContactComponent }    from '../contact/contact.component';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeroComponent,
    AboutComponent,
    ExperienceComponent,
    ProjectsComponent,
    ContactComponent,
  ],
  template: `
    <app-hero />
    <app-about />
    <app-experience />
    <app-projects />
    <app-contact />
  `,
})
export class HomeComponent {}
