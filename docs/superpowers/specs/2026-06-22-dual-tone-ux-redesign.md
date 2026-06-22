# Dual-Tone UX Redesign

**Date:** 2026-06-22
**Status:** Approved

## Summary

Redesign the resume website with two distinct visual personalities (Tone B and Tone C) that are randomly assigned per device on first visit and persist via localStorage. The PDF export always uses Tone C. The existing dark/light mode toggle is removed — tones replace it.

---

## Design Decisions

| Decision | Choice |
|---|---|
| Web tone system | Dual: B (Bold/Modern) + C (Editorial/Timeless) |
| Tone assignment | Random on first visit, sticky per device via localStorage |
| PDF tone | Always Tone C (forced via `?tone=c` URL param) |
| Dark/light toggle | **Removed** — tones replace it |
| Implementation approach | CSS Custom Properties on top of existing Tailwind dark: classes |
| Scroll animations | Yes — Intersection Observer, fade+slide-up per section |

---

## Tone System Architecture

### Assignment Script (replaces existing dark-mode script in `main.hbs`)

```js
(function () {
  try {
    var params = new URLSearchParams(location.search);
    var forced = params.get('tone');
    if (!localStorage.getItem('resume-tone')) {
      localStorage.setItem('resume-tone', Math.random() < 0.5 ? 'b' : 'c');
    }
    var tone = forced || localStorage.getItem('resume-tone');
    if (tone === 'b') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (_) {}
})();
```

**Key behaviour:**
- `?tone=c` in URL (used by Puppeteer) overrides localStorage but does NOT write to it
- Tone B = `class="dark"` on `<html>` (reuses existing Tailwind `dark:` prefix)
- Tone C = no dark class (the new light theme)
- First visit: 50/50 random, then sticky

---

## Tone B — Bold & Modern (dark)

Activated when `<html class="dark">` is set.

### Colors (CSS variables in `[data-tone-b]` or via `dark:` Tailwind classes)

| Token | Value |
|---|---|
| Background | `#08080f` |
| Card background | `rgba(255,255,255,0.03)` |
| Card border | `rgba(255,255,255,0.07)` |
| Text primary | `#e2e8f0` |
| Text secondary | `#94a3b8` |
| Accent | `#6366f1` (indigo) |
| Accent gradient | `linear-gradient(135deg, #6366f1, #8b5cf6)` |
| Accent text | `#818cf8` |
| Badge bg | `rgba(99,102,241,0.15)` |
| Badge border | `rgba(99,102,241,0.2)` |

### Typography
- All fonts: Inter + JetBrains Mono (unchanged)
- `h1`: `font-weight: 800`, gradient text (indigo → violet)
- Section titles: `uppercase`, `letter-spacing: 2.5px`, indigo color

### Components
- **Nav:** `background: rgba(8,8,15,0.8)`, `backdrop-filter: blur(12px)`, bottom border `rgba(255,255,255,0.06)`
- **Hero:** two radial glow blobs (indigo + violet), positioned absolute
- **CTA primary button:** gradient bg + `box-shadow: 0 0 16px rgba(99,102,241,0.35)`
- **Cards:** glassmorphism-lite — `rgba(255,255,255,0.03)` bg + `rgba(255,255,255,0.07)` border + `backdrop-filter: blur(4px)`
- **Experience bullets:** `›` chevron prefix in indigo
- **Badges:** indigo-tinted pill with border

---

## Tone C — Editorial & Timeless (light / PDF)

Activated when `<html>` has no `dark` class.

### Colors

| Token | Value |
|---|---|
| Background | `#faf8f5` (warm off-white) |
| Card background | `#ffffff` |
| Card border | `#e7e5e0` |
| Text primary | `#1c1917` |
| Text secondary | `#57534e` |
| Text muted | `#a8a29e` |
| Accent | `#b45309` (amber) |
| Badge bg | `#f5f0e8` |
| Badge border | `#e7e0d6` |

