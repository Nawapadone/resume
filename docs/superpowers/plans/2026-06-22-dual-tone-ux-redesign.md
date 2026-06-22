# Dual-Tone UX Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-theme resume site with two distinct visual personalities (Tone B: bold dark, Tone C: editorial warm light) randomly assigned per device via localStorage, with PDF always rendered in Tone C.

**Architecture:** Tone B reuses the existing `class="dark"` mechanism on `<html>` — `dark:` Tailwind classes become Tone B styles. Tone C is the default (no dark class) and replaces the old light theme with warm editorial styles. A single inline script before first paint handles tone assignment from localStorage, with a `?tone=c` URL override for Puppeteer PDF rendering.

**Tech Stack:** NestJS, Handlebars (hbs), Tailwind CSS v3, Puppeteer, Google Fonts (Inter, JetBrains Mono, Playfair Display)

**Spec:** `docs/superpowers/specs/2026-06-22-dual-tone-ux-redesign.md`

**No test suite** — verification steps use the dev server and browser.

---

## File Map

| File | Change |
|---|---|
| `src/pdf/pdf.service.ts` | Set `dataset.tone = 'c'` in `page.evaluate` |
| `tailwind.config.js` | Add `Playfair Display` to fontFamily.display |
| `views/layouts/main.hbs` | Replace dark-mode script → tone script; add Playfair Display font import |
| `src/styles/input.css` | Full color system rewrite for Tone B/C; add glow, serif, timeline, scroll animation CSS |
| `views/partials/header.hbs` | Remove `#theme-toggle` button; update nav dark: classes for Tone B |
| `views/partials/hero.hbs` | Add glow blobs; add `.hero-name` class to span; update QR colors by tone |
| `views/partials/experience.hbs` | Add `data-animate`; CSS timeline comes from input.css (no HTML change) |
| `views/partials/skills.hbs` | Add `data-animate` |
| `views/partials/projects.hbs` | Add `data-animate` |
| `views/partials/education.hbs` | Add `data-animate` |
| `views/partials/contact.hbs` | Add `data-animate` |
| `views/partials/footer.hbs` | Add IntersectionObserver script block |

---

## Task 1: Force Tone C in PDF Service

**Files:**
- Modify: `src/pdf/pdf.service.ts:19`

The PDF service already removes `dark` class, which triggers Tone C. We just need to also set `dataset.tone = 'c'` so any `data-tone`-based CSS fires correctly.

- [ ] **Open `src/pdf/pdf.service.ts` and replace the `page.evaluate` call at line 19:**

```typescript
await page.evaluate(() => {
  document.documentElement.classList.remove('dark');
  document.documentElement.dataset.tone = 'c';
});
```

- [ ] **Run typecheck to confirm no TS errors:**

```bash
pnpm run typecheck
```

Expected: no errors.

- [ ] **Commit:**

```bash
git add src/pdf/pdf.service.ts
git commit -m "feat: force Tone C (editorial) for PDF generation"
```

---

## Task 2: Tone Assignment Script + Font Import

**Files:**
- Modify: `views/layouts/main.hbs`
- Modify: `tailwind.config.js`

Replaces the dark-mode flash-prevention script with the tone assignment script. Also adds Playfair Display (used by Tone C headings).

- [ ] **In `tailwind.config.js`, add `display` to `fontFamily`:**

```js
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['"JetBrains Mono"', 'monospace'],
  display: ['"Playfair Display"', 'Georgia', 'serif'],
},
```

- [ ] **In `views/layouts/main.hbs`, replace the Google Fonts `<link>` (line 43) with:**

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,700;0,800;1,400&display=swap" rel="stylesheet" />
```

- [ ] **In `views/layouts/main.hbs`, replace the entire dark-mode inline `<script>` block (lines 48–57) with the tone script:**

```html
{{!-- Assign tone before first paint to prevent flash --}}
<script>
  (function () {
    try {
      var params = new URLSearchParams(location.search);
      var forced = params.get('tone');
      if (!forced && !localStorage.getItem('resume-tone')) {
        localStorage.setItem('resume-tone', Math.random() < 0.5 ? 'b' : 'c');
      }
      var tone = forced || localStorage.getItem('resume-tone');
      document.documentElement.dataset.tone = tone;
      if (tone === 'b') {
        document.documentElement.classList.add('dark');
      }
    } catch (_) {}
  })();
