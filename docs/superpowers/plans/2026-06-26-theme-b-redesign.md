# Theme B Dark Charcoal Emerald — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Theme B's near-black indigo palette with Dark Charcoal Emerald — lighter background `#141414` + emerald `#34d399` accent — without touching Theme C.

**Architecture:** Single-file CSS change in `src/styles/input.css`. All modifications are scoped to `.dark` or `html.dark` selectors. After editing CSS, run `pnpm run tailwind:build` to regenerate `public/styles/output.css`. Visual verification is done via `?tone=b` and `?tone=c` query params.

**Tech Stack:** Tailwind CSS (input.css → output.css), NestJS/Express server, Handlebars templates. Node 22 required (`nvm use 22`).

---

## Task 1: Color Foundation — tokens, body background, accent bar

**Files:**
- Modify: `src/styles/input.css`

- [ ] **Step 1: Update `--c-accent-icon` token in `.dark`**

In `src/styles/input.css`, find:
```css
.dark {
  --c-body:        #94a3b8;
  --c-muted:       #718096;
  --c-secondary:   #94a3b8;
  --c-accent-icon: #6366f1;
}
```
Change to:
```css
.dark {
  --c-body:        #94a3b8;
  --c-muted:       #718096;
  --c-secondary:   #94a3b8;
  --c-accent-icon: #34d399;
}
```

- [ ] **Step 2: Update `.dark body` background**

Find:
```css
  /* Tone B (dark class present) */
  .dark body {
    background-color: #08080f;
    color: #e2e8f0;
  }
```
Change to:
```css
  /* Tone B (dark class present) */
  .dark body {
    background-color: #141414;
    color: #e4e4e7;
  }
```

- [ ] **Step 3: Update `.dark .accent-bar`**

Find:
```css
  .dark .accent-bar {
    background-color: #6366f1; /* Tone B: indigo */
  }
```
Change to:
```css
  .dark .accent-bar {
    background-color: #34d399; /* Tone B: emerald */
  }
```

- [ ] **Step 4: Update section alternate background**

Find:
```css
html.dark #experience,
html.dark #education,
html.dark #contact {
  background-color: rgba(8, 8, 15, 0.4);
}
```
Change to:
```css
html.dark #experience,
html.dark #education,
html.dark #contact {
  background-color: rgba(20, 20, 20, 0.5);
}
```

- [ ] **Step 5: Build Tailwind and verify no errors**

```bash
nvm use 22 && pnpm run tailwind:build
```
Expected: exits 0, updates `public/styles/output.css`

- [ ] **Step 6: Commit**

```bash
git add src/styles/input.css public/styles/output.css
git commit -m "style(theme-b): update color foundation to dark charcoal emerald"
```

---

## Task 2: Hero Section — name gradient + glow blobs

**Files:**
- Modify: `src/styles/input.css`

- [ ] **Step 1: Update `.dark .hero-name` gradient**

Find:
```css
/* Hero gradient name */
.dark .hero-name {
  background: linear-gradient(135deg, #e2e8f0 30%, #a5b4fc 70%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```
Change to:
```css
/* Hero gradient name */
.dark .hero-name {
  background: linear-gradient(135deg, #f4f4f5 25%, #6ee7b7 60%, #34d399 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

- [ ] **Step 2: Add `.dark` overrides for hero glow blobs**

Find the glow blob rules:
```css
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
```

Change the glow blob background colors directly (they only render under `.dark` anyway):
```css
/* Hero glow blobs */
.hero-glow-1 {
  display: none;
  position: absolute;
  top: -60px; right: -40px;
  width: 220px; height: 220px;
  background: radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%);
  pointer-events: none;
  border-radius: 50%;
}
.hero-glow-2 {
  display: none;
  position: absolute;
  bottom: -40px; left: 10px;
  width: 160px; height: 160px;
  background: radial-gradient(circle, rgba(52,211,153,0.10) 0%, transparent 70%);
  pointer-events: none;
  border-radius: 50%;
}
.dark .hero-glow-1,
.dark .hero-glow-2 {
  display: block;
}
```

- [ ] **Step 3: Build Tailwind**

```bash
pnpm run tailwind:build
```
Expected: exits 0

- [ ] **Step 4: Commit**

```bash
git add src/styles/input.css public/styles/output.css
git commit -m "style(theme-b): update hero name gradient and glow blobs to emerald"
```

---

## Task 3: Interactive Elements — buttons, nav hover, scroll cue

**Files:**
- Modify: `src/styles/input.css`

- [ ] **Step 1: Update `.dark .btn-primary`**

Find:
```css
  .dark .btn-primary {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: #ffffff;
    box-shadow: 0 0 16px rgba(99,102,241,0.35);
  }
  .dark .btn-primary:hover {
    box-shadow: 0 0 24px rgba(99,102,241,0.5);
  }
