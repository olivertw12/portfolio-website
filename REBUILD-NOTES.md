# Rebuild notes

Notes on what changed in this rebuild of olivertwilliams.com, how to deploy it, and how to push from here on. This is not the repo's README — it's a handover document for the rebuild, and you can delete it once you've read it.

## Second pass — the "vibe coded" cleanup

Everything below this heading is the first pass. This section is the second one, and it changes structure rather than appearance: the homepage, the archive and every case study should look the same as before, apart from three deliberate fixes noted at the end.

The complaint was that the site reads as vibe coded. Going through it, that came down to one thing repeated in several forms — no decision was applied twice the same way.

**One renderer, one data file, one config.** `projects.js` is now data only: no markup, no DOM, no functions. Every piece of generated HTML lives in the new `render.js`, as plain string functions with no `document` in them. The two big data cards on the homepage used to be about ninety lines of hand-written markup sitting next to two grids that rendered from the data file — and `featured.data` was defined and never called. They're now `featureCard()`, driven by a `feature` block on the project, same as everything else.

**The site is prerendered.** `render.js` has no DOM dependency so that `tailwind-build/prerender.js` can run it under Node at build time. It inlines the card grids into `index.html` and `archive.html`, and writes one real page per project into `projects/`. Those static pages are the canonical URLs now — `/projects/dmarc.html` rather than `/project.html?id=dmarc`. A crawler or a no-JS visitor gets the full case study in the HTML; before, it got an empty template. `project.html` is still there as the template and still answers the old `?id=` URLs, but it's `noindex` and canonicals to the static page, and `_redirects` sends every old URL to its new one. `sitemap.xml` and those redirects are generated from `projects.js`, so they can't drift out of sync.

**Theming is one block instead of a hundred rules.** Every color that differs between light and dark is now defined twice at the top of `style.css` — once in `:root`, once in `.dark` — and nowhere else. There are no `.dark .something` rules left in the file and no `dark:` variants left in the markup. That deleted about sixty rules.

It also removed the `html .text-primary` hack. Those five selectors existed to out-specify Tailwind's own `.text-primary`, which existed because a color called `primary` in the config generates one. The text colors are called `ink`, `body`, `muted`, `subtle` now, so the collision can't happen and the extra specificity isn't needed. `!important` is down to the two places that warrant it: the first-paint transition freeze and the print stylesheet.

**There's a scale.** There were 83 arbitrary values in the markup — `leading-[1.65]` twenty-five times, `rounded-[8px]` thirteen, `rounded-[10px]` eleven, `rounded-[12px]` once, next to the `rounded-xl`/`2xl` tokens that already existed. Four different line heights on running text. All of it is now named in `tailwind.config.cjs`: four line heights, four radii, two small type sizes, named z-index layers and panel heights. The markup has zero arbitrary values, and it's worth keeping it that way — if a number isn't in the config it isn't part of the system.

**One icon library.** Font Awesome, pinned at 6.4.0. The lucide subset and its build script are gone; those thirteen icons map onto Font Awesome equivalents. The anchor is the exception you asked for — it's lucide's `anchor` path inlined directly, in `components.js` for the nav and written out on the resume and cover letter, so the mark is unchanged without keeping a library for one glyph.

**Buttons are a class.** `.btn-primary`, matching the `.btn-secondary` that already existed. The five primary buttons on the homepage were each an inline `style="background-color: var(--color-primary)"` plus a twenty-class utility string, copied. There is now one inline `style` attribute left in the whole site, and it's a `<style>` block on the resume for the mode toggle.

**Small things.** The first-paint transition freeze lifts on the second animation frame rather than after a hard-coded 100ms. The stale comments are gone — `tailwind.config.cjs` no longer claims to mirror a file that was deleted, and `projects.js` no longer documents group values (`evaluation`) that don't exist. The homepage JSON-LD said `jobTitle: "AI Model Evaluation Specialist"` and listed rubric design, which described the version of the site from before the Brushfactory repositioning; it and the meta description now match the page.