</script>
```

- [ ] **In `views/layouts/main.hbs`, remove the theme-toggle JS at the bottom (lines 70–80):**

Delete the entire `<script>` block:
```html
<script>
  document.getElementById('theme-toggle').addEventListener('click', function () {
    ...
  });
</script>
```

- [ ] **Commit:**

```bash
git add views/layouts/main.hbs tailwind.config.js
git commit -m "feat: add per-device tone assignment (B=dark, C=editorial)"
```

---

## Task 3: CSS Foundation — Full Color & Type System

**Files:**
- Modify: `src/styles/input.css`

This is the largest task. Rewrites the color system for both tones and adds all custom CSS that Tailwind classes can't express alone (gradients, glassmorphism, serif headings, timeline, glow).

- [ ] **Replace the entire contents of `src/styles/input.css` with:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ─────────────────────────────────────────
   BASE
───────────────────────────────────────── */

@layer base {
  html {
    scroll-behavior: smooth;
  }

  /* Tone C (default light — no dark class) */
  body {
    background-color: #faf8f5;
    color: #1c1917;
    @apply font-sans antialiased transition-colors duration-300;
  }

  /* Tone B (dark class present) */
  .dark body {
    background-color: #08080f;
    color: #e2e8f0;
  }
}

/* ─────────────────────────────────────────
   PRINT (PDF)
───────────────────────────────────────── */

@media print {
  .card { break-inside: avoid; page-break-inside: avoid; }
  section { break-inside: avoid; page-break-inside: avoid; }
  li { break-inside: avoid; page-break-inside: avoid; }
}

/* ─────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────── */

@layer components {

  /* Section title */
  .section-title {
    @apply text-2xl font-bold mb-8 flex items-center gap-3;
    color: #1c1917;
  }
  .dark .section-title {
    color: #e2e8f0;
  }

  /* Accent bar (left of section title) */
  .accent-bar {
    @apply w-1 h-6 rounded-full inline-block flex-shrink-0;
    background-color: #b45309; /* Tone C: amber */
  }
  .dark .accent-bar {
    background-color: #6366f1; /* Tone B: indigo */
  }

  /* Card */
  .card {
    @apply rounded-xl border p-6 transition-shadow duration-200;
    background-color: #ffffff;
    border-color: #e7e5e0;
  }
  .card:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  .dark .card {
    background-color: rgba(255,255,255,0.03);
    border-color: rgba(255,255,255,0.07);
    backdrop-filter: blur(4px);
  }
  .dark .card:hover {
    box-shadow: none;
    border-color: rgba(255,255,255,0.12);
  }

  /* Badge */
  .badge {
    @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border;
    background-color: #f5f0e8;
    color: #78716c;
    border-color: #e7e0d6;
  }
  .dark .badge {
    background-color: rgba(99,102,241,0.15);
    color: #818cf8;
    border-color: rgba(99,102,241,0.2);
  }

  /* Primary button */
  .btn-primary {
    @apply inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm;
    background-color: #1c1917;
    color: #faf8f5;
  }
  .btn-primary:hover {
    background-color: #292524;
  }
  .dark .btn-primary {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: #ffffff;
    box-shadow: 0 0 16px rgba(99,102,241,0.35);
  }
  .dark .btn-primary:hover {
    box-shadow: 0 0 24px rgba(99,102,241,0.5);
  }

  /* Secondary button */
  .btn-secondary {
    @apply inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200;
    border: 1px solid #d6d3d1;
    color: #57534e;
    background: transparent;
  }
  .btn-secondary:hover {
    background-color: #f5f0e8;
  }
  .dark .btn-secondary {
    border-color: rgba(99,102,241,0.4);
    color: #a5b4fc;
  }
  .dark .btn-secondary:hover {
    background-color: rgba(99,102,241,0.08);
  }

  /* Nav link */
  .nav-link {
    @apply text-sm font-medium transition-colors duration-200;
    color: #78716c;
  }
  .nav-link:hover {
    color: #b45309;
  }
  .dark .nav-link {
    color: #64748b;
  }
  .dark .nav-link:hover {
    color: #818cf8;
  }

  /* Icon button */
  .icon-btn {
    @apply p-2 rounded-lg transition-colors duration-200;
    color: #78716c;
  }
  .icon-btn:hover {
    color: #1c1917;
    background-color: #f5f0e8;
  }
  .dark .icon-btn {
    color: #64748b;
  }
  .dark .icon-btn:hover {
    color: #e2e8f0;
    background-color: rgba(255,255,255,0.06);
  }
}

/* ─────────────────────────────────────────
   TONE B — Bold & Modern (dark specifics)
───────────────────────────────────────── */

/* Hero gradient name */
.dark .hero-name {
  background: linear-gradient(135deg, #e2e8f0 30%, #a5b4fc 70%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Hero glow blobs */
.hero-glow-1 {
  display: none;
  position: absolute;
  top: -60px; right: -40px;
  width: 220px; height: 220px;
  background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%);
  pointer-events: none;
  border-radius: 50%;
}
.hero-glow-2 {
  display: none;
  position: absolute;
  bottom: -40px; left: 10px;
  width: 160px; height: 160px;
  background: radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%);
  pointer-events: none;
  border-radius: 50%;
}
.dark .hero-glow-1,
.dark .hero-glow-2 {
  display: block;
}

/* Section title in Tone B */
.dark .section-title {
  font-weight: 700;
  letter-spacing: -0.3px;
}

/* Experience bullet prefix override for Tone B */
.dark .exp-bullet-icon {
  color: #818cf8;
}

/* ─────────────────────────────────────────
   TONE C — Editorial & Timeless (light specifics)
───────────────────────────────────────── */

/* Serif display headings */
:root:not(.dark) .hero-heading {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 800;
  letter-spacing: -1px;
}

/* Hero name span: amber */
:root:not(.dark) .hero-name {
  color: #b45309;
}

/* Section title: uppercase + full-width rule */
:root:not(.dark) .section-title {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #a8a29e;
  font-family: 'Inter', sans-serif;
}
:root:not(.dark) .section-title::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e7e5e0;
}
:root:not(.dark) .accent-bar {
  display: none;
}

/* Alternate section backgrounds (experience, education, contact) */
:root:not(.dark) .bg-slate-100\/60 {
  background-color: rgba(245, 240, 232, 0.6);
}
.dark .bg-slate-900\/60 {
  background-color: rgba(8, 8, 15, 0.6);
}

/* Experience timeline for Tone C */
:root:not(.dark) #experience .card {
  background: transparent;
  border: none;
  border-left: 2px solid #e7e5e0;
  border-radius: 0;
  padding: 0 0 20px 20px;
  position: relative;
  box-shadow: none;
}
:root:not(.dark) #experience .card::before {
  content: '';
  position: absolute;
  left: -5px; top: 4px;
  width: 8px; height: 8px;
  background: #faf8f5;
  border: 2px solid #b45309;
  border-radius: 50%;
}
:root:not(.dark) #experience .card:hover {
  box-shadow: none;
  border-color: #e7e5e0;
}
:root:not(.dark) #experience .space-y-5 {
  gap: 0;
}

/* Company name: amber in Tone C */
:root:not(.dark) .exp-company {
  color: #b45309;
}

/* Exp bullet in Tone C: em dash */
:root:not(.dark) .exp-bullet-icon {
  display: none;
}
:root:not(.dark) li.exp-bullet::before {
  content: '—';
  color: #d6d3d1;
  flex-shrink: 0;
  margin-right: 8px;
}

/* ─────────────────────────────────────────
   SCROLL ANIMATIONS
───────────────────────────────────────── */

[data-animate] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
[data-animate].is-visible {
  opacity: 1;
  transform: translateY(0);
}

[data-animate] .card:nth-child(1) { transition-delay: 0.05s; }
[data-animate] .card:nth-child(2) { transition-delay: 0.10s; }
[data-animate] .card:nth-child(3) { transition-delay: 0.15s; }
[data-animate] .card:nth-child(4) { transition-delay: 0.20s; }
[data-animate] .card:nth-child(5) { transition-delay: 0.25s; }
[data-animate] .card:nth-child(6) { transition-delay: 0.30s; }

@media (prefers-reduced-motion: reduce) {
  [data-animate],
  [data-animate].is-visible {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

/* ─────────────────────────────────────────
   LEGACY (animations kept from original)
───────────────────────────────────────── */

@layer components {
  .animate-fade-in {
    animation: fadeIn 0.6s ease-out;
  }
}

@keyframes fadeIn {
  0%   { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
}
```

