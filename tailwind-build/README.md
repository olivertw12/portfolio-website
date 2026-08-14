# tailwind-build

This folder holds the site's build step. It produces two things:

- `../assets/tailwind.css` — the stylesheet
- `../projects/*.html` plus the card grids inside `../index.html` and `../archive.html` — real HTML, generated from `projects.js`

```
npm install          # first time only
npm run build        # css, then html
```

Both outputs are committed to the repo on purpose, so Cloudflare deploys with no build step and a normal `git push` is still all it takes.

## The two halves

**`npm run build:css`** compiles Tailwind. The site used to load `https://cdn.tailwindcss.com`, which is a compiler that runs in the visitor's browser on every page load — Tailwind's own docs say not to ship it that way. `tailwind.config.cjs` here is the only Tailwind config in the repo.

**`npm run build:html`** runs `prerender.js`. Everything on the site is rendered from `projects.js` by `render.js`, which is fine for a visitor and useless to a crawler — it sees an empty `<div>` where the project grid should be. So `prerender.js` loads those same two files under Node and writes the markup into the HTML:

1. every `<div data-cards="...">` gets its cards inlined
2. `project.html` is used as a template to write one real page per project into `../projects/`
3. every link to a local stylesheet or script gets `?v=<content hash>` appended
4. `sitemap.xml` and the `/project.html?id=…` redirects in `_redirects` are regenerated from `projects.js`, so they can't drift

That third step exists because of a real failure: a nav item deleted from `components.js` kept appearing on the live site after the deploy, because the browser and the edge already had the old file at the same URL and had no reason to re-fetch it. The hash changes whenever the file does, so the URL changes with it and a stale copy can never be served against new HTML.

## When you need to rebuild

**After a new Tailwind class.** The build scans `../*.html`, `../*.js` and `../projects/*.html` and only includes classes it finds. A brand new class doesn't exist in the stylesheet until you rebuild; the symptom is one element rendering unstyled while everything around it looks fine.

**After editing `projects.js`, `render.js` or `project.html`.** Otherwise the static HTML is stale. This one fails softly: `render.js` fills in anything the build left empty, so the live site still looks right in a browser and only a crawler sees the old version. Worth being careful about for that reason.

You do **not** need to rebuild for changes to `style.css`, which ships as-is, or for copy edits inside a page.

`npm run watch:css` rebuilds the stylesheet continuously while you work.

## If you'd rather Cloudflare built it

Set the build command in the Cloudflare Pages settings to:

```
cd tailwind-build && npm ci && npm run build
```

Leave the output directory as the repo root, and you can gitignore `assets/` and `projects/` instead of committing them. Either way works — committing is simpler, letting Cloudflare build it means you can't forget.

## Icons

One set: **Font Awesome**, loaded from a pinned CDN URL (`6.4.0`). The site previously carried Font Awesome *and* a local lucide subset — two libraries for about thirty glyphs, sized two different ways (`text-lg` versus `w-5 h-5`), which was a recurring source of icons that came out the wrong size.

The one exception is the anchor mark, which is lucide's `anchor` path inlined directly. It's in `components.js` as `anchorMark()` for the nav, and written out by hand on the resume and cover letter, where it only appears in print. Font Awesome's anchor is a different drawing, so this keeps the logo exactly as it was without keeping a whole library for it.

## Colors and scale

The palette lives in `../style.css` as CSS variables, in two blocks: `:root` for light and `.dark` for the values that change. That's the entire theming system — there are no `.dark .something` rules anywhere else and no `dark:` variants in the markup. `tailwind.config.cjs` points Tailwind's color names at those variables, so `text-muted` and `bg-surface` are correct in both themes.

The text colors are named `ink`, `body`, `muted`, `subtle` rather than `primary`. If one were called `primary`, Tailwind would generate a `.text-primary` that collides with the button color — which is exactly what the old `html .text-primary` override in `style.css` existed to patch.

Adding a *new* color name to the config needs a rebuild, and the variable has to exist in `style.css` or the utility fails quietly.

`extend` also carries the rest of the scale: four line heights, four radii, one extra small type size, the z-index layers and the named panel heights. They live there so no page needs an arbitrary `[value]` in a class. If a number isn't in that file, it isn't part of the system — there are currently zero arbitrary values in the markup, and it's worth keeping it that way.

Note that `accent` points at `--color-accent-text` (`#2C5C4D` light, `#7BB6A2` dark), a darker celadon in light mode than `--color-accent` (`#35705E`). That's deliberate: the lighter one is fine behind an icon or a rule but too light to read as small text. Decorative uses reach for `var(--color-accent)` directly in `style.css`.
