# Portfolio update rules

Reference for future sessions working on this portfolio (`suchith.space`).

---

## Site structure

| File | Purpose |
|---|---|
| `index.html` | Home — hero, about, selected projects, experience, writing teaser, toolkit, contact |
| `projects.html` | Engineering case studies (work / OSS / personal) |
| `writing.html` | Writing index + article-ready typography shell |
| `styles.css` | Design tokens, layout, components, responsive + reduced-motion |
| `js/script.js` | Theme (localStorage `theme` + system preference), mobile nav ARIA, card click, reveal |
| `assets/images/` | Profile photo + optimized project thumbs (JPEG, ~1200×720) |
| `assets/images/IMAGE_PROMPTS.md` | Editorial illustration prompts |
| `fonts/` | Geist Sans + Geist Mono (self-hosted woff2) |
| `resume.pdf` | CV — replace file to update |
| `CNAME` | `suchith.space` — do not edit |

---

## Design principles

- **Warm paper light by default**, dark mode via toggle (localStorage key `theme`; falls back to `prefers-color-scheme`)
- **~80% clean / 20% personality** — numbered sections, sparse serif annotations, architecture SVGs, mono metadata
- **No gradients, no glow, no scroll-jacking, no animation libraries**
- **One accent color**: terracotta `#B5483A` (light) / `#D46A5C` (dark)
- **Hero font**: Instrument Serif (Google Fonts), weight 400. Body/UI: Geist Sans. Code/tags: Geist Mono.
- **Subtle reveals** via IntersectionObserver; fully disabled under `prefers-reduced-motion`
- **Whole featured card is clickable** when it has `.project-title-link` (not private cards)

---

## Navigation

`About` · `Projects` · `Experience` · `Writing` · `Resume`

Contact lives in the home contact panel + footer (email / GitHub / LinkedIn). Prefer **Writing** over Blog.

Canonical email: **suchithkoduru@gmail.com**

---

## Content rules

- Do **not** fabricate metrics, companies, projects, or users
- Prefer resume-backed claims only (latency numbers, language counts, merged PRs)
- AgentFlow: cite merged PRs **#17** and **#19** (do not invent #18 on the site)
- Status: 10xScale engagement completed; open to software / AI roles unless content is updated again

---

## Projects page model

Use `.case-study` rows, not only identical cards:

1. **At 10xScale.ai** (Private badge) — medical agent, voice kiosk, interview platform, MCP/database agent
2. **Open source** — AgentFlow
3. **Personal & coursework** — Deep Research, churn, CIFAR-100

Each case should expose where possible: problem · what I built · architecture/decision · impact · technologies.

Thumbnails: prefer optimized JPEG under ~100KB. Inline SVG diagrams are fine when they explain architecture better than art.

---

## Writing route

`writing.html` is ready for the interactive technical article:

- Index list with draft card
- `.article-shell` / `.article-title` / `.article-lede` / `.article-body` / `.article-placeholder`
- Reserved hook class: `.article-interactive`

---

## How to add a featured homepage card

```html
<div class="project-card project-card--hover">
  <div class="project-thumb">
    <img src="assets/images/FILENAME.jpg" alt="" loading="lazy" onerror="this.style.display='none'">
    <span class="project-thumb-fallback" aria-hidden="true">X</span>
  </div>
  <div class="project-body">
    <h3 class="project-title">
      <a href="LINK" target="_blank" rel="noopener" class="project-title-link">
        PROJECT NAME
        <svg class="project-title-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
      </a>
    </h3>
    <p class="project-desc">One or two sentences.</p>
    <ul class="project-tech" role="list">
      <li>Tech 1</li>
    </ul>
  </div>
</div>
```

Private cards: add `project-card--private`, no title link, use `.project-badge`.

---

## Thumbnail style guide

- Size: ~1200×720 (CSS cards use 16:9)
- Background: off-white / warm paper
- Accent: terracotta on one focal element
- Flat editorial illustration — no gradients, glow, faces, or 3D
- Prefer JPEG after export for weight; keep under ~100KB when possible

---

## Deployment

- GitHub Pages + custom domain `suchith.space` (`CNAME`)
- No build step — plain HTML/CSS/JS
- Analytics: Google Analytics `G-BFC42ZF5NR`