- [ ] **Build Tailwind to check for CSS errors:**

```bash
pnpm run tailwind:build
```

Expected: `output.css` regenerated with no errors.

- [ ] **Commit:**

```bash
git add src/styles/input.css public/styles/output.css tailwind.config.js
git commit -m "feat: add dual-tone CSS foundation (Tone B dark, Tone C editorial)"
```

---

## Task 4: Header — Remove Toggle, Update Styles

**Files:**
- Modify: `views/partials/header.hbs`

- [ ] **Replace the entire contents of `views/partials/header.hbs`:**

```html
<header
  class='sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300'
  style='background: var(--header-bg); border-color: var(--header-border);'
>
  <style>
    :root:not(.dark) { --header-bg: rgba(250,248,245,0.85); --header-border: #e7e5e0; }
    .dark { --header-bg: rgba(8,8,15,0.8); --header-border: rgba(255,255,255,0.06); }
  </style>
  <div class='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>

    <a href='/' class='nav-link text-base font-bold'>
      {{resume.name}}
    </a>

    <nav class='hidden md:flex items-center gap-6' aria-label='Main navigation'>
      <a href='#about'      class='nav-link'>{{t.nav_about}}</a>
      <a href='#experience' class='nav-link'>{{t.nav_experience}}</a>
      <a href='#skills'     class='nav-link'>{{t.nav_skills}}</a>
      <a href='#projects'   class='nav-link'>{{t.nav_projects}}</a>
      <a href='#education'  class='nav-link'>{{t.nav_education}}</a>
      <a href='#contact'    class='nav-link'>{{t.nav_contact}}</a>
    </nav>

    <div class='flex items-center gap-1'>
      <a
        href='/?lang={{alternateLang}}'
        class='icon-btn text-xs font-semibold tracking-wide px-3'
        aria-label='Switch language'
      >
        {{t.lang_switch_to}}
      </a>
    </div>

  </div>
</header>
```

