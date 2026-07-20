# Home Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the home page's repetitive label/value row tables (ABOUT, EXPLORE) and duplicate contact-link blocks with a prose-based layout (intro, `me`, `writing`, `reach`), and swap the site's monospace typeface from JetBrains Mono to Geist Mono, site-wide.

**Architecture:** This is a static HTML/CSS site with no build step, no JS framework, and no automated test suite. Every page is a standalone `.html` file that links a shared `style.css` and a Google Fonts `<link>` tag. There is nothing to unit-test — "tests" in this plan are `grep`-based structural assertions (e.g. "this string is gone", "this new class exists in both files") run after each edit, plus a manual visual check in a browser at the end.

**Tech Stack:** Plain HTML5, CSS3, Google Fonts (`Geist Mono` replacing `JetBrains Mono`). No JS involved in this change.

## Global Constraints

- Do not modify or remove `.row`, `.row-label`, `.row-dots`, `.row-value` in `style.css` — used by `contact.html` and `experience.html`.
- Do not modify or remove `.footer-links` in `style.css` — used by `blog.html`, `contact.html`, `experience.html`, `projects.html`, `research.html`.
- Do not modify `projects.html`, `experience.html`, `research.html`, `blog.html`, `contact.html`, any file under `blog/`, or `resume/index.html`, **except** for the single font-link line changed in Task 1.
- The four contact links (X, GitHub, LinkedIn, email) must appear exactly once on the redesigned `index.html` — in the new `reach` section only.
- No new biographical facts are invented for the `me` section — it restates facts already present elsewhere on the site (the old ABOUT rows, resume).
- Exact contact values to use everywhere in this plan:
  - X: `https://x.com/prigoistic` (link text: `X`)
  - GitHub: `https://github.com/prigoistic` (link text: `GitHub`)
  - LinkedIn: `https://linkedin.com/in/prigoistic` (link text: `LinkedIn`)
  - Email: `mailto:priyamghosh9753@gmail.com` (link text: `priyamghosh9753@gmail.com`)
- Spec doc: `docs/superpowers/specs/2026-07-19-home-page-redesign-design.md` — re-read it if any task below seems ambiguous.

---

### Task 1: Site-wide font swap — JetBrains Mono → Geist Mono

**Files:**
- Modify: `style.css:18` (body font-family)
- Modify: `style.css:642` (`.article-equation` font-family)
- Modify: `style.css:710` (`.article-code-block code` font-family)
- Modify: `style.css:729` (`.article-body code` font-family)
- Modify: `style.css:740` (`.article-highlight` font-family)
- Modify (Google Fonts `<link>` tag, line 9 in each): `index.html`, `projects.html`, `experience.html`, `research.html`, `blog.html`, `contact.html`, `resume/index.html`, `blog/spectral-graph-theory-brain.html`, `blog/energy-landscapes-free-energy.html`, `blog/astrocytes-tripartite-synapse.html`, `blog/oops-through-clash-royale.html`

**Interfaces:** None — this is a pure find/replace task, no other task depends on font-loading internals.

- [ ] **Step 1: Confirm current state (baseline check)**

Run: `grep -rc "JetBrains Mono" style.css *.html blog/*.html resume/index.html`
Expected: every listed file shows a count ≥ 1 (11 HTML files at 1 each, `style.css` at 5).

- [ ] **Step 2: Replace the font family in `style.css`**

All 5 occurrences in `style.css` are the literal string `'JetBrains Mono', monospace`. Replace every occurrence with `'Geist Mono', monospace`:

```bash
sed -i '' "s/'JetBrains Mono', monospace/'Geist Mono', monospace/g" style.css
```

- [ ] **Step 3: Replace the Google Fonts link tag in every HTML file**

Every file has this exact line (line 9):
```html
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
```
Replace with:
```html
  <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
```

Apply across all files in one pass:

