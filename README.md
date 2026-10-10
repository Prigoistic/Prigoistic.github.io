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

GitHub Pages deploys these files from the root of `main` to `prigoistic.me`.
Separately deployed GitHub project sites may still own the former `/cheeger/`
and `/engram/` routes; changing those live deployments requires updating their
hosting repositories. The portfolio catalogue uses its own `/blog/` routes.