- [ ] **Commit:**

```bash
git add views/partials/header.hbs
git commit -m "feat: remove dark/light toggle from header, wire tone-aware nav styles"
```

---

## Task 5: Hero Section — Glow Blobs, Gradient Name, Serif Heading

**Files:**
- Modify: `views/partials/hero.hbs`

Key changes:
- Add `class="hero-heading"` to `<h1>` — Tone C applies Playfair Display via CSS
- Add `class="hero-name"` to the name `<span>` — Tone B gets gradient, Tone C gets amber
- Wrap hero inner div in `position: relative` to anchor glow blobs
- Add glow blob divs (hidden in Tone C via CSS)
- Update QR code colors by tone

- [ ] **Replace the contents of `views/partials/hero.hbs`:**

```html
<section id='about' class='pt-24 pb-20'>
  <div class='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
    <div class='flex flex-col md:flex-row items-start md:items-center gap-10 animate-fade-in'>

      {{! QR Code }}
      <div class='flex-shrink-0 flex flex-col items-center gap-2'>
        <a href='/resume.pdf?lang={{lang}}' title='{{t.hero_cta_download}}'>
          <div id='hero-qrcode-wrap' class='p-3 rounded-2xl shadow-lg ring-4 transition-all'
               style='background:#fff; ring-color: #f5f0e8;'>
            <div id='hero-qrcode'></div>
          </div>
        </a>
        <p class='text-xs font-medium tracking-wide' style='color:#a8a29e;'>{{t.contact_qr_label}}</p>
      </div>

      <div class='flex-1 min-w-0 relative'>
        {{! Glow blobs — visible only in Tone B via CSS }}
        <div class='hero-glow-1'></div>
        <div class='hero-glow-2'></div>

        {{! Open-to-work badge }}
        <span class='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                     bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 mb-5'>
          <span class='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse'></span>
          {{t.hero_open_to_work}}
        </span>

        <h1 class='hero-heading text-4xl sm:text-5xl font-extrabold mb-3 leading-tight'
            style='color: inherit;'>
          {{t.hero_greeting}}
          <span class='hero-name'> {{t.hero_name}}</span>
        </h1>

        <p class='text-xl font-medium mb-4 font-mono' style='color:#a8a29e;'>
          // {{resume.title}}
        </p>

        <p class='max-w-2xl mb-7 leading-relaxed' style='color:#57534e;'>
          {{resume.summary}}
        </p>

        <div class='flex flex-wrap gap-3 mb-7'>
          <a href='#contact' class='btn-primary'>
            <svg class='w-4 h-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'
                 fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
              <rect width='20' height='16' x='2' y='4' rx='2' />
              <path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' />
            </svg>
            {{t.hero_cta_contact}}
          </a>
          <a href='/resume.pdf?lang={{lang}}' class='btn-secondary'>
            <svg class='w-4 h-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'
                 fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
              <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
              <polyline points='7 10 12 15 17 10' />
              <line x1='12' x2='12' y1='15' y2='3' />
            </svg>
            {{t.hero_cta_download}}
          </a>
        </div>

        {{! Quick contact chips }}
        <div class='flex flex-wrap gap-5 text-sm' style='color:#78716c;'>
          <span class='flex items-center gap-1.5'>
            <svg class='w-4 h-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'
                 fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
              <path d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z' />
              <circle cx='12' cy='10' r='3' />
            </svg>
            {{resume.location}}
          </span>
          <a href='mailto:{{resume.email}}'
             class='flex items-center gap-1.5 nav-link'>
            <svg class='w-4 h-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'
                 fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
              <rect width='20' height='16' x='2' y='4' rx='2' />
              <path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' />
            </svg>
            {{resume.email}}
          </a>
          <a href='https://{{resume.github}}' target='_blank' rel='noopener noreferrer'
             class='flex items-center gap-1.5 nav-link'>
            <svg class='w-4 h-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'
                 fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
              <path d='M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4' />
              <path d='M9 18c-4.51 2-5-2-7-2' />
            </svg>
            {{resume.github}}
          </a>
        </div>
      </div>

    </div>
  </div>
</section>

<script>
  (function () {
    var tone = document.documentElement.dataset.tone || 'c';
    var isDark = tone === 'b';
    var wrap = document.getElementById('hero-qrcode-wrap');
    if (wrap) {
      wrap.style.background = isDark ? '#08080f' : '#ffffff';
      wrap.style.outline = isDark ? '4px solid rgba(99,102,241,0.3)' : '4px solid #f5f0e8';
    }
    new QRCode(document.getElementById('hero-qrcode'), {
      text: '{{resume.resumeUrl}}',
      width: 112,
      height: 112,
      colorDark:  isDark ? '#6366f1' : '#b45309',
      colorLight: isDark ? '#08080f' : '#ffffff',
      correctLevel: QRCode.CorrectLevel.M,
    });
  })();
</script>
```

