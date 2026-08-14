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
 *   3. ../sitemap.xml and the redirects for the old /project.html?id=<id>
 *      URLs are regenerated so they can't drift from projects.js.
 *
 * Rerun after changing projects.js, render.js or project.html. If you forget,
 * the symptom is a page whose static HTML is stale — the live site still looks
 * right, because render.js fills anything the build left empty.
 */

const fs   = require('fs');
const path = require('path');
const vm   = require('vm');

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

/* --- 3. sitemap + redirects ---------------------------------------- */

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
for (const f of fs.readdirSync(OUT_DIR)) {
  if (f.endsWith('.html')) fs.unlinkSync(path.join(OUT_DIR, f));
}
for (const id of ids) {
  fs.writeFileSync(path.join(OUT_DIR, id + '.html'), buildProjectPage(template, id));
}
console.log(`projects/ — ${ids.length} page(s) written`);

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), buildSitemap(ids));
fs.writeFileSync(path.join(ROOT, '_redirects'),  buildRedirects(ids));
console.log('sitemap.xml and _redirects regenerated');
