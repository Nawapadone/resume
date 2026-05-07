# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Make sure use node version 22
nvm use 22

# Development (NestJS watch + Tailwind watch, concurrent)
pnpm run dev

# Build
pnpm run build           # Compile TypeScript → dist/
pnpm run tailwind:build  # Compile Tailwind CSS → public/styles/output.css

# Production
pnpm run prod            # node dist/src/main

# Type checking
pnpm run typecheck       # tsc --noEmit

# Code quality
pnpm run lint            # ESLint with auto-fix
pnpm run format          # Prettier
```

There is no test suite in this project.

## Architecture

NestJS backend serving a server-side rendered resume/portfolio site via Express Handlebars. The app is stateless and deployed as a Docker container on Google Cloud Run.

**Request flow:** HTTP request → `LangMiddleware` (language detection from query/cookie/header) → `AppController` renders `views/index.hbs` with resume data from `AppService` and translations injected at render time. PDF download hits `PdfController` which launches headless Chrome (Puppeteer) to render `/?lang=en` and returns the PDF buffer.

**Key source locations:**

- [src/app.service.ts](src/app.service.ts) — all resume content (experience, projects, skills, education) as hardcoded TypeScript objects with typed interfaces
- [src/app.controller.ts](src/app.controller.ts) — renders the main page, passes translated strings via const-asserted keys
- [src/pdf/pdf.service.ts](src/pdf/pdf.service.ts) — Puppeteer PDF generation; navigates to localhost and applies print-safe CSS
- [src/middleware/lang.middleware.ts](src/middleware/lang.middleware.ts) — sets `lang` cookie (1-year, HttpOnly), priority: query param > cookie > Accept-Language
- [src/i18n/](src/i18n/) — `en/translation.json` and `th/translation.json` for all UI strings
- [views/](views/) — Handlebars templates; `layouts/main.hbs` is the master layout, sections are partials

**Styling:** Tailwind CSS with `class`-based dark mode. The compiled output is committed at [public/styles/output.css](public/styles/output.css). Run `tailwind:build` after changing [src/styles/input.css](src/styles/input.css) or Tailwind classes. Theme toggle persists to `localStorage` on the client to avoid flash-of-wrong-theme.

**i18n:** `nestjs-i18n` with JSON files. All user-visible strings must have keys in both `en/translation.json` and `th/translation.json`. The controller passes resolved strings to Handlebars — there is no client-side i18n.

**Deployment:** `deploy.sh` builds a Docker image, pushes to GCP Artifact Registry, and deploys to Cloud Run. The Dockerfile installs Chromium system dependencies for Puppeteer; the executable path is provided via environment variable.