```bash
sed -i '' 's/family=JetBrains+Mono/family=Geist+Mono/' index.html projects.html experience.html research.html blog.html contact.html resume/index.html blog/spectral-graph-theory-brain.html blog/energy-landscapes-free-energy.html blog/astrocytes-tripartite-synapse.html blog/oops-through-clash-royale.html
```

- [ ] **Step 4: Verify no `JetBrains Mono` references remain**

Run: `grep -rc "JetBrains" style.css *.html blog/*.html resume/index.html`
Expected: every file shows `0` (or the file is omitted by `grep -rc` with no match — either is fine, just confirm no non-zero counts print).

- [ ] **Step 5: Verify `Geist Mono` is now present in the same 11 HTML files + style.css**

Run: `grep -rlc "Geist Mono" style.css *.html blog/*.html resume/index.html | grep -v ':0'`
Expected: lists `style.css` and all 11 HTML files.

- [ ] **Step 6: Commit**

```bash
git add style.css index.html projects.html experience.html research.html blog.html contact.html resume/index.html blog/spectral-graph-theory-brain.html blog/energy-landscapes-free-energy.html blog/astrocytes-tripartite-synapse.html blog/oops-through-clash-royale.html
git commit -m "Swap site typeface from JetBrains Mono to Geist Mono"
```

---

### Task 2: Header casing + remove duplicate contact links under header

**Files:**
- Modify: `index.html` (header name/subtitle text, remove `.header-links` block)
- Modify: `style.css` (`.header-name`, `.header-subtitle`, delete `.header-links` rules)

**Interfaces:** None — self-contained header cleanup. Task 6 will add the replacement contact links (`reach` section) later in the same file; this task only removes the old ones.

- [ ] **Step 1: Update header text and remove the link row in `index.html`**

Find:
```html
  <!-- ═══════════ HEADER ═══════════ -->
  <div class="home-header">
    <div>
      <div class="header-name">PRIYAM</div>
      <div class="header-subtitle">AI SYSTEMS · BACKEND · RESEARCH</div>
    </div>
    <img src="images/icon.png" alt="Priyam" class="home-icon" />
  </div>

  <div class="header-by">by Priyam Ghosh</div>
  <div class="header-links">
    <a href="https://linkedin.com/in/prigoistic" target="_blank" rel="noopener">LinkedIn</a><span class="sep">·</span><a href="https://x.com/PriGoistic" target="_blank" rel="noopener">X</a><span class="sep">·</span><a href="https://github.com/prigoistic" target="_blank" rel="noopener">GitHub</a><span class="sep">·</span><a href="mailto:priyamghosh9753@gmail.com">Email</a>
  </div>
```

Replace with:
```html
  <!-- ═══════════ HEADER ═══════════ -->
  <div class="home-header">
    <div>
      <div class="header-name">Priyam</div>
      <div class="header-subtitle">Systems · Research · Inference</div>
    </div>
    <img src="images/icon.png" alt="Priyam" class="home-icon" />
  </div>
```

(This also drops the `.header-by` div — "by Priyam Ghosh" directly under a header that already says "Priyam" is redundant.)

- [ ] **Step 2: Verify the old markup is gone**

Run: `grep -c "header-links\|header-by\|PRIYAM\|AI SYSTEMS" index.html`
Expected: `0`

- [ ] **Step 3: Update `.header-name` and `.header-subtitle` in `style.css`**

Find:
```css
.header-name {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.header-subtitle {
  font-size: 13px;
  color: #9a9a9a;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 20px;
}
```

Replace with:
```css
.header-name {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.02em;
  margin-bottom: 4px;
}

.header-subtitle {
  font-size: 13px;
  color: #9a9a9a;
  letter-spacing: 0.01em;
  margin-bottom: 20px;
}
```

(Dropping `text-transform: uppercase` means the wide `0.18em`/`0.06em` tracking — tuned for all-caps — now reads too loose for title-case text, so both are tightened in the same edit.)

- [ ] **Step 4: Update the two responsive overrides for `.header-name` letter-spacing**

