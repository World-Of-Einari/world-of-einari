# Changelog

## 1.0.0 (2026-03-06)


### Features

* add CI and deploy workflows for GitHub Actions with Terraform i… ([1a647bd](https://github.com/enaukkarinen/world-of-einari/commit/1a647bd33f229d52535b369a5bc583f1d3bba20c))
* add CI and deploy workflows for GitHub Actions with Terraform integration ([b58d54e](https://github.com/enaukkarinen/world-of-einari/commit/b58d54e416358f78e15e8d8c6d415423b3622ed8))
* add custom fonts and update stylesheets for typography and design tokens ([96797fa](https://github.com/enaukkarinen/world-of-einari/commit/96797fae999dcb0671e8ae684f7e8d8395aa1cca))
* add experience, hero, projects, footer, nav, and cursor components with tests and snapshots ([da66922](https://github.com/enaukkarinen/world-of-einari/commit/da66922a91718da9f4a4bfaf2df58bc0d5b87d1d))
* add GitHub Actions workflow for deployment and update README with badges ([425bc81](https://github.com/enaukkarinen/world-of-einari/commit/425bc81c21a320e10d38aeaed707e002b28190e0))
* add hero, home, projects, footer, and nav components with styling and functionality ([9b575a2](https://github.com/enaukkarinen/world-of-einari/commit/9b575a2a2fb2e260c7e43e4a03a730a9708d53fc))
* add pnpm workspace configuration and create-web script for Angular SSR app setup ([edc231a](https://github.com/enaukkarinen/world-of-einari/commit/edc231afa324ab3aefff301083a89778321e80f9))
* add secret scanning workflow using Gitleaks for pull requests and pushes to main ([ead9d6c](https://github.com/enaukkarinen/world-of-einari/commit/ead9d6cf1bce2028791184ba3beded9c21099dd0))
* add simple express server ([ffe777b](https://github.com/enaukkarinen/world-of-einari/commit/ffe777b0878309074e158209499ddc201930dde2))
* add speaker icon and pronunciation feature to hero component; update styles for better responsiveness ([2ac1737](https://github.com/enaukkarinen/world-of-einari/commit/2ac17375d1daf6c4131fd8894ed379b044be09ae))
* enhance nav component with active section tracking and smooth scrolling ([8867594](https://github.com/enaukkarinen/world-of-einari/commit/8867594318d85fac8c7fc48a2a31217972549440))
* enhance section header component to support 'hero' size with updated styles and template adjustments ([b0a5928](https://github.com/enaukkarinen/world-of-einari/commit/b0a592838eba0174cc9fce200b31c5880ce1ec56))
* implement section header component and update existing components to use it ([42bc198](https://github.com/enaukkarinen/world-of-einari/commit/42bc198cbc4a3104e88b98f381a1e318a59648ca))
* implement server-side rendering with Angular SSR and Express setup ([313842f](https://github.com/enaukkarinen/world-of-einari/commit/313842fea1d82ae1278fa8bdc283de711c3c2f65))
* initial crud ([e0abdb3](https://github.com/enaukkarinen/world-of-einari/commit/e0abdb303f1a28d92a4e38d9e2da3bcaf80cd9de))
* make project link and label optional in resume model and service; update projects component to handle absence of links ([9bd870f](https://github.com/enaukkarinen/world-of-einari/commit/9bd870f4eaf8cd454e8db5e19e471f18628368c9))
* release-please ([c74191f](https://github.com/enaukkarinen/world-of-einari/commit/c74191fea50ec7c784e64477732f1d56adb3bda2))
* remove angular-in-memory-web-api dependency and clean up related code ([440ad27](https://github.com/enaukkarinen/world-of-einari/commit/440ad27850f8bdd8cb173311488a960d91ed6c44))
* rename appReveal directive to enReveal and update references across components ([3169de3](https://github.com/enaukkarinen/world-of-einari/commit/3169de31994b891dc676eacdaecca8f28744da42))
* replace favicon.ico with favicon.svg and update references; remove unused styles from contact and styles components ([6ffaaa3](https://github.com/enaukkarinen/world-of-einari/commit/6ffaaa3158c697f7e8b1fbac66a6a7330dff3fbe))
* update component selectors and prefixes to use 'en-' namespace ([aa3e87e](https://github.com/enaukkarinen/world-of-einari/commit/aa3e87e14db99e8cca6971486b0a42f1c1f15c36))
* update resume service with new content and restructure skills and experience sections ([c787c60](https://github.com/enaukkarinen/world-of-einari/commit/c787c60e7b0f212772779e7f6c90188d100375e6))


### Bug Fixes

* add concurrency settings to deploy job in GitHub Actions workflow ([ad431cf](https://github.com/enaukkarinen/world-of-einari/commit/ad431cf84f33fd94bcb59ec5eb4ae91255e8f46a))
* add permissions for secret scanning workflow ([d21c6fe](https://github.com/enaukkarinen/world-of-einari/commit/d21c6fe306f68219ed3c6479c9f6e458fd9929b5))
* enhance transition effects and add conditional link rendering in projects component ([501ab21](https://github.com/enaukkarinen/world-of-einari/commit/501ab212385718b4ef385a532d328f961bae72c9))
* enhance transition effects and add conditional link rendering in… ([ff7d4cf](https://github.com/enaukkarinen/world-of-einari/commit/ff7d4cf15d7cb41e811ef997f064dea0a020d6d1))
* ensure animFrame is checked for undefined before cancellation in ngOnDestroy ([6a0184a](https://github.com/enaukkarinen/world-of-einari/commit/6a0184a7a05f62a3d0899e496d0be988e939c59a))
* improve reveal animation handling in directive and update experience component for correct tracking ([9ca66f2](https://github.com/enaukkarinen/world-of-einari/commit/9ca66f20ed0e3e5c70ea8c168114ba913f9911be))
* remove redundant transform transition from projects card styles ([50ed419](https://github.com/enaukkarinen/world-of-einari/commit/50ed419d17a1ebaa01500d6ed28b2aea3c12e120))
* update .gitignore to exclude .terraform.lock.hcl and add missing lock file ([9be3bcf](https://github.com/enaukkarinen/world-of-einari/commit/9be3bcfa42565e4cc34f2dab4d7c59b068b58640))
* update output mode to static in angular.json and comment out unused client hydration import in app.config.ts ([73f3f27](https://github.com/enaukkarinen/world-of-einari/commit/73f3f27cd39e022f4a24e719b20508c69986018f))
* update permissions in release workflow to include issues ([935515c](https://github.com/enaukkarinen/world-of-einari/commit/935515c6fe7d846d43d1f95bc776ef40610852f4))
* update project name in package.json and remove SSR entry from angular.json ([f1ab32b](https://github.com/enaukkarinen/world-of-einari/commit/f1ab32b5076896709e032a9f6f1e7124c2a379f0))
* update S3 sync paths and project name in Angular configuration ([04efef8](https://github.com/enaukkarinen/world-of-einari/commit/04efef8b7aae485905a20b393270c5ea4f3e53de))
* update tagline in resume service for grammatical consistency ([e1fc4e4](https://github.com/enaukkarinen/world-of-einari/commit/e1fc4e48ec317087a82d286220db00c9f64ee9a4))
