import { Injectable, signal } from '@angular/core';
import { Experience, Project, SkillGroup, Stat } from '@en/core/models/resume.model';

@Injectable({ providedIn: 'root' })
export class ResumeService {
  readonly name = signal('Einari Naukkarinen');
  readonly initials = signal('EN');
  readonly title = signal('Principal Software Engineer');
  readonly email = signal('einari.naukkarinen@outlook.com');
  readonly domain = signal('einarinau.com');
  readonly tagline = signal(
    'I architect & build high-scale systems and lead engineering teams that ship products people love.'
  );

  readonly stats = signal<Stat[]>([
    { num: '10+', label: 'Years experience' },
    { num: '4+', label: 'Years as Principal' },
    { num: '∞', label: 'Problems solved' },
  ]);

  readonly aboutParagraphs = signal<string[]>([
    `Hi, I'm Einari. I'm a Principal Software Engineer based in London, currently at <strong>LexisNexis Risk Solutions</strong> where I operate at cross-team and organisational scope — leading initiatives, raising standards, and helping engineering teams do their best work.`,
    `My career spans front-end craftsmanship at <strong>Business of Fashion</strong>, full stack development in fintech at <strong>Tieto</strong> and <strong>Basware</strong>, and most recently a deep focus on <strong>InnerSource</strong>, AI-assisted developer tooling, and platform enablement at scale. I've also completed an award-winning <strong>Future Leaders programme</strong>.`,
    `I'm at my best as a <strong>technical multiplier</strong> — the person who makes everyone around them more effective. Whether that's mentoring engineers, championing new technology, or building the shared infrastructure that lets product teams move faster.`,
  ]);

  readonly skills = signal<SkillGroup[]>([
    {
      group: 'Leadership',
      tags: [
        'Solution Architecture',
        'InnerSource',
        'Team Leadership',
        'Line Management',
        'Change Management',
        'Agile',
      ],
      featured: ['Solution Architecture', 'InnerSource', 'Team Leadership'],
    },
    {
      group: 'Frontend',
      tags: ['TypeScript', 'Angular', 'React', 'RxJS', 'Material Design', 'Deck.gl'],
      featured: ['TypeScript', 'Angular'],
    },
    {
      group: 'Backend & cloud',
      tags: ['Node.js', 'AWS', 'Terraform', 'PostgreSQL', 'MongoDB', 'Elasticsearch'],
      featured: ['AWS', 'Node.js'],
    },
    {
      group: 'AI & tooling',
      tags: ['OpenAI', 'MCP', 'RAG', 'GitHub Advanced Security', 'Jest', 'Cypress'],
      featured: ['OpenAI', 'MCP'],
    },
  ]);

  readonly experience = signal<Experience[]>([
    {
      date: 'Dec 2020 — Present',
      company: 'LexisNexis Risk Solutions',
      role: 'Principal Software Engineer',
      description:
        'Operating at cross-team and organisational scope, providing technical leadership and strategic delivery across multiple product squads. Led the GitHub InnerSource initiative, contributed to an AI enablement group building OpenAI and MCP proof-of-concepts, and completed an award-winning Future Leaders programme.',
      tags: ['TypeScript', 'AWS', 'OpenAI', 'MCP', 'InnerSource', 'PostgreSQL'],
    },
    {
      date: 'Jun 2018 — Dec 2020',
      company: 'LexisNexis Risk Solutions',
      role: 'Senior Software Engineer',
      description: `Led the re-structuring of the company's CRE market analytics front-end, working closely with in-house designers on UI. End-to-end full stack JavaScript development with robust Google Maps integrations and data visualisation using Deck.gl and Chart.js.`,
      tags: ['TypeScript', 'Angular', 'Deck.gl', 'Node.js', 'MongoDB'],
    },
    {
      date: 'Jun 2017 — Jun 2018',
      company: 'Business of Fashion',
      role: 'Software Engineer',
      description:
        'Agile front-end development on a global digital media platform. Strong emphasis on pixel-perfect UI and forming coding standards across the engineering team.',
      tags: ['Angular', 'AngularJS', 'TypeScript', 'GraphQL', 'Node.js'],
    },
    {
      date: 'Jun 2016 — Jun 2017',
      company: 'Tieto',
      role: 'Software Developer',
      description:
        'Agile full stack JavaScript development in the financial sector. Mobile-first, user-oriented design with close customer collaboration throughout the development process.',
      tags: ['AngularJS', 'TypeScript', 'Node.js', 'MongoDB'],
    },
    {
      date: 'Jun 2015 — Jun 2016',
      company: 'Basware',
      role: 'Software Engineer',
      description:
        'Design and implementation of financial purchase-to-pay processes. Client-side user and state management, external system integration, localisation, and version control support.',
      tags: ['AngularJS', 'TypeScript', 'ASP.NET', 'SQL Server', 'Node.js'],
    },
  ]);

  readonly projects = signal<Project[]>([
    {
      num: '01',
      title: 'GitHub InnerSource Initiative',
      description:
        'Established internal open-source-style standards across a large engineering organisation. Created tech-agnostic starter templates, automated releases and versioning, and drove adoption across teams.',
      tags: ['InnerSource', 'GitHub', 'TypeScript', 'Terraform'],
      link: 'https://github.com/enaukkarinen',
      linkLabel: 'GitHub',
      featured: true,
      visual: [
        { label: 'scope', value: 'org-wide' },
        { label: 'templates', value: 'multi-stack' },
        { label: 'releases', value: 'automated' },
      ],
    },
    {
      num: '02',
      title: 'AI Developer Tooling',
      description:
        'AI-assisted tooling to improve discoverability of shared knowledge, documentation, and platform capabilities across InnerSource repositories. Built with OpenAI and MCP.',
      tags: ['OpenAI', 'MCP', 'RAG', 'TypeScript', 'Node.js'],
      link: 'https://github.com/enaukkarinen',
      linkLabel: 'GitHub',
    },
    {
      num: '03',
      title: 'CRE Market Analytics Platform',
      description:
        'Re-structured front-end for a commercial real estate analytics product. Data visualisation with Deck.gl, robust Google Maps integrations, and close collaboration with in-house designers.',
      tags: ['Angular', 'Deck.gl', 'TypeScript', 'Node.js'],
      link: '#',
      linkLabel: 'View project',
    },
  ]);

  readonly socialLinks = signal([
    { label: 'GitHub', href: 'https://github.com/enaukkarinen' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/enaukkarinen' },
  ]);
}