- [ ] **Build and start dev server to verify hero renders correctly in both tones:**

```bash
pnpm run tailwind:build && pnpm run dev
```

Open `http://localhost:3000` — check hero layout.
To test Tone B: open DevTools → Application → localStorage → set `resume-tone` to `b` → refresh.
To test Tone C: set `resume-tone` to `c` → refresh.

- [ ] **Commit:**

```bash
git add views/partials/hero.hbs public/styles/output.css
git commit -m "feat: hero redesign — gradient name (Tone B), serif heading + amber name (Tone C), glow blobs"
```

---

## Task 6: Experience Section — data-animate + Timeline Classes

**Files:**
- Modify: `views/partials/experience.hbs`

The timeline visual for Tone C is handled entirely by CSS in Task 3. Here we only need to:
1. Add `data-animate` to the section
2. Add semantic classes (`exp-company`, `exp-bullet`, `exp-bullet-icon`) that the CSS targets

- [ ] **Replace `views/partials/experience.hbs`:**

```html
<section id="experience" class="py-20 bg-slate-100/60 dark:bg-slate-900/60" data-animate>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

    <h2 class="section-title">
      <span class="accent-bar"></span>
      {{t.exp_section_title}}
    </h2>

    <div class="space-y-5">
      {{#each resume.experience}}
      <div class="card">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
          <div>
            <h3 class="text-lg font-bold" style="color:inherit;">{{this.title}}</h3>
            <p class="exp-company font-semibold mt-0.5 text-accent-600 dark:text-accent-400">{{this.company}}</p>
            <p class="text-sm flex items-center gap-1.5 mt-1" style="color:#a8a29e;">
              <svg class="w-3.5 h-3.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {{this.location}}
            </p>
          </div>
          <span class="inline-flex items-center text-xs font-semibold font-mono
                       bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full whitespace-nowrap"
                style="color:#a8a29e;">
            {{this.period}}
          </span>
        </div>

        <ul class="space-y-2.5 mb-5">
          {{#each this.bullets}}
          <li class="exp-bullet flex gap-2.5 text-sm leading-relaxed" style="color:#57534e;">
            <svg class="exp-bullet-icon w-4 h-4 text-accent-500 mt-0.5 flex-shrink-0"
                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {{this}}
          </li>
          {{/each}}
        </ul>

        <div class="flex flex-wrap gap-1.5">
          {{#each this.tech}}
          <span class="badge">{{this}}</span>
          {{/each}}
        </div>
      </div>
      {{/each}}
    </div>

  </div>
</section>
```

