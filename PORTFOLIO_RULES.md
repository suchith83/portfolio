# Portfolio update rules

Reference for future sessions working on this portfolio (`suchith.space`).

---

## Site structure

| File | Purpose |
|---|---|
| `index.html` | Home page — hero, about, 3 featured projects, background |
| `projects.html` | Full projects page — 3 categorised sections |
| `styles.css` | All styles — CSS variables, layout, components |
| `js/script.js` | Theme toggle + mobile nav only. No animation logic. |
| `assets/images/` | Profile photo + project thumbnails (1200×720 px) |
| `assets/images/IMAGE_PROMPTS.md` | ChatGPT/Gemini prompts for each thumbnail |
| `fonts/` | Geist Sans + Geist Mono (self-hosted woff2) |
| `resume.pdf` | CV — replace file to update |
| `CNAME` | `suchith.space` — do not edit |

---

## Design principles

- **Light by default**, dark mode via toggle (localStorage key `theme`)
- **No gradients, no glow, no animated reveals** — page appears instantly
- **One accent color**: terracotta `#B5483A` (light) / `#D46A5C` (dark). Used only on links, CTAs, PR pills, "Now" label. Nowhere else.
- **Hero font**: Instrument Serif (Google Fonts), weight 400. Body/UI: Geist Sans. Code/tags: Geist Mono.
- **Grid background** on hero only — faint 40px lines, masked with radial gradient, opacity 0.6
- **Cards lift** `translateY(-4px)` on hover via `.project-card--hover`. No shadow burst, no color change.
- **Whole card is clickable** — clicking anywhere on a `.project-card--hover` opens the title link in a new tab (via JS in `script.js`). Inner links like PR pills still work independently — clicks on them don't bubble up to the card handler. The diagonal arrow (↗) on the title slides in whenever the card is hovered.

---

## Project categories (projects.html)

Three sections with `<h3 class="section-group-label">` headings:

### Personal Projects
Projects you built yourself.
- Deep Research Agent → HuggingFace Space link
- Customer Churn Prediction → GitHub

### At 10xscale.ai
Work done at your job. Mark as `project-card--private` (no link on title, "Private" badge).
- MCP PostgreSQL Server
- AI-Powered Raspberry Pi Robot

### Open Source
Contributions to others' projects. Use normal card with title link.
- Agentflow → GitHub repo link, PR pills for each merged PR

---

## Homepage (index.html)

Shows 3 featured project cards in `projects-grid--three`: Deep Research Agent, Agentflow, Customer Churn Prediction.
"View all projects →" CTA links to `projects.html`.

---

## How to add a new project

1. Decide which category it belongs to (Personal / At 10xscale.ai / Open Source)
2. Add the card HTML to `projects.html` in the right section
3. If it's a personal project, also add it to `index.html` (replacing the oldest if already 3 shown)
4. Generate a thumbnail using the style guide in `assets/images/IMAGE_PROMPTS.md` — save as `assets/images/<name>.png` at 1200×720 px
5. Reference it in the card's `<img src="assets/images/<name>.png">`

### Card HTML template (personal / open source)

The whole card is clickable (JS in `script.js` reads `.project-title-link` and opens it).
Inner `<a>` tags (PR pills etc.) work independently — they intercept their own clicks before the card handler fires.
Private cards use `project-card--private` instead of `--hover` and have no title link.

```html
<div class="project-card project-card--hover">
  <div class="project-thumb">
    <img src="assets/images/FILENAME.png" alt="PROJECT NAME" loading="lazy" onerror="this.style.display='none'">
    <span class="project-thumb-fallback" aria-hidden="true">X</span>
  </div>
  <div class="project-body">
    <h3 class="project-title">
      <a href="LINK" target="_blank" rel="noopener" class="project-title-link">
        PROJECT NAME
        <svg class="project-title-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
      </a>
    </h3>
    <p class="project-desc">One or two sentences describing what it does.</p>
    <ul class="project-tech" role="list">
      <li>Tech 1</li>
      <li>Tech 2</li>
    </ul>
  </div>
</div>
```

### Card template (private / no link)

```html
<div class="project-card project-card--hover project-card--private">
  <div class="project-thumb">
    <img src="assets/images/FILENAME.png" alt="PROJECT NAME" loading="lazy" onerror="this.style.display='none'">
    <span class="project-thumb-fallback" aria-hidden="true">X</span>
  </div>
  <div class="project-body">
    <div class="project-title-row">
      <h3 class="project-title">PROJECT NAME</h3>
      <span class="project-badge">Private</span>
    </div>
    <p class="project-desc">One or two sentences.</p>
    <ul class="project-tech" role="list">
      <li>Tech 1</li>
    </ul>
  </div>
</div>
```

### Card template (open source contribution with PR pills)

```html
<div class="project-card project-card--hover">
  <div class="project-thumb">
    <img src="assets/images/FILENAME.png" alt="REPO NAME" loading="lazy" onerror="this.style.display='none'">
    <span class="project-thumb-fallback" aria-hidden="true">X</span>
  </div>
  <div class="project-body">
    <h3 class="project-title">
      <a href="REPO_URL" target="_blank" rel="noopener" class="project-title-link">
        REPO NAME
        <svg class="project-title-arrow" .../>
      </a>
    </h3>
    <p class="project-desc">What you contributed and why.</p>
    <div class="pr-pills">
      <a href="PR_URL" target="_blank" rel="noopener" class="pr-pill">↗ PR #N</a>
    </div>
    <ul class="project-tech" role="list">
      <li>Tech 1</li>
    </ul>
  </div>
</div>
```

---

## How to update content

**Hero text** — edit `index.html` lines with `.hero-subtitle` and `.hero-description`

**About prose** — edit the `<div class="prose">` block in the `#story` section of `index.html`

**Now block** — edit the `<ul class="now-list">` in `index.html` — keep to 3 bullets max

**Background / skills** — edit `.colophon` in `index.html`

**Resume** — replace `resume.pdf` (same filename)

---

## Thumbnail style guide (quick reference)

- Size: 1200×720 px (5:3 ratio)
- Background: white `#ffffff` or very light gray `#f6f6f6`
- Accent: terracotta `#B5483A` on one focal element only
- Style: flat editorial illustration — no gradients, no glow, no faces, no 3D
- Full prompts with per-project details: `assets/images/IMAGE_PROMPTS.md`

---

## Deployment

- GitHub Pages with custom domain `suchith.space` (via `CNAME`)
- No build step — plain HTML/CSS/JS, push to `main` to deploy
- Analytics: Google Analytics `G-BFC42ZF5NR` already wired in `<head>`