### Typography
- **Display headings (h1, h2):** Playfair Display — `font-weight: 800`, `letter-spacing: -1px`
- **Body:** Inter (unchanged)
- **Mono:** JetBrains Mono (unchanged)
- Add to Google Fonts import: `family=Playfair+Display:wght@400;700;800`

### Components
- **Nav:** `background: #faf8f5`, bottom border `#e7e5e0`, logo as `NK` monogram uppercase spaced
- **Hero h1:** Playfair Display, name span in amber `#b45309`
- **CTA primary button:** background `#1c1917` (charcoal), white text, `border-radius: 6px`
- **Cards:** white bg, `border: 1px solid #e7e5e0`, no shadow
- **Experience:** timeline layout — CSS-only, same HTML structure. `:root:not(.dark) #experience .card` adds `border-left: 2px solid #e7e5e0` + amber dot via `::before` pseudo-element. No template change needed.
- **Section titles:** uppercase + `::after` full-width `1px` rule (`#e7e5e0`)
- **Badges:** warm stone pill — bg `#f5f0e8`, text `#78716c`, border `#e7e0d6`
- **Experience bullet prefix:** `—` em dash in muted stone

---

## Scroll Animations

### CSS (`input.css`)

```css
[data-animate] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
[data-animate].is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger child cards */
[data-animate] .card:nth-child(1) { transition-delay: 0.05s; }
[data-animate] .card:nth-child(2) { transition-delay: 0.1s; }
[data-animate] .card:nth-child(3) { transition-delay: 0.15s; }
[data-animate] .card:nth-child(4) { transition-delay: 0.2s; }

@media (prefers-reduced-motion: reduce) {
  [data-animate], [data-animate].is-visible {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

### JS (inline in `main.hbs` or `footer.hbs`)

```js
(function () {
  var els = document.querySelectorAll('[data-animate]');
  if (!els.length) return;
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
```

**Sections with `data-animate`:** `#experience`, `#skills`, `#projects`, `#education`, `#contact`

Hero (`#about`) keeps existing `animate-fade-in` class — no change.

---

## Breaking Changes

### Removed
- `#theme-toggle` button from `header.hbs`
- Dark mode preference script from `main.hbs`
- `dark:` prefix classes **stay in templates** — they continue to activate Tone B. Only their resolved values change (via `input.css` overrides to match the deeper Tone B palette)

### Modified
- `main.hbs`: replace dark script → tone script; add Playfair Display to Google Fonts import
- `header.hbs`: remove theme toggle button; update nav/logo styles for both tones
- All partials: update `dark:*` class values to match new Tone B palette (darker, more dramatic than current)
- `src/pdf/pdf.service.ts`: append `&tone=c` to the navigation URL

### Font Import Addition
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@400;700;800&display=swap" rel="stylesheet" />
```

---

## Files to Change

| File | Change |
|---|---|
| `src/styles/input.css` | Add tone CSS variables, scroll animation classes, remove/update dark: overrides |
| `views/layouts/main.hbs` | Replace dark script → tone script; add Playfair Display font |
| `views/partials/header.hbs` | Remove theme-toggle; update nav styles for both tones |
| `views/partials/hero.hbs` | Glow blobs (Tone B), serif h1 (Tone C), update dark: classes |
| `views/partials/experience.hbs` | Add `data-animate`; timeline layout for Tone C; update dark: classes |
| `views/partials/skills.hbs` | Add `data-animate`; update badge styles for both tones |
| `views/partials/projects.hbs` | Add `data-animate`; update card styles for both tones |
| `views/partials/education.hbs` | Add `data-animate`; update card styles |
| `views/partials/contact.hbs` | Add `data-animate`; update card styles |
| `src/pdf/pdf.service.ts` | Append `&tone=c` to Puppeteer navigation URL |
| `tailwind.config.js` | Add `Playfair Display` to fontFamily, keep darkMode: 'class' |

---

## Out of Scope

- Mobile hamburger menu (separate task)
- Content changes (metrics, LSEG bullets) — separate concern
- Tone switcher UI (device gets one tone, no manual override for end users)
