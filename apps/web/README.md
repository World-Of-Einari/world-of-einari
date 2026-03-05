# World of Einari

A personal portfolio and resume website built with Angular, featuring server-side rendering and a modern zoneless architecture.

## Purpose

- **Portfolio Site:** A single-page application showcasing professional experience, projects, and contact information.
- **Modern Angular:** Built with Angular's latest features including standalone components, SSR, and zoneless change detection.

## Features

- Hero section with personal introduction
- About section with background information
- Experience section with professional work history
- Projects showcase with links
- Contact section
- Responsive navigation with active section tracking and smooth scrolling
- Server-side rendering for improved performance and SEO

## Project Structure

- `src/app/core/` — Core models and data services (resume model & service)
- `src/app/features/` — Page sections (hero, about, experience, projects, contact, home)
- `src/app/layout/` — Site-wide layout components (nav, footer)
- `src/app/shared/` — Shared components and directives (section header, cursor, reveal directive)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the application:**
   ```bash
   npm start
   ```
3. **Run tests:**
   ```bash
   npm test
   ```
4. **Lint the code:**
   ```bash
   npm run lint
   ```

## License

MIT License
