# drift-build

Builds every page of the site.

```
node drift-build/build.cjs
```

Run it from the repo root after changing any of these, then commit what it writes:

- `../projects.js`: project data (titles, facts, pictures)
- `case-copy.cjs`: the case study text, and the title and one-line description used on the work page
- `home.inc`: the homepage body
- `references.inc`: the Sources page
- `resume.source.html`: the resume. Edit this, not `../resume.html`, which is generated from it
- `drift.css`, `drift.js`, `real-look.cjs`: the look and the 3D water, glass and anchor

It writes the pages at the root and in `../projects/`, `../drift/drift.js`, `../drift/drift.css` and `../sitemap.xml`. Pictures live in `../drift/img/` (1600px, plus 800px `-t` thumbnails); the full-size originals stay in `../images/` for the picture viewer.

The cover letter is private: it is not kept in this repo or built into the site.
