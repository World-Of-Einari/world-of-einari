import { Injectable, signal } from '@angular/core';
import { Experience, Project, SkillGroup, Stat } from '../models/resume.model';

@Injectable({ providedIn: 'root' })
export class ResumeService {
  readonly name = signal('Einari Naukkarinen');
  readonly initials = signal('EN');
  readonly title = signal('Principal Software Engineer');
  readonly email = signal('einari.naukkarinen@outlook.com');
  readonly domain = signal('einarinau.com');
  readonly tagline = signal(
    'I architect high-scale systems and lead engineering teams that ship products people love.'
  );

  readonly stats = signal<Stat[]>([
    { num: '10+', label: 'Years experience' },
    { num: '40+', label: 'Engineers led' },
    { num: '∞', label: 'Problems solved' },
  ]);

  readonly aboutParagraphs = signal<string[]>([
    `Hi, I'm Einari. I'm a Principal Software Engineer who lives at the intersection of deep technical execution and engineering leadership. I care about code that lasts, teams that thrive, and products that genuinely change how people work.`,
    `Over the past decade I've shipped everything from <strong>real-time data pipelines</strong> handling millions of events per second, to <strong>consumer-grade mobile apps</strong> used by hundreds of thousands. I've built teams from scratch and inherited ones that needed rebuilding.`,
    `My approach: <strong>ruthless pragmatism</strong>. The right abstraction over the clever one. The boring technology that ships over the exciting one that doesn't.`,
  ]);

  readonly skills = signal<SkillGroup[]>([
    {
      group: 'Core',
      tags: [
        'System Design',
        'Architecture',
        'Engineering Leadership',
        'TypeScript',
        'Go',
        'Python',
      ],
      featured: ['System Design', 'Architecture', 'Engineering Leadership'],
    },
    {
      group: 'Platform',
      tags: ['Kubernetes', 'GCP', 'AWS', 'Terraform', 'Kafka', 'PostgreSQL'],
    },
    {
      group: 'Frontend',
      tags: ['Angular', 'React', 'GraphQL', 'WebSockets'],
      featured: ['Angular'],
    },
  ]);

  readonly experience = signal<Experience[]>([
    {
      date: '2022 — Present',
      company: 'Acme Corp',
      role: 'Principal Software Engineer',
      description:
        'Leading platform architecture for a suite of B2B SaaS products. Drove migration from monolith to event-driven microservices, reducing p99 latency by 60%. Built and scaled the core engineering team from 8 to 30+.',
      tags: ['Go', 'Kafka', 'GCP', 'Kubernetes'],
    },
    {
      date: '2019 — 2022',
      company: 'Startup Ltd',
      role: 'Senior Software Engineer',
      description:
        'Full-stack ownership of consumer product from 0 to 200k MAU. Designed and built real-time analytics dashboard processing 5M events/day. Led a team of 6 engineers across frontend and backend.',
      tags: ['TypeScript', 'Angular', 'PostgreSQL', 'AWS'],
    },
    {
      date: '2016 — 2019',
      company: 'Agency Co',
      role: 'Software Engineer',
      description:
        'Delivered 12+ web and mobile products for enterprise clients across fintech, healthcare, and logistics. Introduced CI/CD practices that cut deployment time by 80%.',
      tags: ['React', 'Node.js', 'Python'],
    },
  ]);

  readonly projects = signal<Project[]>([
    {
      num: '01',
      title: 'Real-time Analytics Platform',
      description:
        'Event-driven data pipeline processing 5M+ events per day with sub-second query latency. Built on Kafka, ClickHouse, and a WebSocket-powered live dashboard.',
      tags: ['Go', 'Kafka', 'ClickHouse', 'Angular'],
      link: '#',
      linkLabel: 'View case study',
      featured: true,
      visual: [
        { label: 'events/sec', value: '48,203' },
        { label: 'p99 latency', value: '12ms' },
        { label: 'uptime', value: '99.98%' },
      ],
    },
    {
      num: '02',
      title: 'Distributed Config Service',
      description:
        'Open-source feature flag and remote config system with real-time propagation to 10k+ connected clients.',
      tags: ['Go', 'gRPC', 'etcd'],
      link: '#',
      linkLabel: 'GitHub',
    },
    {
      num: '03',
      title: 'Design System @ Scale',
      description:
        'Component library and design token system adopted across 4 product teams, shipping 80+ accessible components.',
      tags: ['Angular', 'Material', 'Storybook'],
      link: '#',
      linkLabel: 'View project',
    },
  ]);

  readonly socialLinks = signal([
    { label: 'GitHub', href: 'https://github.com/enaukkarinen' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/enaukkarinen' },
  ]);
}
