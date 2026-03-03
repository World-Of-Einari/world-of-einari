import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell-layout.component').then(m => m.ShellLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.page').then(m => m.HomePage),
        title: 'Einari Naukkarinen'
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/projects/projects.page').then(m => m.ProjectsPage),
        title: 'Projects — Einari'
      },
      {
        path: 'projects/:slug',
        loadComponent: () => import('./features/projects/project-detail.page').then(m => m.ProjectDetailPage),
        title: 'Project — Einari'
      },
      {
        path: 'writing',
        loadComponent: () => import('./features/writing/writing.page').then(m => m.WritingPage),
        title: 'Writing — Einari'
      },
      {
        path: 'writing/:slug',
        loadComponent: () => import('./features/writing/writing-detail.page').then(m => m.WritingDetailPage),
        title: 'Writing — Einari'
      },
      {
        path: 'ai',
        loadComponent: () => import('./features/ai/ai.page').then(m => m.AiPage),
        title: 'AI Lab — Einari'
      },
      {
        path: 'about',
        loadComponent: () => import('./features/about/about.page').then(m => m.AboutPage),
        title: 'About — Einari'
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
