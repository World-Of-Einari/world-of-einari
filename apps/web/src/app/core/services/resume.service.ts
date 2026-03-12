import { Injectable, signal } from '@angular/core';
import { Experience, Project, SkillGroup, Stat } from '@en/core/models/resume.model';

@Injectable({ providedIn: 'root' })
export class ResumeService {
  readonly name = signal('Einari Naukkarinen');
  readonly pronunciation = signal('AY-nah-ree NOW-kah-ree-nen');
  readonly initials = signal('EN');
  readonly title = signal('Principal Software Engineer');
  readonly email = signal('einari.naukkarinen@outlook.com');
  readonly domain = signal('einarinau.com');
  readonly tagline = signal(
    'I architect & build high-scale systems, leading engineering teams that ship products people love.'
  );

  readonly stats = signal<Stat[]>([
    { num: '10+', label: 'Years experience' },
    { num: '5+', label: 'Years as Principal' },
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
      description: [
        'Established internal open-source-style standards across a large engineering organisation.',
        'Created tech-agnostic starter templates, automated releases and versioning, and drove adoption across teams.',
      ],
      tags: ['InnerSource', 'GitHub', 'TypeScript', 'Terraform'],
      // link: 'https://github.com/enaukkarinen',
      // linkLabel: 'GitHub',
      featured: true,
      visual: [
        { label: 'scope', value: 'org-wide' },
        { label: 'templates', value: 'multi-stack' },
        { label: 'releases', value: 'automated' },
      ],
    },
    {
      num: '02',
      title: 'Vector Tile Engine',
      description: [
        `Designed and built the end-to-end solution for rendering 27M Land Registry title boundaries on Google Maps via Deck.gl.`,

        `Pure GeoJSON was unviable at this scale — the architecture required a dedicated data consumer to remodel and index boundaries in Elasticsearch,
        a pre-caching pipeline to encode them as MVT protobuf files uploaded to S3 following the Slippy map convention,
        and a new API to serve tiles by X/Y/Z coordinates at runtime.`,

        `Supported the team hands-on across all three services from architecture through to delivery.`,
      ],
      tags: ['Deck.gl', 'Angular', 'TypeScript', 'Elasticsearch', 'Node.js', 'AWS S3', 'MVT'],
      featured: true,
      visual: [
        { label: 'boundaries', value: '27M' },
        { label: 'tile format', value: 'MVT / .pbf' },
        { label: 'scope', value: 'end-to-end' },
      ],
    },
    {
      num: '03',
      title: 'Market Analytics',
      description: [
        'Led the creation of a new Market Analytics platform aggregating millions of CRE records.',
        'Letting deals, investment sales, planning applications, and socio-demographic data — all queryable by user-defined GeoJSON polygons.',
        'Geospatial query performance at this scale demanded a move away from MongoDB — I introduced PostgreSQL on AWS RDS as a new addition to the stack, along with Kysely for end-to-end type-safety from data ingestion through to the front-end.',
        'Also led the integration of a new Experian socio-demographics dataset, collaborating directly with Experian to design the data contract and annual update process.',
      ],
      tags: ['Angular', 'TypeScript', 'PostgreSQL', 'Kysely', 'Node.js', 'AWS RDS', 'Chart.js'],
    },
    {
      num: '04',
      title: 'Front-end Modernisation',
      description: [
        'Six-month overhaul of EG Radius — a CRE analytics platform weighed down by years of accumulated technical debt and inconsistent conventions across multiple generations of developers.',
        'Introduced a scalable folder architecture (core, features, shared) alongside BEM and ITCSS to bring structure to a fragmented codebase. Replaced Protractor with Cypress, including screenshot testing for UI regression coverage. Brought tooling up to date and established coding standards that were subsequently adopted across the wider tech estate.',
        'Working closely with designers, established a consistent and pixel-perfect design language across the entire application.',
      ],
      tags: ['Angular', 'TypeScript', 'Cypress', 'Node.js'],
    },
  ]);

  readonly socialLinks = signal([
    { label: 'GitHub', href: 'https://github.com/enaukkarinen' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/enaukkarinen' },
  ]);
}