- [ ] **Commit:**

```bash
git add views/partials/experience.hbs
git commit -m "feat: experience section — add data-animate, semantic classes for timeline CSS"
```

---

## Task 7: Skills Section — data-animate

**Files:**
- Modify: `views/partials/skills.hbs`

- [ ] **Replace `views/partials/skills.hbs`:**

```html
<section id="skills" class="py-20" data-animate>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

    <h2 class="section-title">
      <span class="accent-bar"></span>
      {{t.skills_section_title}}
    </h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {{#each resume.skillGroups}}
      <div class="card">
        <h3 class="text-xs font-bold uppercase tracking-widest mb-3" style="color:#a8a29e;">
          {{this.category}}
        </h3>
        <div class="flex flex-wrap gap-1.5">
          {{#each this.skills}}
          <span class="badge">{{this}}</span>
          {{/each}}
        </div>
      </div>
      {{/each}}
    </div>

  </div>
</section>
```

- [ ] **Commit:**

```bash
git add views/partials/skills.hbs
git commit -m "feat: skills section — add data-animate"
```

---

## Task 8: Projects Section — data-animate

**Files:**
- Modify: `views/partials/projects.hbs`

- [ ] **Replace `views/partials/projects.hbs`:**

```html
{{#if resume.projects}}
<section id="projects" class="py-20" data-animate>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

    <h2 class="section-title">
      <span class="accent-bar"></span>
      {{t.proj_section_title}}
    </h2>

    {{#if resume.projectAchievements}}
    <div class="mb-8">
      <h3 class="text-sm font-semibold uppercase tracking-widest mb-3" style="color:#a8a29e;">
        {{t.proj_achievements_title}}
      </h3>
      <div class="flex flex-wrap gap-2">
        {{#each resume.projectAchievements}}
        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                     bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300
                     border border-amber-200 dark:border-amber-700/50">
          <svg class="w-3.5 h-3.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          {{this}}
        </span>
        {{/each}}
      </div>
    </div>
    {{/if}}

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {{#each resume.projects}}
      <div class="card flex flex-col">
        <div class="flex items-start justify-between mb-4">
          <div class="p-2.5 rounded-xl bg-accent-100 dark:bg-accent-900/40">
            <svg class="w-5 h-5 text-accent-600 dark:text-accent-400" xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6"/>
              <polyline points="8 6 2 12 8 18"/>
            </svg>
          </div>
          {{#if this.link}}
          <a href="https://{{this.link}}" target="_blank" rel="noopener noreferrer"
             class="icon-btn" aria-label="{{../t.proj_view_source}}">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
              <path d="M9 18c-4.51 2-5-2-7-2"/>
            </svg>
          </a>
          {{/if}}
        </div>
        <h3 class="text-base font-bold mb-2" style="color:inherit;">{{this.name}}</h3>
        <p class="text-sm leading-relaxed flex-1 mb-4" style="color:#57534e;">{{this.description}}</p>
        <div class="flex flex-wrap gap-1.5">
          {{#each this.tech}}
          <span class="badge">{{this}}</span>
          {{/each}}
        </div>
      </div>
      {{/each}}
    </div>

  </div>
</section>
{{/if}}
```

- [ ] **Commit:**

```bash
git add views/partials/projects.hbs
git commit -m "feat: projects section — add data-animate"
```

---

## Task 9: Education + Contact Sections — data-animate

**Files:**
- Modify: `views/partials/education.hbs`
- Modify: `views/partials/contact.hbs`

- [ ] **Replace `views/partials/education.hbs`:**