### Three things that changed on purpose

**Primary buttons in dark mode.** `--color-primary` was `#1A1A1A` in both themes, which put a near-black button on a `#121212` page — 1.02:1. The label was readable and the button had no visible edge at all. It's inverted in dark mode now: light fill, dark label.

**Links stopped inheriting.** `.card-link { color: inherit }` was a class, tied on specificity with the `text-*` utilities, and the "Next" link at the foot of each case study came out black. There's a single `a { color: inherit }` element rule instead, which loses to every utility, so a link that asks for a color gets it.

**The resume and cover letter are readable on a phone.** Both set `viewport width=1280`, which gave mobile visitors a pinch-to-zoom PDF. They're `device-width` now, and the paper stacks to one column below `lg`. `print:` variants force the two-column layout back for printing, so the PDF is unchanged.


## Third pass — visual check and cache busting

The Notes removal shipped with two faults I should have caught by looking at the page instead of the diff. The contact section lost its card along with the gradient behind it and ended up as bare left-aligned text against the footer; the card is back, without the gradient. And a nav item removed from `components.js` kept appearing live, because that file is served at a fixed URL and the old copy was still cached. `prerender.js` now stamps `?v=<content hash>` onto every local stylesheet and script, so that class of problem cannot recur.

Also this pass: the product is spelled **Brushfactory**, not BrushFactory, everywhere. The hero paragraph is Oliver's own text. Homepage metadata and the JSON-LD `jobTitle` follow it, leading with the AI evaluation work.

## Deploying

1. Copy everything here into the repo root, overwriting what's already there. That includes the folders: `assets/`, `projects/`, and `tailwind-build/`.
2. Delete `index2.html`, `project-data.html`, `project-data2.html`, and `tailwind-config.js`. The first three have replacements and `_redirects` keeps their URLs working, but only if the files are actually gone. `tailwind-config.js` existed to feed the Tailwind CDN script, which the site no longer loads. Also delete `assets/icons.js` and `tailwind-build/build-icons.js` — the lucide subset and its builder, both unused now.
3. Leave `images/` alone. None of the image paths changed.
4. Commit and push. Cloudflare picks up `_redirects`, `robots.txt`, `sitemap.xml`, and `404.html` on its own, and there's still no build step on their side because `assets/tailwind.css` and `projects/` are committed.

## Pushing from here on

Same three commands as before:

```
git add .
git commit -m "what changed"
git push origin main
```

Cloudflare sees the commit and redeploys in a few seconds.

The one new rule: **if you added a Tailwind class that wasn't already used anywhere on the site, rebuild the stylesheet first.**

```
cd tailwind-build
npm install          # first time only
npm run build
cd ..
git add .
git commit -m "what changed"
git push origin main
```

`npm run build` regenerates `assets/tailwind.css` and the prerendered HTML. You need it when you use a Tailwind class the site hasn't used before, and any time you edit `projects.js`, `render.js` or `project.html`. You don't need it for copy edits inside a page or changes to `style.css`.

A missing Tailwind class leaves that one element unstyled while everything around it looks fine. A missing prerender is quieter: the site still looks right in a browser, because `render.js` fills in whatever the build left empty, and only a crawler sees the stale version.

`tailwind-build/README.md` has the details, including how to hand the build to Cloudflare instead if you'd rather not remember.

## What changed

**The cover letter is no longer indexed.** `cover-letter.html` now has `noindex, nofollow, noarchive` on it, its Open Graph title and description are empty so a pasted link shows nothing, and `robots.txt` disallows the path. That only covers crawlers that respect it, though, so if the letter has done its job then deleting the file outright is still the safer option.

**Project cards are real links.** Every card on the homepage and in the archive is now an `<a href>` generated by `projectCard()` or `artifactCard()` in `projects.js`, so they work with the keyboard, open in a new tab, and can be crawled. Links and buttons also have a visible focus ring now, which they didn't before.