Find (inside the `@media (max-width: 768px)` block):
```css
  .header-name {
    font-size: 24px;
    letter-spacing: 0.14em;
  }
```
Replace with:
```css
  .header-name {
    font-size: 24px;
    letter-spacing: 0.02em;
  }
```

Find (inside the `@media (max-width: 540px)` block):
```css
  .header-name {
    font-size: 20px;
    letter-spacing: 0.12em;
  }
```
Replace with:
```css
  .header-name {
    font-size: 20px;
    letter-spacing: 0.02em;
  }
```

Find (inside the `@media (max-width: 380px)` block):
```css
  .header-name {
    font-size: 18px;
    letter-spacing: 0.1em;
  }
```
Replace with:
```css
  .header-name {
    font-size: 18px;
    letter-spacing: 0.02em;
  }
```

- [ ] **Step 5: Delete the now-unused `.header-links` CSS block**

Find and delete entirely:
```css
.header-links a {
  color: #9a9a9a;
  text-decoration: underline;
  text-underline-offset: 3px;
  font-size: 13px;
  transition: color 0.2s;
}

.header-links a:hover {
  color: #ffffff;
}

.header-links .sep {
  color: #333333;
  margin: 0 6px;
  font-size: 13px;
}
```

Also delete the now-unused `.header-by` rule:
```css
.header-by {
  font-size: 13px;
  color: #666666;
  margin-bottom: 8px;
}
```

- [ ] **Step 6: Verify no dead CSS or stray letter-spacing values remain**

Run: `grep -c "header-links\|header-by\|0\.18em\|0\.14em\|0\.12em\|0\.1em\b\|0\.06em" style.css`
Expected: `0`

- [ ] **Step 7: Commit**

```bash
git add index.html style.css
git commit -m "Simplify home page header, drop duplicate contact links and all-caps styling"
```

---

### Task 3: Replace `.mission` copy and remove the ABOUT row table

**Files:**
- Modify: `index.html` (mission paragraph text, delete `#about` block)

**Interfaces:** None — pure content edit. Leaves exactly one `<hr />` in place, immediately followed by the EXPLORE section (which Task 5 will replace).

- [ ] **Step 1: Replace the mission paragraphs and delete the ABOUT block**

Find:
```html
  <div class="mission">
    I build reasoning centric AI systems and scalable backend infrastructure.<br />
    Focused on learning, memory, and system-level intelligence.

    
  </div>

  <div class="mission">
    Currently a Computer Science Undergraduate at Birla Institute of Technology and Science, Pilani.
  </div>

  <hr />

  <!-- ═══════════ ABOUT ═══════════ -->
  <div id="about">
    <div class="section-title">ABOUT</div>

    <div class="row">
      <span class="row-label">ROLE</span>
      <span class="row-dots"></span>
      <span class="row-value">AI Researcher, Backend &amp; Systems Developer</span>
    </div>
    <div class="row">
      <span class="row-label">FOCUS</span>
      <span class="row-dots"></span>
      <span class="row-value">Self Learning LLMs, Long-Context Memory, Distributed Backends</span>
    </div>
    <div class="row">
      <span class="row-label">INTERESTS</span>
      <span class="row-dots"></span>
      <span class="row-value">Computational Neuroscience, Foundational Maths, System Design</span>
    </div>
    <div class="row">
      <span class="row-label">CURRENT WORK</span>
      <span class="row-dots"></span>
      <span class="row-value">Co-Founder & Chief of Research @MetaCognition</span>
    </div>
    <div class="row">
      <span class="row-label">BACKGROUND</span>
      <span class="row-dots"></span>
      <span class="row-value">AI researcher and Developer</span>
    </div>
  </div>

  <hr />
```

Replace with:
```html
  <div class="mission">
    I'm an AI researcher and backend/systems developer — working on self-learning LLMs, long-context memory, and distributed backends. Curious about computational neuroscience, foundational math, and how those ideas carry into system design.
  </div>

  <div class="mission">
    Currently Co-Founder &amp; Chief of Research at MetaCognition. Studying Computer Science at Birla Institute of Technology and Science, Pilani.
  </div>

  <hr />
```