```html
<section id="education" class="py-20 bg-slate-100/60 dark:bg-slate-900/60" data-animate>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

    <h2 class="section-title">
      <span class="accent-bar"></span>
      {{t.edu_section_title}}
    </h2>

    <div class="space-y-4">
      {{#each resume.education}}
      <div class="card">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h3 class="text-lg font-bold" style="color:inherit;">{{this.degree}}</h3>
            <p class="exp-company font-semibold mt-0.5 text-accent-600 dark:text-accent-400">{{this.institution}}</p>
            <p class="text-sm flex items-center gap-1.5 mt-1" style="color:#a8a29e;">
              <svg class="w-3.5 h-3.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {{this.location}}
            </p>
            {{#if this.gpa}}
            <p class="text-sm flex items-center gap-1.5 mt-1" style="color:#57534e;">
              <svg class="w-3.5 h-3.5 flex-shrink-0" style="color:#b45309;"
                   xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              GPA: <span class="font-semibold">{{this.gpa}}</span>
            </p>
            {{/if}}
          </div>
          <span class="inline-flex items-center text-xs font-semibold font-mono
                       bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full whitespace-nowrap"
                style="color:#a8a29e;">
            {{this.period}}
          </span>
        </div>
      </div>
      {{/each}}
    </div>

  </div>
</section>
```

- [ ] **Replace `views/partials/contact.hbs`:**

```html
<section id='contact' class='py-20 bg-slate-100/60 dark:bg-slate-900/60' data-animate>
  <div class='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>

    <h2 class='section-title'>
      <span class='accent-bar'></span>
      {{t.contact_section_title}}
    </h2>

    <div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>

      {{! Email }}
      <a href='mailto:{{resume.email}}'
         class='card flex items-center gap-4 group transition-colors'>
        <div class='p-3 rounded-xl bg-accent-100 dark:bg-accent-900/40 flex-shrink-0'>
          <svg class='w-5 h-5 text-accent-600 dark:text-accent-400' xmlns='http://www.w3.org/2000/svg'
               viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'
               stroke-linecap='round' stroke-linejoin='round'>
            <rect width='20' height='16' x='2' y='4' rx='2' />
            <path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' />
          </svg>
        </div>
        <div class='min-w-0'>
          <p class='text-xs mb-0.5' style='color:#a8a29e;'>{{t.contact_email_label}}</p>
          <p class='text-sm font-semibold truncate' style='color:inherit;'>{{resume.email}}</p>
        </div>
      </a>

      {{! Phone }}
      <a href='tel:{{resume.phone}}'
         class='card flex items-center gap-4 group transition-colors'>
        <div class='p-3 rounded-xl bg-accent-100 dark:bg-accent-900/40 flex-shrink-0'>
          <svg class='w-5 h-5 text-accent-600 dark:text-accent-400' xmlns='http://www.w3.org/2000/svg'
               viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'
               stroke-linecap='round' stroke-linejoin='round'>
            <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.44 2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.9-.9a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 17v-.08Z'/>
          </svg>
        </div>
        <div class='min-w-0'>
          <p class='text-xs mb-0.5' style='color:#a8a29e;'>{{t.contact_phone_label}}</p>
          <p class='text-sm font-semibold' style='color:inherit;'>{{resume.phone}}</p>
        </div>
      </a>

      {{! Location }}
      <div class='card flex items-center gap-4'>
        <div class='p-3 rounded-xl bg-accent-100 dark:bg-accent-900/40 flex-shrink-0'>
          <svg class='w-5 h-5 text-accent-600 dark:text-accent-400' xmlns='http://www.w3.org/2000/svg'
               viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'
               stroke-linecap='round' stroke-linejoin='round'>
            <path d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z' />
            <circle cx='12' cy='10' r='3' />
          </svg>
        </div>
        <div class='min-w-0'>
          <p class='text-xs mb-0.5' style='color:#a8a29e;'>{{t.contact_location_label}}</p>
          <p class='text-sm font-semibold' style='color:inherit;'>{{resume.location}}</p>
        </div>
      </div>

      {{! GitHub }}
      <a href='https://{{resume.github}}' target='_blank' rel='noopener noreferrer'
         class='card flex items-center gap-4 group transition-colors'>
        <div class='p-3 rounded-xl bg-accent-100 dark:bg-accent-900/40 flex-shrink-0'>
          <svg class='w-5 h-5 text-accent-600 dark:text-accent-400' xmlns='http://www.w3.org/2000/svg'
               viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'
               stroke-linecap='round' stroke-linejoin='round'>
            <path d='M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4'/>
            <path d='M9 18c-4.51 2-5-2-7-2' />
          </svg>
        </div>
        <div class='min-w-0'>
          <p class='text-xs mb-0.5' style='color:#a8a29e;'>{{t.contact_github_label}}</p>
          <p class='text-sm font-semibold truncate' style='color:inherit;'>{{resume.github}}</p>
        </div>
      </a>

      {{! LinkedIn }}
      <a href='https://{{resume.linkedin}}' target='_blank' rel='noopener noreferrer'
         class='card flex items-center gap-4 group transition-colors'>
        <div class='p-3 rounded-xl bg-accent-100 dark:bg-accent-900/40 flex-shrink-0'>
          <svg class='w-5 h-5 text-accent-600 dark:text-accent-400' xmlns='http://www.w3.org/2000/svg'
               viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'
               stroke-linecap='round' stroke-linejoin='round'>
            <path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z'/>
            <rect width='4' height='12' x='2' y='9' />
            <circle cx='4' cy='4' r='2' />
          </svg>
        </div>
        <div class='min-w-0'>
          <p class='text-xs mb-0.5' style='color:#a8a29e;'>{{t.contact_linkedin_label}}</p>
          <p class='text-sm font-semibold truncate' style='color:inherit;'>{{resume.linkedin}}</p>
        </div>
      </a>

    </div>
  </div>
</section>
```

