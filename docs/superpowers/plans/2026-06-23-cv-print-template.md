# CV Print Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Puppeteer's live-site screenshot approach with a dedicated `/cv-print` route that renders an animation-free, print-optimised CV template, fixing the blank-page PDF bug.

**Architecture:** A new HBS layout (`views/layouts/cv-print.hbs`) with inline CSS and no JS/animations, a top-level view (`views/cv-print.hbs`) that composes five cv-specific partials, and a new `AppController.cvPrint()` handler. `PdfService` is updated to navigate to `/cv-print?lang=...` instead of `/?lang=...` and all CSS patches removed.

**Tech Stack:** NestJS, express-handlebars, Puppeteer, Google Fonts (Playfair Display, Inter, JetBrains Mono), existing nestjs-i18n.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `views/layouts/cv-print.hbs` | Minimal HTML shell, all print CSS inline, no nav/JS |
| Create | `views/cv-print.hbs` | Top-level view: renders cv-* partials in order |
| Create | `views/partials/cv-hero.hbs` | Name, title, contact info header |
| Create | `views/partials/cv-experience.hbs` | Amber-dot timeline with em-dash bullets |
| Create | `views/partials/cv-skills.hbs` | Skill groups as inline lists |
| Create | `views/partials/cv-projects.hbs` | Project cards |
| Create | `views/partials/cv-education.hbs` | Education entries |
| Modify | `src/app.controller.ts` | Add `GET /cv-print` route |
| Modify | `src/pdf/pdf.service.ts` | Navigate to `/cv-print`, remove CSS patches |

---

## Task 1: Update PdfService

**Files:**
- Modify: `src/pdf/pdf.service.ts`

- [ ] **Step 1: Replace the file content**

Replace `src/pdf/pdf.service.ts` with:

```ts
import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  async generateResumePdf(lang = 'en'): Promise<Buffer> {
    const port = process.env.PORT ?? 3000;
    const url = `http://localhost:${port}/cv-print?lang=${lang}`;

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle0' });
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '12mm', right: '14mm', bottom: '12mm', left: '14mm' },
      });
      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }
}
```

- [ ] **Step 2: Type-check**

```bash
pnpm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pdf/pdf.service.ts
git commit -m "feat(pdf): navigate to /cv-print instead of live site"
```

---

## Task 2: Create cv-print Layout

**Files:**
- Create: `views/layouts/cv-print.hbs`

- [ ] **Step 1: Create the layout file**

Create `views/layouts/cv-print.hbs`:

```html
<!DOCTYPE html>
<html lang="{{lang}}">
<head>
  <meta charset="UTF-8" />
  <title>{{resume.name}} — {{resume.title}}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html, body {
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      color: #1c1917;
      background: #ffffff;
      line-height: 1.55;
    }

    .cv-wrap {
      max-width: 100%;
    }

    /* ── Header ── */
    .cv-header {
      border-bottom: 2px solid #e7e5e0;
      padding-bottom: 14px;
      margin-bottom: 20px;
    }
    .cv-name {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 30px;
      font-weight: 800;
      color: #1c1917;
      line-height: 1.1;
      margin-bottom: 4px;
    }
    .cv-job-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #b45309;
      margin-bottom: 8px;
    }
    .cv-contact {
      font-size: 10px;
      color: #57534e;
      display: flex;
      flex-wrap: wrap;
      gap: 0;
    }
    .cv-contact-item::after {
      content: ' · ';
      color: #d6d3d1;
      white-space: pre;
    }
    .cv-contact-item:last-child::after {
      content: '';
    }

    /* ── Section ── */
    .cv-section {
      margin-bottom: 20px;
    }
    .cv-section-title {
      font-size: 8px;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #a8a29e;
      border-bottom: 1px solid #e7e5e0;
      padding-bottom: 4px;
      margin-bottom: 12px;
    }

    /* ── Timeline (Experience) ── */
    .cv-timeline {
      border-left: 2px solid #e7e5e0;
      padding-left: 20px;
      margin-left: 2px;
    }
    .cv-entry {
      position: relative;
      margin-bottom: 16px;
    }
    .cv-entry:last-child {
      margin-bottom: 0;
    }
    .cv-entry::before {
      content: '';
      position: absolute;
      left: -25px;
      top: 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ffffff;
      border: 2px solid #b45309;
    }
    .cv-entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 1px;
    }
    .cv-entry-title {
      font-size: 11px;
      font-weight: 700;
      color: #1c1917;
    }
    .cv-entry-period {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      color: #a8a29e;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .cv-entry-company {
      font-size: 10px;
      color: #b45309;
      font-weight: 600;
      margin-bottom: 5px;
    }
    .cv-bullets {
      list-style: none;
      margin-bottom: 6px;
    }
    .cv-bullets li {
      font-size: 9.5px;
      color: #57534e;
      line-height: 1.5;
      padding-left: 14px;
      position: relative;
      margin-bottom: 3px;
    }
    .cv-bullets li::before {
      content: '—';
      position: absolute;
      left: 0;
      color: #d6d3d1;
    }
    .cv-tech {
      display: flex;
      flex-wrap: wrap;
      gap: 3px;
    }
    .cv-badge {
      font-size: 8px;
      background: #f5f0e8;
      color: #78716c;
      border: 1px solid #e7e0d6;
      border-radius: 100px;
      padding: 1px 6px;
    }

    /* ── Skills ── */
    .cv-skill-row {
      display: flex;
      gap: 8px;
      margin-bottom: 5px;
      font-size: 10px;
    }
    .cv-skill-category {
      font-weight: 600;
      color: #1c1917;
      min-width: 80px;
      flex-shrink: 0;
    }
    .cv-skill-list {
      color: #57534e;
    }

    /* ── Projects ── */
    .cv-project {
      margin-bottom: 10px;
    }
    .cv-project:last-child {
      margin-bottom: 0;
    }
    .cv-project-header {
      display: flex;
      align-items: baseline;
      gap: 6px;
      margin-bottom: 2px;
    }
    .cv-project-name {
      font-size: 10.5px;
      font-weight: 700;
      color: #1c1917;
    }
    .cv-project-link {
      font-size: 8.5px;
      color: #b45309;
      font-family: 'JetBrains Mono', monospace;
      text-decoration: none;
    }
    .cv-project-desc {
      font-size: 9px;
      color: #57534e;
      line-height: 1.5;
    }
    .cv-project-tech {
      font-size: 8.5px;
      color: #a8a29e;
      font-family: 'JetBrains Mono', monospace;
      margin-top: 2px;
    }

    /* ── Education ── */
    .cv-edu-entry {
      margin-bottom: 10px;
    }
    .cv-edu-entry:last-child {
      margin-bottom: 0;
    }
    .cv-edu-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 8px;
    }
    .cv-edu-degree {
      font-size: 10.5px;
      font-weight: 700;
      color: #1c1917;
    }
    .cv-edu-period {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      color: #a8a29e;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .cv-edu-institution {
      font-size: 9.5px;
      color: #b45309;
      font-weight: 600;
    }

    /* ── Achievements ── */
    .cv-achievements {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 10px;
    }
    .cv-achievement-label {
      font-size: 8px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #a8a29e;
      margin-bottom: 6px;
    }

    /* ── Page break ── */
    .page-break {
      page-break-before: always;
      break-before: always;
    }
  </style>
</head>
<body>
  <div class="cv-wrap">
    {{{body}}}
  </div>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add views/layouts/cv-print.hbs
git commit -m "feat(cv): add cv-print layout with inline print CSS"
```

---

## Task 3: Create cv-hero Partial

**Files:**
- Create: `views/partials/cv-hero.hbs`

- [ ] **Step 1: Create the partial**

Create `views/partials/cv-hero.hbs`:

```hbs
<header class="cv-header">
  <div class="cv-name">{{t.hero_name}}</div>
  <div class="cv-job-title">// {{t.hero_title}}</div>
  <div class="cv-contact">
    <span class="cv-contact-item">{{resume.location}}</span>
    <span class="cv-contact-item">{{resume.email}}</span>
    <span class="cv-contact-item">{{resume.phone}}</span>
    <span class="cv-contact-item">{{resume.github}}</span>
    <span class="cv-contact-item">{{resume.linkedin}}</span>
    <span class="cv-contact-item">{{resume.resumeUrl}}</span>
  </div>
