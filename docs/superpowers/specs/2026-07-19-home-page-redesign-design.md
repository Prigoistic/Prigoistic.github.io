# Home page redesign

## Problem

The current home page (`index.html`) repeats itself in two ways:

1. **ABOUT** renders 5 label/value rows (ROLE, FOCUS, INTERESTS, CURRENT WORK, BACKGROUND) as a dotted-leader table — it reads like a spec sheet, not a personal page.
2. **EXPLORE** renders 6 more label/value rows that just re-link pages already reachable from the nav bar one line above (PROJECTS, EXPERIENCE, RESEARCH, BLOG, CONTACT, RESUME).
3. Contact links (LinkedIn / X / GitHub / Email) appear twice: once under the header (`.header-links`), once again in the footer (`.footer-links`).

Net effect: three separate "same links, different format" blocks on one page. The reference layout the user shared (a minimal personal site) avoids this by using prose instead of tables, and stating each link exactly once.

## Scope

- `index.html`: full content restructure.
- `style.css`: add new classes for the redesigned home sections; **do not remove or repurpose** `.row`, `.row-label`, `.row-dots`, `.row-value` (used by `contact.html`, `experience.html`) or `.header-links`/`.footer-links` patterns used elsewhere.
- Typeface change (JetBrains Mono → Geist Mono) is applied **site-wide**, since the font is loaded per-page via a `<link>` tag and set once in `body` in `style.css` — every HTML file's `<link>` tag and the CSS `font-family` need to change together, or pages will visually mismatch when navigating.
- Other pages (`projects.html`, `experience.html`, `research.html`, `blog.html`, `contact.html`, blog articles, resume) keep their current structure. Only the font swap touches them.

## Content changes (index.html)

### Header
Unchanged structurally (icon + name + subtitle), except:
- `PRIYAM` → `Priyam` (drop `text-transform: uppercase` / all-caps styling on `.header-name`)
- `AI SYSTEMS · BACKEND · RESEARCH` → `AI Systems · Backend · Research` (drop uppercase on `.header-subtitle`)
- Nav bar keeps its current uppercase treatment — unaffected, not part of the complaint.

### Intro (replaces both `.mission` blocks and the `#about` row table)
Two short prose paragraphs, new class (e.g. `.intro`), replacing all 5 ABOUT rows and the two mission divs:

1. What I do — merges ROLE + FOCUS + INTERESTS into flowing sentences: AI researcher and backend/systems developer; self-learning LLMs, long-context memory, distributed backends; curious about computational neuroscience, foundational math, and system design.
2. Current status — merges CURRENT WORK + the old "Currently a CS Undergraduate..." line: Co-Founder & Chief of Research at MetaCognition; studying Computer Science at BITS Pilani.

The BACKGROUND row ("AI researcher and Developer") is dropped — it restates ROLE and adds nothing.

### me
New section, lowercase heading `me`, one or two short prose paragraphs. Content is a slightly more personal restatement of the same facts already on the site (no invented biographical anecdotes) — e.g. what drew you to AI systems/backend work, what "system-level intelligence" means to you day to day. Reuses `.intro`-style prose, not new tone/content beyond what already exists elsewhere on the site (About rows, resume).

### writing
New section, lowercase heading `writing`, one short intro line, then the 2 most recent posts pulled from `blog.html`'s list (currently: "cheeger: Differentiable Spectral Embedding for Dense Semantic Segmentation" and "engram: Building a Redis-Wire Vector Memory Engine in Rust from Scratch", both dated 2026-06-16), shown as title (linked) + date, no view-count (not tracked on this site). A `view all →` link to `blog.html` below the two entries.

### reach
New section, lowercase heading `reach`, single line: `connect on X · GitHub · LinkedIn — or email at priyamghosh9753@gmail.com`, all inline underlined links (X → x.com/PriGoistic, GitHub → github.com/prigoistic, LinkedIn → linkedin.com/in/prigoistic, email → mailto: link). This is the **only** place these four contact links appear on the page.

### Footer
Reduced to `© 2026 Priyam` only — no link row (removes the duplicate contact links).

### Removed
- `#about` row table (5 rows)
- `EXPLORE` section (6 rows)
- `.header-links` block under the header

## Typography

- Swap **JetBrains Mono** → **Geist Mono** in every page's `<link href="https://fonts.googleapis.com/css2?family=...">` tag and in `body { font-family }` in `style.css`. Same weights in use (400/500/700).
- Remove `text-transform: uppercase` from `.header-name` and `.header-subtitle` only. All other uppercase usage (nav, `.section-title`, `.row-label`, page titles) is unchanged — those weren't part of the complaint and changing them would ripple into other pages' visual identity.
- New section headings (`me`, `writing`, `reach`) are lowercase by design, sentence-style, no letter-spacing/uppercase treatment — matches the reference layout.

## Color

Unchanged: `#000` background, `#fff` primary text, `#9a9a9a` secondary, `#666`/`#555`/`#333`/`#222` for meta text and rules.

## Layout sketch

```
Priyam                      [icon]
AI Systems · Backend · Research

I build reasoning-centric AI systems and scalable
backend infrastructure — self-learning LLMs, long-
context memory, distributed systems. Curious about
computational neuroscience and system design.

Currently Co-Founder & Chief of Research at
MetaCognition. Studying Computer Science at BITS
Pilani.

──────────────────────────────────────

me
[1-2 short prose paragraphs]

──────────────────────────────────────

writing
[post title]                         2026-06-16
[post title]                         2026-06-16
view all →

──────────────────────────────────────

reach
connect on X · GitHub · LinkedIn — or email at priyamghosh9753@gmail.com

© 2026 Priyam
```

## Signature element

None — considered a blinking terminal cursor after the name, dropped per user feedback in favor of a plainer, quieter header.

## Out of scope

- No changes to `projects.html`, `experience.html`, `research.html`, `blog.html`, `contact.html`, blog article pages, or the resume page beyond the font swap.
- No view-count tracking is being added — the "writing" teaser omits it since the reference layout's view count isn't data this site collects.
- No new personal/biographical facts are invented for the `me` section; it restates existing site content in prose form.
