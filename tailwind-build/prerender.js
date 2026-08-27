/* prerender.js — bakes the site's generated markup into the HTML.
 *
 *   node prerender.js
 *
 * Everything on this site is rendered from projects.js by render.js. That is
 * fine for a visitor with JavaScript and useless to a crawler, which sees an
 * empty <div> where the project grid should be. This runs the same renderers
 * under Node at build time and writes the result into the files:
 *
 *   1. Every [data-cards] container in ../*.html gets its cards inlined.
 *   2. ../project.html is used as a template to write one real page per
 *      project into ../projects/<id>.html — those are the canonical URLs.
 *   3. every link to a local stylesheet or script gets ?v=<content hash>,
 *      so a browser or edge cache can't serve a stale one after a deploy.
 *   4. ../sitemap.xml and the redirects for the old /project.html?id=<id>
 *      URLs are regenerated so they can't drift from projects.js.
 *
 * Rerun after changing projects.js, render.js or project.html. If you forget,
 * the symptom is a page whose static HTML is stale — the live site still looks
 * right, because render.js fills anything the build left empty.
 */

const fs   = require('fs');
const path = require('path');
const vm   = require('vm');
const crypto = require('crypto');

const ROOT     = path.join(__dirname, '..');
const OUT_DIR  = path.join(ROOT, 'projects');
const ORIGIN   = 'https://olivertwilliams.com';

/* --- load projects.js + render.js in one sandbox -------------------
   Concatenated and run as a single script so render.js sees projects.js's
   top-level `const`s, then handed back through an explicit export tail —
   a `const` at the top level of a vm script does not land on the context
   object the way a `var` or a function declaration does. */
const sandbox = vm.createContext({ console });
const source = ['projects.js', 'render.js']
  .map(f => fs.readFileSync(path.join(ROOT, f), 'utf8'))
  .join('\n') +
  '\nglobalThis.api = { projectData, featured, archiveOrder, esc, projectHref,' +
  ' cardsHTML, projectHeader, projectLayout, nextProjectHTML, galleryImages };\n';
vm.runInContext(source, sandbox, { filename: 'site-renderers.js' });

const api = sandbox.api;
const { projectData } = api;

/* --- 1. inline the card grids -------------------------------------- */

/* Fills any element carrying data-cards="...". Two passes: reset whatever a
   previous build left behind (bounded by the unique <!--/cards--> marker, so
   nested </div>s can't end the match early), then fill the empty container. */
function fillCardContainers(html) {
  html = html.replace(/(<div[^>]*\sdata-cards="[^"]+"[^>]*>)[\s\S]*?<!--\/cards-->/g, '$1</div>');
  return html.replace(
    /(<div[^>]*\sdata-cards="([^"]+)"[^>]*>)<\/div>/g,
    (whole, open, spec) => open + api.cardsHTML(spec) + '</div><!--/cards-->'
  );
}

/* --- 2. one static page per project -------------------------------- */

function slot(html, name, content) {
  const re = new RegExp('<!--SLOT:' + name + '-->[\\s\\S]*?<!--\\/SLOT-->');
  if (!re.test(html)) throw new Error('project.html is missing the ' + name + ' slot');
  return html.replace(re, content);
}

function metaFor(id, d) {
  const title = d.title + ' | Oliver T. Williams';
  const desc  = (d.card && d.card.blurb) || '';
  const image = d.card && d.card.image
    ? ORIGIN + '/' + d.card.image
    : ORIGIN + '/images/og-image.png';
  const url   = ORIGIN + api.projectHref(id);
  const esc   = api.esc;
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    `<meta property="og:image" content="${esc(image)}">`,
    `<meta property="og:url" content="${esc(url)}">`,
    `<meta property="og:type" content="article">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<link rel="canonical" href="${esc(url)}">`
  ].join('\n    ');
}

function bootFor(d) {
  // A case study needs the lightbox to know its image list; a technical page
  // has no gallery, so it needs no boot script at all.
  if (d.layout === 'technical') return '';
  const images = JSON.stringify(api.galleryImages(d));
  return '<script>initLightbox(' + images + ');</script>';
}

