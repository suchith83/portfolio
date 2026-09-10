# Portfolio update rules

Reference for future sessions working on this portfolio (`suchith.space`).

---

## Site structure

| File | Purpose |
|---|---|
| `index.html` | Home — hero, about, selected projects, experience, writing teaser, toolkit, contact |
| `projects.html` | Engineering case studies (work / OSS / personal) |
| `writing.html` | Writing index |
| `seat-booking.html` | Interactive systems article: seat booking concurrency |
| `styles.css` | Design tokens, layout, components, article viz, responsive + reduced-motion |
| `js/script.js` | Theme, mobile nav ARIA, card click, reveal, GoatCounter view counters |
| `js/seat-booking.js` | Modular interactive demos for the seat-booking article |
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

## Writing & interactive articles

- Index: [`writing.html`](writing.html)
- Published article: [`seat-booking.html`](seat-booking.html) — “How Do You Stop Two People From Booking the Same Seat?”
- Article script modules live in `js/seat-booking.js` as small controllers (`SeatGrid`, `ConcurrentRequests`, `RowLockVisualizer`, `OptimisticLockDemo`, `HoldTimer`, `ApiFlow`, `IdempotencyDemo`, `SystemArchitecture`, …)
- Markup: `.system-article`, `.article-interactive[data-viz="…"]`, `.viz-*`, seat states `FREE|HELD|BOOKED|LOCKED`
- Every interactive block must keep a short non-interactive note + `aria-live` status
- Respect `prefers-reduced-motion` (step delays → 0)

### Future articles

1. Add `article-name.html` using the same nav/footer/theme shell
2. Prefer a dedicated `js/article-name.js` rather than bloating `script.js`
3. Link from `writing.html` and optionally the home Writing teaser
4. Use `data-view-count="page" data-view-path="/article-name.html"` for article views

---

## View counters (GoatCounter)

- Tracker: `https://suchith.goatcounter.com/count` via `//gc.zgo.at/count.js` on every public HTML page
- Public JSON: `https://suchith.goatcounter.com/counter/PATH.json`
- Profile views: path `/` via `data-view-count="profile"`
- Article views: exact path e.g. `/seat-booking.html` via `data-view-count="page" data-view-path="…"`
- Labels say **views**, not unique visitors
- Counters fail soft (`profile views —` / `article views —`) if blocked or not activated

### One-time setup

1. Create/confirm GoatCounter site code **`suchith`** → `suchith.goatcounter.com`
2. Point the site at `suchith.space`
3. Enable **Allow adding visitor counts on your website**
4. Keep canonical paths stable (`/`, `/seat-booking.html`, …)

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
- Analytics: Google Analytics `G-BFC42ZF5NR` + GoatCounter `suchith`