```
Change to:
```css
  .dark .btn-primary {
    background: linear-gradient(135deg, #059669, #34d399);
    color: #ffffff;
    box-shadow: 0 0 16px rgba(52,211,153,0.25);
  }
  .dark .btn-primary:hover {
    box-shadow: 0 0 24px rgba(52,211,153,0.4);
  }
```

- [ ] **Step 2: Update `.dark .btn-secondary`**

Find:
```css
  .dark .btn-secondary {
    border-color: rgba(99,102,241,0.4);
    color: #a5b4fc;
  }
  .dark .btn-secondary:hover {
    background-color: rgba(99,102,241,0.08);
  }
```
Change to:
```css
  .dark .btn-secondary {
    border-color: rgba(52,211,153,0.35);
    color: #6ee7b7;
  }
  .dark .btn-secondary:hover {
    background-color: rgba(52,211,153,0.08);
  }
```

- [ ] **Step 3: Update `.dark .nav-link:hover`**

Find:
```css
  .dark .nav-link:hover {
    color: #818cf8;
  }
```
Change to:
```css
  .dark .nav-link:hover {
    color: #34d399;
  }
```

- [ ] **Step 4: Update `.dark .scroll-cue svg`**

Find:
```css
.dark .scroll-cue svg {
  color: #6366f1;
}
```
Change to:
```css
.dark .scroll-cue svg {
  color: #34d399;
}
```

- [ ] **Step 5: Build Tailwind**

```bash
pnpm run tailwind:build
```
Expected: exits 0

- [ ] **Step 6: Commit**

```bash
git add src/styles/input.css public/styles/output.css
git commit -m "style(theme-b): update buttons, nav hover, scroll cue to emerald"
```

---

## Task 4: Content Elements — cards, badges, exp bullet

**Files:**
- Modify: `src/styles/input.css`

- [ ] **Step 1: Update `.dark .card`**

Find:
```css
  .dark .card {
    background-color: rgba(255,255,255,0.03);
    border-color: rgba(255,255,255,0.07);
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
  }
  .dark .card:hover {
    box-shadow: none;
    border-color: rgba(255,255,255,0.12);
  }
```
Change to:
```css
  .dark .card {
    background-color: rgba(255,255,255,0.05);
    border-color: rgba(52,211,153,0.10);
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
  }
  .dark .card:hover {
    box-shadow: none;
    border-color: rgba(52,211,153,0.20);
  }
```

- [ ] **Step 2: Update `.dark .badge`**

Find:
```css
  .dark .badge {
    background-color: rgba(99,102,241,0.15);
    color: #818cf8;
    border-color: rgba(99,102,241,0.2);
  }
```
Change to:
```css
  .dark .badge {
    background-color: rgba(52,211,153,0.08);
    color: #34d399;
    border-color: rgba(52,211,153,0.18);
  }
```

- [ ] **Step 3: Update `.dark .exp-bullet-icon`**

Find:
```css
/* Experience bullet prefix override for Tone B */
.dark .exp-bullet-icon {
  color: #818cf8;
}
```
Change to:
```css
/* Experience bullet prefix override for Tone B */
.dark .exp-bullet-icon {
  color: #34d399;
}
```

- [ ] **Step 4: Build Tailwind**

```bash
pnpm run tailwind:build
```
Expected: exits 0

- [ ] **Step 5: Commit**

```bash
git add src/styles/input.css public/styles/output.css
git commit -m "style(theme-b): update cards, badges, exp bullet to emerald"
```

---

## Task 5: Visual Verification

**Files:** none (read-only verification step)

- [ ] **Step 1: Start dev server**

```bash
nvm use 22 && pnpm run dev
```
Expected: server starts on port 3000 (or configured port)

- [ ] **Step 2: Verify Theme B in browser**

Open `http://localhost:3000/?tone=b`

Check each of the following:
- Background is dark charcoal (not near-black), clearly lighter than before
- Hero name has white→mint→emerald gradient
- Buttons: primary is green/emerald gradient; secondary has emerald border
- Cards: subtly visible with emerald border tint
- Badges: emerald text on dark emerald-tinted bg
- Section titles have emerald accent bar
- Scroll cue chevron is emerald
- Nav links turn emerald on hover
- Experience bullet icons are emerald

- [ ] **Step 3: Verify Theme C is untouched**

Open `http://localhost:3000/?tone=c`

Check that all of the following still look correct:
- Background is warm cream `#faf8f5`
- Hero name is amber `#b45309`
- Section titles are uppercase small-caps amber rule
- Experience cards are timeline style (left border, no card bg)
- Buttons are dark `#1c1917` primary
- Badges are warm beige

- [ ] **Step 4: Commit (if no issues found)**

```bash
git add -p  # confirm nothing unexpected
git commit -m "style(theme-b): visual verification complete — Dark Charcoal Emerald"
```

If issues found in Step 2 or 3, fix them in `src/styles/input.css`, rebuild with `pnpm run tailwind:build`, and re-verify before committing.