- [ ] **Step 2: Verify the ABOUT block and old copy are gone**

Run: `grep -c 'id="about"\|ROLE\|FOCUS\|INTERESTS\|BACKGROUND\|reasoning centric' index.html`
Expected: `0`

- [ ] **Step 3: Verify the total `<hr />` count dropped from 3 to 2**

The original file had 3 horizontal rules (after the mission block, after ABOUT, after EXPLORE). Deleting the ABOUT block in Step 1 removed one of them.

Run: `grep -c "<hr />" index.html`
Expected: `2`

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Replace home page ABOUT row table with prose intro"
```

---

### Task 4: Add the `me` section

**Files:**
- Modify: `index.html` (insert new section after the intro's `<hr />`)
- Modify: `style.css` (add `.home-section-heading`)

**Interfaces:**
- Produces: `.home-section-heading` CSS class — a lowercase, non-tracked section heading. Tasks 5 and 6 reuse this same class for `writing` and `reach`.

- [ ] **Step 1: Add the `.home-section-heading` class to `style.css`**

Add this new rule directly after the existing `.section-title` rule block (search for `.section-title {` to locate it):

```css
.home-section-heading {
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 20px;
}
```

- [ ] **Step 2: Insert the `me` section in `index.html`**

Find (the `<hr />` that now directly precedes the EXPLORE section, from Task 3):
```html
  <hr />

  <!-- ═══════════ QUICK LINKS ═══════════ -->
  <div class="section-title">EXPLORE</div>
```

Replace with:
```html
  <hr />

  <!-- ═══════════ ME ═══════════ -->
  <div class="home-section-heading">me</div>

  <div class="mission">
    I think of most of my work as building systems that remember and reason instead of just responding — memory architectures, self-learning loops, and the backend plumbing that makes both possible at scale.
  </div>

  <div class="mission">
    Outside of that, I spend a lot of time in computational neuroscience and the math underneath it, mostly because the brain is still the best existence proof we have for system-level intelligence.
  </div>

  <hr />

  <!-- ═══════════ QUICK LINKS ═══════════ -->
  <div class="section-title">EXPLORE</div>
```

(The `EXPLORE` section-title line is left untouched here on purpose — Task 5 replaces it. This step only inserts new content before it.)

- [ ] **Step 3: Verify the section was added correctly**

Run: `grep -c 'home-section-heading">me<\|memory architectures\|existence proof' index.html`
Expected: `3`

- [ ] **Step 4: Verify `.home-section-heading` exists exactly once in `style.css` (no duplicate rule)**

Run: `grep -c "\.home-section-heading {" style.css`
Expected: `1`

- [ ] **Step 5: Commit**

```bash
git add index.html style.css
git commit -m "Add 'me' section to home page"
```

---

### Task 5: Replace the EXPLORE row table with a `writing` section

**Files:**
- Modify: `index.html` (replace EXPLORE block with `writing` section)
- Modify: `style.css` (add `.writing-item`, `.writing-item-title`, `.writing-item-date`, plus one mobile override)

**Interfaces:**
- Consumes: `.home-section-heading` (from Task 4), `.mission` (existing), `.back-link` (existing, defined in `style.css` — used unmodified for the "view all →" link).
- Produces: `.writing-item` / `.writing-item-title` / `.writing-item-date` CSS classes — a flex row pairing a linked post title with a right-aligned date. Not consumed by any other task in this plan, but available if a future task extends the home page.

- [ ] **Step 1: Add the writing-item CSS to `style.css`**

Add this directly after the `.back-link:hover` rule (search for `.back-link:hover {` to locate it):

```css
.writing-item {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 10px;
}

.writing-item-title {
  color: #ffffff;
  text-decoration: underline;
  text-underline-offset: 3px;
  font-size: 13px;
  flex: 1;
  min-width: 0;
  transition: color 0.2s;
}

.writing-item-title:hover {
  color: #9a9a9a;
}

.writing-item-date {
  color: #555555;
  font-size: 12px;
  white-space: nowrap;
  flex-shrink: 0;
}
```

- [ ] **Step 2: Add a mobile override so long titles don't get squeezed against the date**

Add this inside the existing `@media (max-width: 540px)` block (search for `/* ── LIST ITEMS ── */` inside that block to find a nearby insertion point):

```css
  .writing-item {
    flex-wrap: wrap;
  }

  .writing-item-date {
    width: 100%;
    margin-top: 2px;
  }
```

- [ ] **Step 3: Replace the EXPLORE block in `index.html`**

Find:
```html
  <!-- ═══════════ QUICK LINKS ═══════════ -->
  <div class="section-title">EXPLORE</div>

  <div class="row">
    <span class="row-label">PROJECTS</span>
    <span class="row-dots"></span>
    <span class="row-value"><a href="projects.html">View all projects</a></span>
  </div>
  <div class="row">
    <span class="row-label">EXPERIENCE</span>
    <span class="row-dots"></span>
    <span class="row-value"><a href="experience.html">Skills &amp; timeline</a></span>
  </div>
  <div class="row">
    <span class="row-label">RESEARCH</span>
    <span class="row-dots"></span>
    <span class="row-value"><a href="research.html">Papers &amp; areas</a></span>
  </div>
  <div class="row">
    <span class="row-label">BLOG</span>
    <span class="row-dots"></span>
    <span class="row-value"><a href="blog.html">Thoughts &amp; notes</a></span>
  </div>
  <div class="row">
    <span class="row-label">CONTACT</span>
    <span class="row-dots"></span>
    <span class="row-value"><a href="contact.html">Get in touch</a></span>
  </div>
  <div class="row">
    <span class="row-label">CV / RESUME</span>
    <span class="row-dots"></span>
    <span class="row-value"><a href="resume/">View &amp; download</a></span>
  </div>

  <hr />
```

Replace with:
```html
  <!-- ═══════════ WRITING ═══════════ -->
  <div class="home-section-heading">writing</div>

  <div class="mission">
    Notes on systems, AI, and learning.
  </div>

  <div class="writing-item">
    <a href="https://prigoistic.me/cheeger/" class="writing-item-title" target="_blank" rel="noopener">cheeger: Differentiable Spectral Embedding for Dense Semantic Segmentation</a>
    <span class="writing-item-date">2026-06-16</span>
  </div>
  <div class="writing-item">
    <a href="https://prigoistic.me/engram" class="writing-item-title" target="_blank" rel="noopener">engram: Building a Redis-Wire Vector Memory Engine in Rust from Scratch</a>
    <span class="writing-item-date">2026-06-16</span>
  </div>

  <a href="blog.html" class="back-link">view all →</a>

  <hr />
```

- [ ] **Step 4: Verify the EXPLORE table and duplicated nav links are gone**

Run: `grep -c 'EXPLORE\|View all projects\|Skills &amp; timeline\|Papers &amp; areas\|Get in touch\|View &amp; download' index.html`
Expected: `0`

- [ ] **Step 5: Verify the writing section renders the two posts**

Run: `grep -c "writing-item\b" index.html`
Expected: `2`

- [ ] **Step 6: Commit**

```bash
git add index.html style.css
git commit -m "Replace home page EXPLORE row table with 'writing' section"
```

---

### Task 6: Add `reach` section, simplify footer, final verification

**Files:**
- Modify: `index.html` (insert `reach` section before the footer, simplify the footer)
- Modify: `style.css` (add `.reach-line a` / `.reach-line a:hover`)

**Interfaces:**
- Consumes: `.home-section-heading` (Task 4), `.mission` (existing), `.footer` (existing, unmodified — still used by every other page with its full link row; only `index.html`'s *markup* inside `.footer` is simplified in this task, not the CSS class itself).
- Produces: `.reach-line` — final new class in this plan.

- [ ] **Step 1: Add `.reach-line` link styling to `style.css`**

Add this directly after the `.mission` rule (search for `.mission {` to locate it):

```css
.reach-line a {
  color: #ffffff;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s;
}

.reach-line a:hover {
  color: #9a9a9a;
}
```

- [ ] **Step 2: Replace the footer block in `index.html`**

Find:
```html
  <!-- ═══════════ FOOTER ═══════════ -->
  <div class="footer">
    <div>&copy; 2026 Priyam</div>
    <div class="footer-links">
      <a href="https://linkedin.com/in/prigoistic" target="_blank" rel="noopener">LinkedIn</a><span class="sep">·</span><a href="https://x.com/prigoistic" target="_blank" rel="noopener">X</a><span class="sep">·</span><a href="https://github.com/prigoistic" target="_blank" rel="noopener">GitHub</a><span class="sep">·</span><a href="mailto:priyamghosh9753@gmail.com">Email</a>
    </div>
  </div>
```

Replace with:
```html
  <!-- ═══════════ REACH ═══════════ -->
  <div class="home-section-heading">reach</div>

  <div class="mission reach-line">
    connect on <a href="https://x.com/prigoistic" target="_blank" rel="noopener">X</a> · <a href="https://github.com/prigoistic" target="_blank" rel="noopener">GitHub</a> · <a href="https://linkedin.com/in/prigoistic" target="_blank" rel="noopener">LinkedIn</a> — or email at <a href="mailto:priyamghosh9753@gmail.com">priyamghosh9753@gmail.com</a>
  </div>

  <!-- ═══════════ FOOTER ═══════════ -->
  <div class="footer">&copy; 2026 Priyam</div>
```
(No `<hr />` here — the approved layout sketch shows `reach` flowing straight into the copyright line with blank space only, not a rule.)

- [ ] **Step 3: Verify contact links appear exactly once each on the page**

Run: `grep -c 'x.com/prigoistic\|github.com/prigoistic\|linkedin.com/in/prigoistic\|mailto:priyamghosh9753@gmail.com' index.html`
Expected: `4` (one line per link, one match per line)

- [ ] **Step 4: Verify the old footer-links markup is gone from `index.html`**

Run: `grep -c "footer-links" index.html`
Expected: `0`

- [ ] **Step 5: Verify `footer-links` CSS class is untouched in `style.css` (still needed by other pages)**

Run: `grep -c "\.footer-links" style.css`
Expected: `2` (the `.footer-links` rule and the `.footer-links a` / `.footer-links .sep` rules — confirms Task 6 didn't touch this shared class)

- [ ] **Step 6: Full-page structural check — no repeated content blocks**

Run: `grep -c "row-label\|EXPLORE\|header-links\|footer-links" index.html`
Expected: `0` (confirms every row-table and duplicate-link pattern called out in the spec is gone from the home page)

- [ ] **Step 7: Manual visual check in a browser**

Run: `python3 -m http.server 8000` from the repo root, then open `http://localhost:8000/index.html`.

Confirm visually:
- Header shows "Priyam" (not "PRIYAM") and "Systems · Research · Inference", no all-caps.
- No dotted-leader row tables remain.
- Sections read top to bottom: intro paragraphs → `me` → `writing` (2 posts + "view all →") → `reach` (one line of links) → `© 2026 Priyam`.
- Contact links (X/GitHub/LinkedIn/email) appear only in the `reach` section.
- Resize to mobile width (~375px) and confirm the `writing` post rows stack title-above-date instead of overlapping.
- Click through to `projects.html` and `blog.html` and confirm the font looks the same as the home page (Geist Mono, not a mismatched fallback).

Stop the server with `Ctrl+C` when done.

- [ ] **Step 8: Commit**

```bash
git add index.html style.css
git commit -m "Add home page 'reach' section, simplify footer"
```