**`index2.html` is gone**, and the homepage uses the simpler hero from the original `index.html` — the anchor on the soft disc, no rings. The headline and intro paragraph were rewritten to lead with the evaluation work.

**The dead `church` link is gone.** There was no `church` entry in the project data, so that archive card has been removed rather than left pointing at the "Case Study In Progress" screen. If you want it back, add a `church` object to `projectData` and put the id back into `archiveOrder`.

**All the project data lives in `projects.js` now.** All seventeen projects are in one object. `project.html` reads the id out of the URL and checks a `layout` field: `case` renders the background/challenge/solution/result template with the gallery, and `technical` renders numbered sections with code panels and figures. The two hand-written data pages are gone — DMARC is `/projects/dmarc.html` and the site build is `/projects/site-build.html`. Section 03 of the site build case study is now describing something that's actually true.

Code samples are stored as plain text and highlighted when the page renders, so adding one doesn't mean hand-writing `<span>` tags anymore.

**Config drift.** `tailwind-config.js` was pointing `muted` at `--color-muted` and `success` at `--color-success`, and neither variable existed. `muted` now points at `--color-text-muted`, `success` is gone, and `divider`, `subtle`, `wash`, and `wash-dark` have been added — `border-divider` and `dark:bg-wash-dark` weren't doing anything before. The semantic text classes in `style.css` are now written as `html .text-primary` so they land above Tailwind's generated utilities instead of depending on load order; there's a comment in the file about it. Every page body has `.preload` on it now, so the flash prevention is consistent.

**lucide is pinned** to `0.577.0` at a full UMD path. `@latest` currently resolves to lucide 1.x, and some of the icon names used here (`bar-chart-2`, `code-2`, `maximize-2`) may not have survived that major version. `tailwind-config.js` also won't throw anymore if the Tailwind CDN fails to load.

**Two things the screenshots caught.** The disc behind the hero anchor was an inline `background-color` pointing at `--color-accent-muted`, which has no dark-mode value, so in dark mode it sat there as a bright white circle while the nav badge next to it went dark teal. That's now a `.hero-disc` class covering both modes, and light mode is unchanged. Separately, the project cards were pulling the full case-study titles, so "Mainframe Studios" had become "Mainframe Studios First Friday" and wrapped onto two lines on mobile. `card.title` is a new optional short label, set to the titles your original cards used.

I also added `text-wrap: pretty` on paragraphs and `balance` on headings, which stops a single short word getting stranded on its own line.

**Off the Tailwind CDN.** Every page now loads a prebuilt `assets/tailwind.css` (about 22KB) instead of `cdn.tailwindcss.com`, which was compiling the stylesheet in the visitor's browser on each page load. `tailwind-build/` holds the config and the build script, and its config is now the only Tailwind config — the root `tailwind-config.js` is deleted.

While I was in the head, two `@import url(...)` rules at the top of `style.css` were also pulling from CDNs, one for the fonts and one for Font Awesome. An `@import` inside a stylesheet can't start downloading until that stylesheet has itself arrived, so those were a second serialized round trip. Both are gone, and every page now requests the fonts directly with the preconnect hints ahead of them. That also fixed a quiet bug: `index.html`'s own font link only asked for Plus Jakarta Sans, so JetBrains Mono was arriving solely through the `@import` — removing it without noticing would have silently broken the mono type in every code panel.

**Contrast.** In light mode `--color-text-muted` measured 3.13:1 against the page background, under the 4.5:1 WCAG AA floor for body text, and it was carrying the section intros, card blurbs, captions and footer. `--color-accent` behind the "PART 01" labels was 2.42:1. Muted is now `#5F6764` (4.62:1) and there's a new `--color-accent-text` at `#406757` (5.07:1) used wherever the accent appears as text; the brand celadon is unchanged for icons, rules and hover borders. Dark mode already passed and wasn't touched. The three section intro paragraphs also moved from `text-muted` to `text-body`, since they're body copy rather than captions.