</header>
```

- [ ] **Step 2: Commit**

```bash
git add views/partials/cv-hero.hbs
git commit -m "feat(cv): add cv-hero partial"
```

---

## Task 4: Create cv-experience Partial

**Files:**
- Create: `views/partials/cv-experience.hbs`

- [ ] **Step 1: Create the partial**

Create `views/partials/cv-experience.hbs`:

```hbs
<section class="cv-section">
  <div class="cv-section-title">{{t.exp_section_title}}</div>
  <div class="cv-timeline">
    {{#each resume.experience}}
    <div class="cv-entry">
      <div class="cv-entry-header">
        <span class="cv-entry-title">{{this.title}}</span>
        <span class="cv-entry-period">{{this.period}}</span>
      </div>
      <div class="cv-entry-company">{{this.company}} · {{this.location}}</div>
      <ul class="cv-bullets">
        {{#each this.bullets}}
        <li>{{this}}</li>
        {{/each}}
      </ul>
      <div class="cv-tech">
        {{#each this.tech}}
        <span class="cv-badge">{{this}}</span>
        {{/each}}
      </div>
    </div>
    {{/each}}
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add views/partials/cv-experience.hbs
git commit -m "feat(cv): add cv-experience partial"
```

---

## Task 5: Create cv-skills Partial

**Files:**
- Create: `views/partials/cv-skills.hbs`

- [ ] **Step 1: Create the partial**

Create `views/partials/cv-skills.hbs`:

```hbs
<section class="cv-section">
  <div class="cv-section-title">{{t.skills_section_title}}</div>
  {{#each resume.skillGroups}}
  <div class="cv-skill-row">
    <span class="cv-skill-category">{{this.category}}</span>
    <span class="cv-skill-list">{{join this.skills ' · '}}</span>
  </div>
  {{/each}}
</section>
```

Note: the `join` helper does not exist yet. It will be added in Task 8 when the controller is wired up. For now the partial is created without worrying about the helper — it will be registered in `src/main.ts` before the route is live.

- [ ] **Step 2: Commit**

```bash
git add views/partials/cv-skills.hbs
git commit -m "feat(cv): add cv-skills partial"
```

---

## Task 6: Create cv-projects Partial

**Files:**
- Create: `views/partials/cv-projects.hbs`

- [ ] **Step 1: Create the partial**

Create `views/partials/cv-projects.hbs`:

```hbs
<section class="cv-section">
  <div class="cv-section-title">{{t.proj_section_title}}</div>
  {{#each resume.projects}}
  <div class="cv-project">
    <div class="cv-project-header">
      <span class="cv-project-name">{{this.name}}</span>
      {{#if this.link}}
      <span class="cv-project-link">{{this.link}}</span>
      {{/if}}
    </div>
    <div class="cv-project-desc">{{this.description}}</div>
    <div class="cv-project-tech">{{join this.tech ' · '}}</div>
  </div>
  {{/each}}

  {{#if resume.projectAchievements}}
  <div style="margin-top:12px;">
    <div class="cv-achievement-label">{{t.proj_achievements_title}}</div>
    <div class="cv-achievements">
      {{#each resume.projectAchievements}}
      <span class="cv-badge">{{this}}</span>
      {{/each}}
    </div>
  </div>
  {{/if}}
</section>
```

- [ ] **Step 2: Commit**

```bash
git add views/partials/cv-projects.hbs
git commit -m "feat(cv): add cv-projects partial"
```

---

## Task 7: Create cv-education Partial

**Files:**
- Create: `views/partials/cv-education.hbs`

- [ ] **Step 1: Create the partial**

Create `views/partials/cv-education.hbs`:

```hbs
<section class="cv-section">
  <div class="cv-section-title">{{t.edu_section_title}}</div>
  {{#each resume.education}}
  <div class="cv-edu-entry">
    <div class="cv-edu-header">
      <span class="cv-edu-degree">{{this.degree}}</span>
      <span class="cv-edu-period">{{this.period}}</span>
    </div>
    <div class="cv-edu-institution">{{this.institution}} · {{this.location}}</div>
  </div>
  {{/each}}
</section>
```

- [ ] **Step 2: Commit**

```bash
git add views/partials/cv-education.hbs
git commit -m "feat(cv): add cv-education partial"
```

---

## Task 8: Create View, Add join Helper, Add Controller Route

**Files:**
- Create: `views/cv-print.hbs`
- Modify: `src/main.ts` (add `join` Handlebars helper)
- Modify: `src/app.controller.ts` (add `GET /cv-print`)

- [ ] **Step 1: Create `views/cv-print.hbs`**

```hbs
{{> cv-hero}}
{{> cv-experience}}
<div class="page-break"></div>
{{> cv-skills}}
{{> cv-projects}}
{{> cv-education}}
```

- [ ] **Step 2: Add `join` helper to `src/main.ts`**

In `src/main.ts`, find the `helpers` block inside `engine(...)` and add the `join` helper:

```ts
    helpers: {
      eq: (a: unknown, b: unknown) => a === b,
      join: (arr: string[], separator: string) => arr.join(separator),
    },
```

Full updated `app.engine(...)` call:

```ts
  app.engine(
    'hbs',
    engine({
      extname: 'hbs',
      layoutsDir: join(__dirname, '../..', 'views', 'layouts'),
      partialsDir: join(__dirname, '../..', 'views', 'partials'),
      defaultLayout: 'main',
      helpers: {
        eq: (a: unknown, b: unknown) => a === b,
        join: (arr: string[], separator: string) => arr.join(separator),
      },
    }),
  );
```

- [ ] **Step 3: Add `GET /cv-print` to `src/app.controller.ts`**

Add these constants near the top of `app.controller.ts`, after the existing `TRANSLATION_KEYS` block:

```ts
const CV_TRANSLATION_KEYS = [
  'hero_name',
  'hero_title',
  'exp_section_title',
  'skills_section_title',
  'edu_section_title',
  'proj_section_title',
  'proj_achievements_title',
] as const;

type CvTranslationKey = (typeof CV_TRANSLATION_KEYS)[number];
type CvTranslations = Record<CvTranslationKey, string>;
```

Then add this method inside `AppController`, after the `index()` method:

```ts
  @Get('cv-print')
  cvPrint(@Res() res: Response, @I18n() i18n: I18nContext): void {
    const lang = i18n.lang;
    const t = Object.fromEntries(
      CV_TRANSLATION_KEYS.map((key) => [key, String(i18n.t(`translation.${key}`))]),
    ) as CvTranslations;
    const resume = this.appService.getResumeData();
    res.render('cv-print', { layout: 'cv-print', t, lang, resume });
  }
```

- [ ] **Step 4: Type-check**

```bash
pnpm run typecheck
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add views/cv-print.hbs src/main.ts src/app.controller.ts
git commit -m "feat(cv): add /cv-print route and join HBS helper"
```

---

## Task 9: Verify End-to-End

- [ ] **Step 1: Start dev server**

```bash
pnpm run dev
```

Wait until you see `Resume site running on http://localhost:3000`.

- [ ] **Step 2: Preview CV in browser**

Open `http://localhost:3000/cv-print?lang=en` in a browser.

Expected:
- Name "Nawapadone Chanpeng" in Playfair Display serif at the top
- Contact info line below
- Experience section with amber-dot timeline and em-dash bullets
- Tech badges on each entry

- [ ] **Step 3: Preview Thai version**

Open `http://localhost:3000/cv-print?lang=th` in a browser.

Expected:
- Name shows "นวปฎล จันทร์เพ็ง"
- Section titles in Thai
- No layout breakage

- [ ] **Step 4: Download PDF and verify**

Open `http://localhost:3000/resume.pdf?lang=en` — the browser will download the PDF.

Expected:
- Page 1: hero header + full experience section (all entries visible, not white)
- Page 2: skills + projects + education
- No white/blank pages
- All text visible (opacity 1, no animation artifacts)

- [ ] **Step 5: Download Thai PDF**

Open `http://localhost:3000/resume.pdf?lang=th`.

Expected: same structure with Thai text, Thai font rendering correctly.

- [ ] **Step 6: Commit final verification note**

If any minor CSS tweaks were made during verification, stage and commit them:

```bash
git add -p   # review any changes
git commit -m "fix(cv): tweak print CSS after visual verification"
```

If no changes were needed, skip this step.
