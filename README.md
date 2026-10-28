# prigoistic.me

Personal portfolio — research, projects, and writing.

Built with plain HTML/CSS. Deployed via GitHub Pages.

All pages share the navigation, themes, typography and compact wide layout in
`assets/reading.css`, `assets/site.css` and `assets/reading.js`. The site layer
also styles project entries, experience timelines, contact rows and the resume
viewer. `assets/research.css` provides publication-specific structure.

Publication rows include PNG first-page previews in `assets/papers/`. Small
thumbnails load in the list; the full-resolution PNG loads when opened in the
keyboard-accessible zoom dialog (`assets/paper-preview.css` and `.js`). Source
URLs and image provenance are recorded in `assets/papers/sources.json`. Eight
previews were rendered from public author PDFs with Poppler at 200 dpi; the
IEEE paper uses the first-page screenshot supplied by the author. The former
`design-preview.html` now redirects to the corresponding implemented page.

**Live:** [prigoistic.me](https://prigoistic.me)

Writing lives in one catalogue at `/blog.html`. Local articles, Cheeger, Engram,
MAPA's essay and technical breakdowns, and the MAPA interview guide share
`assets/reading.css` and `assets/reading.js`. Cheeger and Engram's canonical
articles are `/blog/cheeger.html` and `/blog/engram.html`; their former local
paths redirect and preserve fragment links.

The complete HTML articles are the content source. After changing writing, run:

```sh
python3 scripts/build_writing.py
python3 scripts/check_writing.py
python3 -m http.server 8765 --bind 127.0.0.1
```

Open `http://localhost:8765/blog.html`. The generator produces public Markdown
companions, standalone diagram assets, the Markdown catalogue, and the sitemap.
Agent mode reads these same complete articles; it requires no API or AI service.
The checks verify metadata, local links and anchors, SVG validity, and Markdown
parity. Catalogue metadata is in `scripts/writing.json`; visible HTML topics
are used directly when generating Markdown.

Cover art is original deterministic Canvas illustration. Its source is
`scripts/paint-covers.cjs`; regenerating it requires Node and `@napi-rs/canvas`.
Scientific figures and benchmark images are preserved separately from covers.

`blog/intelligence-between-things.html` uses the long-form essay layout in
`assets/essay.css`. It includes an editorial cover collage, responsive SVG illustrations,
and three reader-controlled examples: Game of Life, selective retrieval, and
gradient descent in a double-well potential. They start paused and stop when
offscreen. Static images and captions remain available without JavaScript.
Game of Life offers a mixed field, the R-pentomino, crossing gliders, and still
and repeating forms. Readers can draw or erase cells, control speed, and inspect
births and deaths. The finite grid uses Conway's B3/S23 rule and identifies
settled or repeating states. `assets/life-playground.js` handles its interface;
`node scripts/render-life-fallback.mjs` regenerates its static fallback.
The cover combines an original Canvas flock with a public-domain Audubon/Havell
engraving from the National Gallery of Art. The original plate and attribution
are in `assets/essays/intelligence-between-things/`. Regenerate the cover with
`scripts/paint-intelligence.cjs` (Node and `@napi-rs/canvas`); `npm run diagrams` renders
the process diagrams with Pele. `npm run check` checks all writing and the
behaviour of the small illustrative models. The essay HTML remains the source
for its complete Markdown companion and catalogue entry.

For this essay, “When a relation becomes a thing” corresponds to the author's
page-14 note permitting more substantial proofreading and formatting. Above that
boundary, preserve the original sequence, arguments, phrasing and parenthetical
asides. Use light copyediting only; keep the author's opening and voice.

The essay also embeds Kurzgesagt's original emergence video and a locally served
12-second event-nesting animation with English captions. The YouTube embed is
click-to-play; only the locally created video animations autoplay and loop.
The event-nesting animation's source is
`scripts/animate-nested-events.cjs` (Canvas plus FFmpeg). Five external visuals
are credited in their captions; their licenses and modifications are recorded
in `assets/essays/intelligence-between-things/media-sources.json`. The complete
research figure remains available alongside the displayed panel-A crop.
The planarian comparison uses two crops from a PLOS review, with the complete
original linked below. The murmuration photograph and NYU working-memory
experiment figure are reproduced unchanged. Research figures link to their
full-resolution local images for closer reading.
The persistent-store illustration is a 16-second original animation with separate
landscape and portrait compositions (`scripts/animate-memory-flow.cjs`). Both
versions autoplay silently and loop when visible. Its full text example remains
available under “Read the example” and in the Markdown article.

The HARPY passage embeds Welch Labs' “Can humans make AI any better?” using the
official click-to-play player. Media transformation details belong in the source
manifest; reader-facing captions focus on the visual and retain attribution.
The HStore playground uses a fictional set of 24 readable events, with cue
intersections, event inspection, a four-event pinboard, new observations and
background-store growth. `assets/hstore-model.js` contains the small incidence
index and `assets/hstore-playground.js` handles the UI. This runs locally in the
page without an HStore backend. Reset restores the original events; clearing the
workspace only removes its pins. Agent mode includes the static example and
caption instead of the interactive controls.

GitHub Pages deploys these files from the root of `main` to `prigoistic.me`.
Separately deployed GitHub project sites may still own the former `/cheeger/`
and `/engram/` routes; changing those live deployments requires updating their
hosting repositories. The portfolio catalogue uses its own `/blog/` routes.
