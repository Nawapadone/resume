# CV Print Template Design

**Date:** 2026-06-23
**Status:** Approved

## Problem

The existing PDF download (`/resume.pdf`) renders by navigating Puppeteer to the main site (`/?lang=...`). Sections below the viewport have `[data-animate]` CSS that starts at `opacity: 0` and only becomes visible when IntersectionObserver fires `is-visible`. Puppeteer never scrolls, so everything below the first viewport remains invisible — resulting in a PDF with content only on the first page and white space on subsequent pages.

## Solution

Create a dedicated CV print template (`/cv-print`) that Puppeteer navigates to instead of the main site. This template has no animations, no nav/footer, and print-optimized CSS. The `/resume.pdf` endpoint remains unchanged; only the internal URL that `PdfService` navigates to changes.

## Approach

Dedicated Handlebars layout + partials (Approach A). Follows existing NestJS/Handlebars patterns. Reuses `AppService.getResumeData()` and existing i18n translations without modification.

## Files

### New files

| File | Purpose |
|---|---|
| `views/layouts/cv-print.hbs` | Minimal layout: no nav, no footer, no JS, inline print CSS |
| `views/cv-print.hbs` | Top-level view: includes cv-* partials in order |
| `views/partials/cv-hero.hbs` | Name, title, contact info header |
| `views/partials/cv-experience.hbs` | Timeline experience section |
| `views/partials/cv-skills.hbs` | Skill groups |
| `views/partials/cv-projects.hbs` | Projects list |
| `views/partials/cv-education.hbs` | Education section |

### Modified files

| File | Change |
|---|---|
| `src/app.controller.ts` | Add `GET /cv-print` route rendering with `layout: 'cv-print'` |
| `src/pdf/pdf.service.ts` | Navigate to `/cv-print?lang=...` instead of `/?lang=...`; remove all injected CSS patches |

## Route & Data Flow

```
GET /cv-print?lang=en|th
  → LangMiddleware (existing — sets lang cookie, no changes needed)
  → AppController.cvPrint()
  → AppService.getResumeData()  (unchanged)
  → i18n translations           (unchanged)
  → render views/cv-print.hbs with { layout: 'cv-print' }

GET /resume.pdf?lang=en|th
  → PdfController (unchanged)
  → PdfService.generateResumePdf(lang)
  → Puppeteer navigates to http://localhost:{PORT}/cv-print?lang={lang}
  → returns PDF buffer
```

The `/cv-print` route is accessible by browser directly — useful for development preview without generating a PDF.

## Visual Design — Editorial Timeline (Tone C)

Matches the website's Tone C aesthetic: Playfair Display serif heading, amber accents, vertical timeline for experience, em-dash bullets.

### Layout (2 pages A4, 12mm margins)

**Page 1 — Experience**
```
┌─────────────────────────────────────────┐
│  Nawapadone C.              location    │  Playfair Display 28px #1c1917
│  // Senior Software Engineer            │  monospace 13px #b45309
│  email · phone · github · linkedin      │
│─────────────────────────────────────────│
│  EXPERIENCE                             │  9px uppercase letter-spacing #a8a29e
│  │                                      │
│  ● Senior Software Engineer · Merkle    │  amber dot #b45309
│  │   Apr 2024 – Present                 │
│  │   — Built KYC onboarding...          │  em-dash bullets
│  │   — LINE integrations...             │
│  ...all experience entries              │
└─────────────────────────────────────────┘
```

**Page 2 — Skills, Projects, Education**
```
┌─────────────────────────────────────────┐
│  SKILLS                                 │
│  Languages:  TypeScript · JS · Go · ... │
│  Backend:    NestJS · Node.js · ...     │
│                                         │
│  PROJECTS                               │
│  nawapadone.me — NestJS, HBS, Tailwind  │
│  Phone Price Tracker — Python, MCP      │
│  ...                                    │
│                                         │
│  EDUCATION                              │
│  B.Sc. CS · KMUTT · 2017–2021          │
└─────────────────────────────────────────┘
```

### Typography

| Element | Font | Size | Color |
|---|---|---|---|
| Name | Playfair Display | 28px | `#1c1917` |
| Title | monospace | 13px | `#b45309` |
| Section titles | Inter uppercase | 9px | `#a8a29e` |
| Body text | Inter | 10–11px | `#57534e` |
| Timeline line | — | 1px | `#e7e5e0` |
| Timeline dots | — | 8px circle | `#b45309` |

### CSS Strategy

All CSS is inline in `cv-print.hbs` `<style>` block. No Tailwind dependency (avoids compiled stylesheet load timing issues in Puppeteer). Fonts loaded via `@import` from Google Fonts within the same `<style>` block.

Page break: `page-break-before: always` on the Skills section separates page 1 (Experience) from page 2 (Skills + Projects + Education).

## i18n

`/cv-print` uses the same `LangMiddleware` and i18n keys as the main site. No new translation keys required. Thai font support relies on Chromium system fonts already available in the Docker image.

## What Does Not Change

- `/resume.pdf` endpoint signature and response format
- Main site (`/`) — no modifications
- `AppService.getResumeData()` — no modifications
- i18n JSON files — no modifications
- All existing animation/scroll behaviour on the main site

## Constraints

- Font loading via `@import` must complete before Puppeteer calls `page.pdf()`. Puppeteer's `waitUntil: 'networkidle0'` already handles this.
- Docker image must have Chromium system fonts for Thai (currently true per existing setup).