- [ ] **Commit:**

```bash
git add views/partials/education.hbs views/partials/contact.hbs
git commit -m "feat: education + contact sections — add data-animate, tone-aware styles"
```

---

## Task 10: Scroll Animation — IntersectionObserver

**Files:**
- Modify: `views/partials/footer.hbs`

Add the observer script before the closing `</footer>` or at the end of the footer partial.

- [ ] **Read the current footer.hbs to see its structure:**

```bash
cat views/partials/footer.hbs
```

- [ ] **Append the following `<script>` block inside `views/partials/footer.hbs` (before `</footer>` closing tag, or at end of file if footer has no closing tag):**

```html
<script>
  (function () {
    var els = document.querySelectorAll('[data-animate]');
    if (!els.length || typeof IntersectionObserver === 'undefined') {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(function (el) { io.observe(el); });
  })();
</script>
```

- [ ] **Commit:**

```bash
git add views/partials/footer.hbs
git commit -m "feat: add scroll-triggered fade-in via IntersectionObserver"
```

---

## Task 11: Final Build + Visual Verification

- [ ] **Build Tailwind:**

```bash
pnpm run tailwind:build
```

Expected: `public/styles/output.css` updated, no errors.

- [ ] **Start dev server:**

```bash
pnpm run dev
```

- [ ] **Verify Tone C (editorial light):**

Open `http://localhost:3000` in browser.
DevTools → Application → Local Storage → set `resume-tone` = `c` → refresh.

Check:
- Background is warm off-white `#faf8f5`
- Hero h1 uses Playfair Display serif font
- Hero name span is amber `#b45309`
- No glow blobs
- CTA primary button is charcoal `#1c1917`
- Section titles are uppercase + full-width rule, no accent bar
- Experience section shows timeline (left border + amber dot)
- Badges are warm stone colored
- Sections fade in on scroll

- [ ] **Verify Tone B (bold dark):**

Set `resume-tone` = `b` → refresh.

Check:
- Background is very dark `#08080f`
- Hero name has gradient text (indigo → violet)
- Glow blobs visible in hero
- CTA primary button has gradient + glow
- Section titles are indigo uppercase
- Experience shows glassmorphism cards
- Badges are indigo-tinted

- [ ] **Verify PDF (Tone C forced):**

Visit `http://localhost:3000/resume.pdf?lang=en` — PDF should render in Tone C (warm editorial) regardless of your localStorage value.

- [ ] **Verify first-visit random assignment:**

Open browser incognito → `http://localhost:3000` → check which tone appears → refresh multiple times (should stay same tone). Open second incognito window and repeat — may get different tone.

- [ ] **Commit final build artifact:**

```bash
git add public/styles/output.css
git commit -m "build: regenerate Tailwind CSS for dual-tone redesign"
```