**Added:** `404.html`, `robots.txt`, `sitemap.xml`, `_redirects`, `assets/tailwind.css`, `tailwind-build/`, a skip-to-content link on every page, a `<main>` landmark, `theme-color` meta, JSON-LD `Person` structured data on the homepage, and a mobile section menu — below `md` the nav links were hidden, which left phone visitors with no navigation at all.

**lucide is built locally instead of fetched.** Font Awesome stays exactly as it was, on its pinned `6.4.0` CDN URL, doing the solid glyphs and the brand marks. The change is on the lucide side: rather than pulling the whole ~390KB bundle from unpkg for the dozen interface icons the site uses, `tailwind-build/build-icons.js` extracts just those into `assets/icons.js` — 13 icons, about 3KB. Same markup, same icons, same look; `window.lucide.createIcons()` still exists so nothing else changed.

If you add a `data-lucide` icon the site hasn't used before, rerun the build or it silently won't appear (the console names it). Adding a Font Awesome icon needs no build step, since that's a stylesheet.

Worth knowing when swapping one for the other: Font Awesome sizes by font-size (`text-xs`), lucide sizes by width and height (`w-4 h-4`).

**The polish pass.** The hero had two solid dark buttons competing to be the primary action; "Get in Touch" is now an outline button. "Full Archive" was bottom-aligned against the Part 03 intro paragraph, which stranded it low and away from its heading — it now sits on the heading's baseline. The phone number is out of the footer, which appeared on every page; the resume still carries it. And the nav marks which section you're currently reading, on both the desktop pill and the mobile menu.

**New palette: Ink.** Achromatic greys with the celadon kept as an accent. Backgrounds are `#EFEFEF` / `#FAFAFA` in light and `#121212` / `#1C1C1C` in dark, with no color cast; text runs `#111111` for headings, `#2E2E2E` for body, `#4D4D4D` for labels. All of it lives in the `:root` block at the top of `style.css` — nothing else in the site needed to change, since every color reads from those variables.

Measured on the rendered pages rather than on the swatches: 62 distinct text/background pairings in light and 54 in dark, across seven pages, with the pages scrolled so interactive states are live. Nothing below WCAG AA; the lowest is 5.47 against a 4.5 floor, and 54 of 62 clear AAA.

**Three contrast bugs fixed along the way**, all found by auditing the rendered DOM rather than the token list:

The homepage code preview was **black text on a near-black panel, 1.24:1** — the punctuation and braces were effectively invisible and had been since the original site. That div never had a color set, so it inherited the browser default. There's a `--color-code-text` token now, deliberately not theme-aware, because those panels are dark in both modes.

The case-study code panels were at **3.89:1**. Those used `.text-subtle`, which I'd darkened in an earlier pass to fix light-mode legibility — which improved it on light backgrounds and broke it on the always-dark code panels. Same fix.

The active nav item measured **1.01:1 against the pill behind it**. The label was readable but the highlight conveyed nothing, which is a WCAG 1.4.11 failure — a state indicator needs 3:1 against its surroundings. It's a solid accent fill now: 6.65:1 in light, 8.08:1 in dark. The selector is doubled (`.nav-pill-item.nav-pill-item-active`) on purpose, because `.nav-pill-item:hover` is a two-part selector and would otherwise win, making the highlight disappear the moment you hovered it.

Also, the inactive "Design Focus / Data Focus" button on the resume had no dark-mode color at all, so it kept the light-mode grey on the dark nav pill — 2.22:1. It has a dark variant now.

## Part 01 — Brushfactory

Part 01 is now the product you're actually building, not the AI evaluation work.