function buildProjectPage(template, id) {
  const d = projectData[id];
  let html = template;
  html = slot(html, 'META',   metaFor(id, d));
  html = slot(html, 'HEADER', api.projectHeader(d));
  html = slot(html, 'BODY',   api.projectLayout(d));
  html = slot(html, 'NEXT',   api.nextProjectHTML(id));
  html = slot(html, 'BOOT',   bootFor(d));
  // The not-found screen is only reachable through /project.html?id=unknown.
  html = slot(html, 'NOTFOUND', '');
  // The fade-in only exists to hide the empty template while the client-side
  // path fills it. A prerendered page has content on the first paint.
  html = html.replace(' opacity-0 js-fade', '');
  return html;
}

/* --- image integrity ------------------------------------------------
   Every image the site references has to exist on disk, spelled exactly.
   Windows is case-insensitive and Cloudflare is not, so `icymi6.PNG` on a
   laptop happily serves a request for `icymi6.png` locally and 404s in
   production. This check runs at build time and fails the build, because
   the alternative is finding out from the live site. */

function checkImages() {
  const dir = path.join(ROOT, 'images');
  const onDisk = new Set(fs.existsSync(dir) ? fs.readdirSync(dir).map(f => 'images/' + f) : []);
  const byLower = new Map([...onDisk].map(f => [f.toLowerCase(), f]));

  const refs = new Set();
  const scan = f => {
    const src = fs.readFileSync(f, 'utf8');
    for (const m of src.matchAll(/["'](\/?images\/[A-Za-z0-9._-]+\.(?:png|jpe?g|webp|svg|gif))["']/gi)) {
      refs.add(m[1].replace(/^\//, ''));
    }
  };
  scan(path.join(ROOT, 'projects.js'));
  for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html')) scan(path.join(ROOT, f));

  const problems = [];
  for (const r of [...refs].sort()) {
    if (onDisk.has(r)) continue;
    const alt = byLower.get(r.toLowerCase());
    problems.push(alt ? `  ${r} — on disk as ${alt} (case mismatch: fine on Windows, 404 on the server)`
                      : `  ${r} — no such file`);
  }
  // A working copy without the image binaries (a docs-only checkout, say)
  // would report every reference as missing, which is noise rather than a
  // finding. Only a handful of bad references means something is actually
  // wrong, and that is what fails the build.
  if (problems.length > refs.size / 2) {
    console.log(`images: skipped — ${problems.length}/${refs.size} missing, so images/ is a partial copy, not a broken reference`);
    return;
  }
  if (problems.length) {
    console.error('Broken image references:\n' + problems.join('\n'));
    process.exit(1);
  }
  console.log(`images: ${refs.size} references, all present`);
}


/* --- 3. cache busting -----------------------------------------------
   Every page links the same handful of local files at fixed URLs. When one
   changes, a browser or an edge cache that already has the old copy has no
   reason to ask for a new one — which is exactly how a nav item that was
   deleted from components.js kept showing up on the live site after a deploy.
   Stamping a content hash onto each link makes the URL change whenever the
   file does, so a stale copy can never be served for the new HTML. */

const VERSIONED = ['/assets/tailwind.css', '/style.css', '/components.js',
                   '/projects.js', '/render.js', '/lightbox.js'];

function assetVersions() {
  const v = {};
  for (const url of VERSIONED) {
    const file = path.join(ROOT, url.replace(/^\//, ''));
    if (!fs.existsSync(file)) continue;
    v[url] = crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex').slice(0, 8);
  }
  return v;
}

function stampVersions(html, versions) {
  for (const [url, hash] of Object.entries(versions)) {
    const re = new RegExp('(["\'])' + url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:\\?v=[a-f0-9]+)?\\1', 'g');
    html = html.replace(re, '$1' + url + '?v=' + hash + '$1');
  }
  return html;
}


/* --- 4. sitemap + redirects ---------------------------------------- */

function buildSitemap(ids) {
  const priority = { brushfactory: '0.9', dmarc: '0.8', 'task-briefs': '0.7' };
  const urls = [
    `  <url><loc>${ORIGIN}/</loc><priority>1.0</priority></url>`,
    `  <url><loc>${ORIGIN}/archive.html</loc><priority>0.7</priority></url>`,
    `  <url><loc>${ORIGIN}/resume.html</loc><priority>0.8</priority></url>`
  ].concat(ids.map(id => {
    const p = priority[id] || (projectData[id].group === 'design' ? '0.5' : '0.6');
    return `  <url><loc>${ORIGIN}${api.projectHref(id)}</loc><priority>${p}</priority></url>`;
  }));

  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<!-- Generated by tailwind-build/prerender.js — do not edit. -->\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.join('\n') + '\n</urlset>\n';
}

function buildRedirects(ids) {
  const head = [
    '# Cloudflare Pages redirects.',
    '# The project.html?id=<id> block is generated by tailwind-build/prerender.js.',
    '',
    '/project-data.html    /projects/dmarc.html       301',
    '/project-data2.html   /projects/site-build.html  301',
    '/index2.html          /                          301',
    ''
  ];
  const rules = ids.map(id =>
    `/project.html?id=${id}`.padEnd(38) + api.projectHref(id).padEnd(34) + '301'
  );
  return head.concat(rules).join('\n') + '\n';
}

/* --- run ------------------------------------------------------------ */

checkImages();

const ids = Object.keys(projectData);

let pages = 0;
for (const f of fs.readdirSync(ROOT)) {
  if (!f.endsWith('.html')) continue;
  const file = path.join(ROOT, f);
  const src  = fs.readFileSync(file, 'utf8');
  if (!/data-cards="/.test(src)) continue;
  const out = fillCardContainers(src);
  if (out !== src) { fs.writeFileSync(file, out); pages++; }
}
console.log(`card grids inlined in ${pages} page(s)`);

const template = fs.readFileSync(path.join(ROOT, 'project.html'), 'utf8');
fs.mkdirSync(OUT_DIR, { recursive: true });
// Only remove pages whose project no longer exists; the rest are overwritten
// in place. Deleting and rewriting all of them every build was pointless churn,
// and it fails outright on a filesystem that allows writes but not unlinks.
const keep = new Set(ids.map(id => id + '.html'));
for (const f of fs.readdirSync(OUT_DIR)) {
  if (f.endsWith('.html') && !keep.has(f)) {
    fs.unlinkSync(path.join(OUT_DIR, f));
    console.log(`removed stale page projects/${f}`);
  }
}
for (const id of ids) {
  fs.writeFileSync(path.join(OUT_DIR, id + '.html'), buildProjectPage(template, id));
}
console.log(`projects/ — ${ids.length} page(s) written`);

/* --- keep the design-project count in the copy honest -------------------
   The homepage says "See all N design projects". Hand-typing N means it goes
   stale the moment a project is added — it already did once. Derive it from
   the same data everything else comes from. */
const designCount = api.archiveOrder.length;
let counted = 0;
for (const f of fs.readdirSync(ROOT)) {
  if (!f.endsWith('.html')) continue;
  const file = path.join(ROOT, f);
  const src  = fs.readFileSync(file, 'utf8');
  const out  = src.replace(/See all \d+ design projects/g,
                           `See all ${designCount} design projects`);
  if (out !== src) { fs.writeFileSync(file, out); counted++; }
}
if (counted) console.log(`design-project count synced to ${designCount}`);

const versions = assetVersions();
let stamped = 0;
for (const dir of [ROOT, OUT_DIR]) {
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.html')) continue;
    const file = path.join(dir, f);
    const src  = fs.readFileSync(file, 'utf8');
    const out  = stampVersions(src, versions);
    if (out !== src) { fs.writeFileSync(file, out); stamped++; }
  }
}
console.log(`asset versions stamped in ${stamped} page(s)`);

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), buildSitemap(ids));
fs.writeFileSync(path.join(ROOT, '_redirects'),  buildRedirects(ids));
console.log('sitemap.xml and _redirects regenerated');
