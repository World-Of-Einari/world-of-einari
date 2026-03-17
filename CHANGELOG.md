# [1.4.0](https://github.com/World-Of-Einari/world-of-einari/compare/v1.3.0...v1.4.0) (2026-03-17)


### Bug Fixes

* add [skip ci] to release commit message for semantic-release ([b70bb57](https://github.com/World-Of-Einari/world-of-einari/commit/b70bb570ea5bc3fb5c9ffb8764d98cbb7b1bf65b))


### Features

* enhance release workflow with semantic-release packages ([d02b5f5](https://github.com/World-Of-Einari/world-of-einari/commit/d02b5f50823cbedb45d10abe2e3f812b9992f739))
* update deployment workflows and add semantic release configuration ([833e253](https://github.com/World-Of-Einari/world-of-einari/commit/833e253b45c9ee4e5c8f6ae4a3629330fae6fadc))

# Changelog

## [1.3.0](https://github.com/World-Of-Einari/world-of-einari/compare/v1.2.0...v1.3.0) (2026-03-17)


### Features

* add GitHub Actions workflow for running tests on pull requests and pushes ([11b0b89](https://github.com/World-Of-Einari/world-of-einari/commit/11b0b8943643bf87987847fb952074010335872d))
* add GitHub workflows for API and frontend deployment ([f7c8980](https://github.com/World-Of-Einari/world-of-einari/commit/f7c8980a531e42e5fd75e6f7b860f146ee312e84))
* add Lambda function and SSM parameter for OpenAI API key management ([f84068f](https://github.com/World-Of-Einari/world-of-einari/commit/f84068fbfca65fb6c6dc081eb4a30b0c327de2ee))
* add proxy configuration for API and update experience years in resume service ([3b941a3](https://github.com/World-Of-Einari/world-of-einari/commit/3b941a32b700fd3988c9624105bee06b30e23342))
* add public access policy for Lambda Function URL and update com… ([2e1c9dd](https://github.com/World-Of-Einari/world-of-einari/commit/2e1c9dd75d5549408c511c288c9cfae953e8df00))
* add public access policy for Lambda Function URL and update comments ([6e798be](https://github.com/World-Of-Einari/world-of-einari/commit/6e798be687a53b7c3c89a74ff9c1a90e014ae063))
* add S3 backend configuration and define new variables for AWS account and CloudFront ([76d4c74](https://github.com/World-Of-Einari/world-of-einari/commit/76d4c74f93a1bb95c9a9a2f76ba8eefb63770dbf))
* add workflows documentation for CI/CD pipeline overview and details ([6599fe1](https://github.com/World-Of-Einari/world-of-einari/commit/6599fe114fc02d808fa56aafb20fbabfe01334b8))
* create a chat feature ([9763184](https://github.com/World-Of-Einari/world-of-einari/commit/97631842980c18246f21a71f586f433e66115409))
* enhance project description in resume service with detailed achievements and methodologies ([d7d42d3](https://github.com/World-Of-Einari/world-of-einari/commit/d7d42d3d5c484d00bd8e5068295906fa897e6efc))
* implement chat messages component and refactor chat structure ([ada7482](https://github.com/World-Of-Einari/world-of-einari/commit/ada7482260afff6b67660d18f64d817b421bba5c))
* implement rate limiting for chat requests and enhance error handling in chat component ([3c92284](https://github.com/World-Of-Einari/world-of-einari/commit/3c922844243e82d1ae91fcd744f4bc223e633134))
* refactor chat component structure and implement new chat input and FAB components ([a69bc6e](https://github.com/World-Of-Einari/world-of-einari/commit/a69bc6e1e2c7d409b0ac8e9ea809398887010560))
* refactor GitHub Actions workflows for deployment and testing ([1874a3e](https://github.com/World-Of-Einari/world-of-einari/commit/1874a3e6d20dd54aa2d5e6e8c2495b0caac8f0a0))
* refactor GitHub Actions workflows for deployment and testing ([c66ca2e](https://github.com/World-Of-Einari/world-of-einari/commit/c66ca2e38cc064801d686a1fadcd4403ae875e6b))
* remove Angular Material dependencies and update styles for project components ([b0c9b4f](https://github.com/World-Of-Einari/world-of-einari/commit/b0c9b4fc39ed8af1818f1cda9b8dca8965d6849d))
* skip deployment on release merges ([9464c69](https://github.com/World-Of-Einari/world-of-einari/commit/9464c6910e4f396fcd58ee168d406c1d382fb002))
* update .gitignore to include terraform.tfvars and ensure backup files are ignored ([639e7e9](https://github.com/World-Of-Einari/world-of-einari/commit/639e7e9cf36d89f2d6f2f55fa764ee7056077b16))
* update deploy workflow condition to allow manual triggering ([292a967](https://github.com/World-Of-Einari/world-of-einari/commit/292a96733806bb8cf0a276e099e76e4f4e684195))
* update project descriptions to support multiple lines and adjust styling ([e59f619](https://github.com/World-Of-Einari/world-of-einari/commit/e59f619e18fccf3eec152d6d960a9a28f328f496))
* update project descriptions to use arrays for consistency and a… ([8ad9a77](https://github.com/World-Of-Einari/world-of-einari/commit/8ad9a779875c41b3eef41d21031b1c48d547d51e))
* update project descriptions to use arrays for consistency and adjust snapshot tests ([bbb09ac](https://github.com/World-Of-Einari/world-of-einari/commit/bbb09ace15d6cbf1eee797efbac5a1d05c916291))
* update README for clarity and consistency in project description and commands ([78722ee](https://github.com/World-Of-Einari/world-of-einari/commit/78722eefb8cd748761da6275ea2b3976966a1e2a))


### Bug Fixes

* add build step before linting and testing in CI workflow ([690b419](https://github.com/World-Of-Einari/world-of-einari/commit/690b41974b8a4b6dfdfb0c7c48854e5741fda539))
* add pruning logic to rate limit store for expired entries ([ab9fc03](https://github.com/World-Of-Einari/world-of-einari/commit/ab9fc03004b35c6f5ff1b327ecb93a444ff10332))
* handle empty messages by ending response stream in handleChat function ([4875b9b](https://github.com/World-Of-Einari/world-of-einari/commit/4875b9b76b14f091a6db52041c92fb6f3512b40a))
* lambda error handling improvement ([a8dd3c3](https://github.com/World-Of-Einari/world-of-einari/commit/a8dd3c3e5c621c91ff131437791c69e4d526286b))
* rename toggle output to toggled for consistency in chat-fab component ([a777d74](https://github.com/World-Of-Einari/world-of-einari/commit/a777d74b12bf767c158fd79d69353096a533338b))
* update deployment triggers to include workflow_run and refine conditions ([7664eeb](https://github.com/World-Of-Einari/world-of-einari/commit/7664eeb2c2c4199e1f02d90cbe5eb44f00a13b46))
* update error handling for rate limiting and change filename in Lambda function ([ec8d2aa](https://github.com/World-Of-Einari/world-of-einari/commit/ec8d2aa795ecd4a6d4e26fed65b061081b3ca72c))
* update footer padding for consistency across breakpoints ([4a0abd0](https://github.com/World-Of-Einari/world-of-einari/commit/4a0abd0c31161d2c35df752581f23e695cbf24b9))
* update footer padding for consistency across breakpoints ([b139b01](https://github.com/World-Of-Einari/world-of-einari/commit/b139b0127f693ce20553030e2ddcfc7d22137487))
* update innerHTML usage in about and hero components for better rendering ([d351f1b](https://github.com/World-Of-Einari/world-of-einari/commit/d351f1ba18c54edbf6ccb87e7c5c3c716e3a0f53))

## [1.2.0](https://github.com/World-Of-Einari/world-of-einari/compare/v1.1.0...v1.2.0) (2026-03-11)


### Features

* enable manual workflow dispatch for deployment ([08644d9](https://github.com/World-Of-Einari/world-of-einari/commit/08644d9b0b62a2ea3a376dd7b65cf261dece32b9))

## [1.1.0](https://github.com/enaukkarinen/world-of-einari/compare/v1.0.0...v1.1.0) (2026-03-09)


### Features

* add meta tags for SEO and social media sharing ([4392886](https://github.com/enaukkarinen/world-of-einari/commit/43928865f0289a563c6ad5bfa5b6f16b67fa2ec0))

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