The old section was called "AI Evaluation" and opened with "The evaluation work I do for clients is confidential," which reads as a practice you run rather than contract work you do for two companies. The two pieces under it were also written *for the portfolio* — the rubric promised scored runs that don't exist yet. Brushfactory is shipped, public, and hard in a way that's easy to demonstrate, so it's a straight upgrade in evidence as well as a more honest frame.

**On the homepage:** a product-first section — the converter screenshot, the "Your brushes, wherever you draw" line, the four formats, and two buttons: out to brushfactory.co, and through to a case study.

**The case study** (`/projects/brushfactory.html`) covers the four undocumented formats, why feel is the hard part rather than settings, the cohesion harness that converts a brush to every format and flags anything drifting past 2%, the support tiers and preflight that say plainly what doesn't work, and a short note on the product plumbing.

The screenshot is `images/brushfactory-converter.png`, rendered from your own `brushfactory-app.html` at 2x. Drop it into `images/` with the rest.

**The rubric page is retired.** The task-brief notes survive as a small "Notes" section before Contact, framed explicitly as generalized from contract work — which is true and doesn't imply a business.

Your hero line still says you work in AI training and evaluation. That's accurate and stays; it was the section header that implied the practice, not the mention.

### Two things worth knowing

`brushfactory.co` has since caught up. `/fidelity` and `/credits` are both live, Pro is selling at $7.99 a month rather than paused, and the support table and limitations are public. The case study was updated from the live site on 14 Aug 2026 and its claims are now true. The card image is a screenshot of the current home page rather than a local render.

## On checking it

I compiled the stylesheet locally and rendered every page at 1440px and 390px, in light and dark, which is how the two problems above turned up. `assets/tailwind.css` is byte-identical to the stylesheet those screenshots were taken with, so if you switch to the build you get what I saw. The one thing I couldn't check is the real images, since this folder doesn't include `images/` — the screenshots used placeholders at the right aspect ratios.

## Things that still need you

- **The GitHub links.** Both Part 01 pages point at `https://github.com/olivertw12` as a placeholder. The repo itself is built and its tests pass — it came over separately as `logo-eval-rubric`. Create the repo, push it, then update `links[].href` in `projects.js` to the real URL. I left the placeholder on your profile rather than a URL that doesn't exist yet.
- **Running the rubric.** Scoring a few public image models against it and writing up the failures would turn that page from an instrument into a result.
- **The resume title.** Same employer and dates with two different job titles depending on which button was clicked is worth deciding on one way or the other.
- **`og:image`.** Case studies with a card image now use it for the preview; the rest still share the one site-wide image.
- **The copy.** I wrote the Part 01 pages and the three section intros from scratch and tried to match how you write elsewhere on the site, but it's your voice, so read them over and change whatever sounds off.

## Still open

- Nothing from the first pass. The viewport issue on `resume.html` and `cover-letter.html` was fixed in the second pass.

## Adding a project later

Add one object to `projectData` in `projects.js`, then put its id in `featured` or `archiveOrder`, then run `npm run build` in `tailwind-build/` so the static page gets written. That's the whole process.

```js
"new-thing": {
  group:  "data",                // product | notes | data | design
  layout: "technical",           // technical | case
  category: "Data Pipeline & Modeling",
  title: "...",
  card: { chip: "Process Notes", blurb: "...", image: null },
  meta: [ { label: "Type", value: "..." }, /* four of these */ ],
  lede: [ { label: "The Problem", text: "..." } ],
  sections: [
    { heading: "...", body: "...",
      code:  { file: "score.js", src: "..." },
      image: { src: "images/x.png", alt: "...", caption: "..." },
      list:  { title: "...", items: ["..."] },
      table: { head: ["..."], rows: [["..."]] },
      note:  "..." }
  ],
  links: [ { label: "Repository", href: "...", icon: "github" } ]
}
```

A section can use any combination of those keys. A section with both `code` and `image` puts them side by side. A section with an empty `heading` continues the one before it without taking a number.
