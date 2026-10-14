// Builds the site's pages. Run from the repo root:  node drift-build/build.cjs
// Reads:  ../projects.js (project data), case-copy.cjs (case study text), resume.source.html (the resume:
//         its content, print rules and scripts are kept as they are), home.inc and references.inc (hand-written bodies).
// Writes: the pages at the repo root and in projects/, and drift/drift.js (drift.js plus the swaps in real-look.cjs).
// Pictures are drift/img/*.jpg (1600px, and 800px "-t" thumbnails); drift/img/sizes.json holds the originals' sizes.
// The cover letter is private and is never built here.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const root = path.resolve(__dirname, '..'), base = '', assets = '/drift', SITE = 'https://olivertwilliams.com';
/* the site script: drift.js with the realistic-look swaps applied */
const crypto = require('node:crypto');
let JS = fs.readFileSync(path.join(__dirname, 'drift.js'), 'utf8');
{ const real = require('./real-look.cjs'); for (const [from, to] of real.swaps) { if (JS.split(from).length !== 2) throw new Error('real-look: expected exactly one match for ' + from.slice(0, 60)); JS = JS.replace(from, () => to); } JS += real.append; }
const CSS = fs.readFileSync(path.join(__dirname, 'drift.css'), 'utf8');
fs.mkdirSync(path.join(root, 'drift'), { recursive: true }); fs.writeFileSync(path.join(root, 'drift/drift.js'), JS); fs.writeFileSync(path.join(root, 'drift/drift.css'), CSS);
const VER = crypto.createHash('sha1').update(JS + CSS).digest('hex').slice(0, 8);   /* cache-busting stamp on the two files */
const inc = f => fs.readFileSync(path.join(__dirname, f), 'utf8').replaceAll('/mockups/drift/img/', assets + '/img/').replaceAll('/mockups/drift/', '/');
const sizes = JSON.parse(fs.readFileSync(path.join(root, 'drift/img/sizes.json'), 'utf8'));
const { projectData, archiveOrder } = vm.runInNewContext(fs.readFileSync(path.join(root, 'projects.js'), 'utf8') + ';({projectData,archiveOrder})');
projectData['site-build'].card.image = 'images/thumbs/p-sitebuild.jpg';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const key = src => path.basename(src).replace(/\.\w+$/, '');
const iar = src => { const s = sizes[key(src)]; return s ? s[0] / s[1] : 4 / 3; };
/* the full-size original for the picture viewer; file names on the server are case-sensitive, so match the real file */
const orig = src => { const rel = src.replace(/^\//, ''), dir = path.dirname(rel); if (fs.existsSync(path.join(root, rel))) return '/' + rel;
  const hit = fs.readdirSync(path.join(root, dir)).find(f => f.toLowerCase() === path.basename(rel).toLowerCase()); return '/' + (hit ? path.join(dir, hit) : rel); };
const lines = s => s.split('|').map(l => `<span class="ln">${esc(l)}</span>`).join('');
const EMAIL = 'oliver_tw@icloud.com';

const names = { brushfactory: 'Brushfactory', dmarc: 'DMARC Network|Analysis', 'site-build': 'Personal|Site Build', mainframe: 'Mainframe Studios|First Friday', forged: 'The Forged|Group', relays: 'Drake Relays|2025', 'brushfactory-identity': 'Brushfactory|Identity', dessa: 'Dessa 2026|East Coast Tour', jeremy: 'Songwriting Workshop|& Performance', xmas: 'Christmas in|Excelsior', pyrkia: 'Pyrkia Health', citymap: 'City of Shorewood|Map', cityintern: 'Shorewood|Internship', art: 'Traditional|Artwork', data: 'Save the Data', duolingo: 'Duolingo ×|Rocket League', icymi: 'ICYMI Podcast' };
/* headings that say what each part is about, instead of generic labels */
const stepTitles = {
  mainframe: ['Reference the building, not a photo', 'A typeface drawn from the facade', 'Award at the 52nd Juried Student Exhibition'],
  forged: ['One identity across several divisions', 'An anvil as the shared mark', 'Logos, stationery and merchandise'],
  relays: ['Theme: Racing Through Time', 'Retro-futurist type and neon color', 'Used across campus at the 2025 Relays'],
  'brushfactory-identity': ['Readable at favicon size, light and dark', 'A pen nib with an orange ink stroke', 'Launched with the app in August 2026'],
  dessa: ['First concept: too somber', 'Matching the EP’s pink color grade', 'Approved for the January announcement'],
  jeremy: ['Two events, one related pair of flyers', 'A scrapbook collage, cats included', 'Used on social media and ticketing'],
  xmas: ['Wayfinding for a new event layout', 'Routes, vendor zones and landmarks', 'Printed in the event pamphlet'],
  pyrkia: ['Care and unity without medical clichés', 'A human figure inside a circle', 'One symbol for the whole brand'],
  citymap: ['A map children can play on', 'Roads wide enough for toy cars', 'A finished rug prototype'],
  cityintern: ['Inconsistent, hard-to-use city forms', 'Fillable PDFs on the city brand kit', 'A consistent set of digital forms'],
  art: ['Committing to every mark', 'Charcoal, pastel and high contrast', 'Practice in composition and balance'],
  data: ['Stand out from other campus events', 'Retro-computing posters in two colorways', 'Promoting the workshop on campus'],
  duolingo: ['Reaching Rocket League players', 'Leading the visual work', 'Campaign deck and video pitch'],
  icymi: ['From streaming thumbnail to campus poster', 'Cover art and a weekly poster template', 'Weekly promotion across campus'],
};
const ledeTitles = { brushfactory: ['Why brushes don’t move between apps', 'How Brushfactory converts them'], dmarc: ['The data problem', 'The pipeline I built'], 'site-build': ['Why I built from scratch', 'How the site is built'] };
const chapterTitles = {
  brushfactory: ['Reverse-engineering undocumented formats', 'Matching how a brush feels', 'Measuring drift between formats', 'Publishing what carries over', 'Next: edge cases and new formats'],
  dmarc: ['Standardizing the visitor logs', 'Mapping repeat-visit density', 'Forecasting monthly visits', 'Demographic shifts, 2018–2024', 'Finding service gaps with Census data'],
  'site-build': ['Leaving website builders behind', 'Compiling Tailwind locally', 'Deploying with GitHub and Cloudflare Pages', 'One data file for every project', 'How the template picks a layout'],
};
const blurbs = { brushfactory: 'A web app for converting brushes between drawing programs.', dmarc: 'An analysis of food pantry access across the DMARC network.', 'site-build': 'How I built this portfolio with reusable project data and static pages.', mainframe: 'A custom typeface and First Friday poster based on the studio’s exterior.', forged: 'Logos, stationery, and merchandise for a consulting firm and its divisions.', relays: 'The official logo and visual theme for the 2025 Drake Relays.', 'brushfactory-identity': 'The logo and wordmark I designed for Brushfactory.', dessa: 'Instagram artwork announcing Dessa’s March 2026 tour.', jeremy: 'Two flyers for Jeremy Messersmith’s February 2026 events.', xmas: 'A printed visitor map for Excelsior’s first Christmas Market.', pyrkia: 'A logo for a nature-focused health program.', citymap: 'A play mat based on Shorewood’s roads and landmarks.', cityintern: 'Fillable PDFs designed during my City of Shorewood internship.', art: 'Charcoal and pastel studies from 2021–2024.', data: 'Posters for a DATA Club ransomware workshop.', duolingo: 'A student campaign concept for the Young Ones competition.', icymi: 'Cover artwork and weekly posters for a podcast I co-hosted.' };

function nav(active) {
  const items = [['archive.html', 'work'], ['index.html#about', 'about'], ['resume.html', 'resume'], ['index.html#contact', 'contact']];
  return `<header class="bar"><a class="me" href="${base}/index.html">oliver t. williams</a><nav aria-label="Main">${items.map(([u, l]) => `<a href="${base}/${u}"${active === l ? ' aria-current="page"' : ''}>${l}</a>`).join('')}</nav></header>`;
}
const footer = `<footer class="foot"><span>© 2026 Oliver T. Williams</span><div class="links"><button id="motion" type="button" aria-pressed="false">Pause motion</button><a href="${base}/archive.html">All work</a><a href="https://www.instagram.com/oliver_williams1212/" target="_blank" rel="me noopener">Instagram</a><a href="https://www.linkedin.com/in/oliver-t-williams/" target="_blank" rel="me noopener">LinkedIn</a><a href="https://github.com/olivertw12" target="_blank" rel="me noopener">GitHub</a></div></footer>`;
const viewer = `<dialog class="viewer" aria-label="Picture viewer"><div class="viewer-bar"><button class="viewer-prev" type="button">Previous</button><button class="viewer-next" type="button">Next</button><span class="viewer-count"></span><button class="viewer-close" type="button">Close</button></div><img alt=""><p class="viewer-caption"></p></dialog>`;
const mailPill = `<button class="copy-mail" type="button" data-copy aria-label="Copy email address ${EMAIL}"><span class="mail">${EMAIL}</span><svg class="copy-ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="8.5" y="8.5" width="11" height="11" rx="2.6"/><path d="M15.5 8.5V6.6A2.1 2.1 0 0 0 13.4 4.5H6.6A2.1 2.1 0 0 0 4.5 6.6v6.8a2.1 2.1 0 0 0 2.1 2.1h1.9"/></svg></button>`;

const DESC = 'Portfolio of Oliver T. Williams. Graphic designer and data analyst, working full time as a remote AI evaluator and building Brushfactory, a web-based brush converter for digital artists.';
function page(file, title, body, { active = '', extra = '', bodyClass = '', bodyAttrs = '', scripts = '', after = '', desc = DESC, index = true } = {}) {
  const url = SITE + '/' + (file === 'index.html' ? '' : file);
  const html = `<!doctype html>
<html lang="en" data-format="styled">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${index ? '' : '<meta name="robots" content="noindex">\n'}<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${SITE}/images/og-image.png">
<meta property="og:url" content="${url}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#062048">
<title>${esc(title)}</title>
<link rel="icon" href="/favicon.ico" sizes="48x48"><link rel="icon" href="/images/favicon/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/images/favicon/apple-touch-icon.png">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@600;800&family=Manrope:wght@400;600;700&display=swap">
${extra}<link rel="stylesheet" href="${assets}/drift.css?v=${VER}">
<script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"}}</script>
</head>
<body class="${bodyClass}" ${bodyAttrs}>
<a class="skip" href="#top">Skip to content</a>
<canvas id="gl" aria-hidden="true"></canvas>
<div id="rail" aria-hidden="true"></div>
<div id="page"><div class="wrap">
${nav(active)}
${body}
${footer}
</div></div>
<div id="toast" role="status"></div>
${after}${scripts}<script type="module" src="${assets}/drift.js?v=${VER}"></script>
</body>
</html>
`;
  const out = path.join(root, file); fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, html); return file;
}

/* a picture on a glass plate. turn: how much it swings as it passes (1 on the homepage, 0 holds still) */
function plate(src, alt, { turn = 0, ar, tag = 'span', attrs = '', thumb = false, eager = false } = {}) {
  const i = iar(src), a = ar || i;
  return `<${tag} data-plate data-ar="${a.toFixed(4)}" data-iar="${i.toFixed(4)}" data-turn="${turn}" style="aspect-ratio:${a.toFixed(4)};--ar:${a.toFixed(4)}" ${attrs}><img src="${assets}/img/${key(src)}${thumb ? '-t' : ''}.jpg" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}></${tag}>`;
}
function figure(src, caption, { lead = false } = {}) {
  const w = (sizes[key(src)] || [1600])[0];
  return `<figure class="figure${lead ? ' lead-figure' : ''}" style="--max:${Math.round(w * 1.6)}px">${plate(src, caption, { turn: lead ? .45 : 0, tag: 'button', eager: lead, attrs: `type="button" data-image="${esc(orig(src))}" data-caption="${esc(caption)}" aria-label="Enlarge: ${esc(caption || 'project image')}"` })}${caption ? `<figcaption>${esc(caption)}</figcaption>` : ''}</figure>`;
}
function tile(id, turn = 0) {
  const p = projectData[id];
  return `<a class="tile" data-group="${p.group}" href="${base}/projects/${id}.html">${plate(p.card.image, '', { turn, ar: 4 / 3, thumb: true })}<h3>${esc(p.card.title || p.title)}</h3><p>${esc(blurbs[id] || p.card.blurb)}</p></a>`;
}
const tidy = t => String(t || '').replace('a powerful and original piece of visual communication that served as a true extension of its physical identity', 'a visual identity rooted in the building itself').replace('The design was highly successful and won', 'The design won');
const hero = (title, lead, kicker = '') => `<section class="page-hero">${kicker ? `<p class="kicker">${esc(kicker)}</p>` : ''}<h1 class="glow cased">${lines(title)}</h1>${lead ? `<p class="lead">${esc(lead)}</p>` : ''}</section>`;
const built = [];

/* ---------- how the work is organised: six collections, read in this order everywhere (index, numbering, previous / next) ---------- */
const collections = [
  { id: 'product', name: 'Product', theme: 'brushfactory', note: 'Brushfactory, the brush converter I design, build and run.', ids: ['brushfactory', 'brushfactory-identity'] },
  { id: 'data', name: 'Data & code', theme: 'data', note: 'Analysis in R, and the code behind this site.', ids: ['dmarc', 'site-build'] },
  { id: 'identity', name: 'Identity', theme: 'design', note: 'Logos and visual systems for organizations and events.', ids: ['forged', 'relays', 'pyrkia', 'icymi'] },
  { id: 'campaigns', name: 'Posters & campaigns', theme: 'design', note: 'Posters, flyers and pitches that announce something.', ids: ['mainframe', 'dessa', 'jeremy', 'data', 'duolingo'] },
  { id: 'maps', name: 'Maps & public work', theme: 'design', note: 'Maps and documents made for local communities.', ids: ['xmas', 'citymap', 'cityintern'] },
  { id: 'studio', name: 'Studio', theme: 'design', note: 'Drawing from life in charcoal and pastel.', ids: ['art'] },
];
const ids = Object.keys(projectData), order = collections.flatMap(c => c.ids);
if (order.length !== ids.length || ids.some(k => !order.includes(k))) throw new Error('every project must sit in exactly one collection');
const collOf = id => collections.find(c => c.ids.includes(id)), numOf = id => String(order.indexOf(id) + 1).padStart(2, '0');
const metaVal = (p, ...labels) => (p.meta.find(m => labels.includes(m.label)) || {}).value || '';
const yearOf = id => ({ brushfactory: '2026', 'site-build': '2026' }[id] || metaVal(projectData[id], 'Year'));
const titleOf = id => projectData[id].card.title || projectData[id].title;
const themeOf = id => collOf(id).theme;
const thumbOf = id => `${assets}/img/${key(projectData[id].card.image)}-t.jpg`;

function head(id, p) {
  const c = collOf(id), facts = p.meta.map(m => `<div><dt>${esc(m.label)}</dt><dd>${esc(m.value)}</dd></div>`).join('');
  return `<section class="cs-head"><div class="cs-title"><h1 class="glow cased">${lines(names[id])}</h1><p class="lead">${esc(blurbs[id])}</p></div><dl class="facts">${facts}</dl></section>`;
}
function pager(id) {
  const i = order.indexOf(id), prev = order[(i + order.length - 1) % order.length], next = order[(i + 1) % order.length];
  const card = (k, dir) => `<a class="pn-card" href="${base}/projects/${k}.html" aria-label="${dir === '←' ? 'Previous' : 'Next'}: ${esc(titleOf(k))}">${plate(projectData[k].card.image, '', { ar: 16 / 10, thumb: true })}<span class="pn-title">${dir === '←' ? '← ' : ''}${esc(titleOf(k))}${dir === '→' ? ' →' : ''}</span></a>`;
  return `<nav class="pn" aria-label="More work">${card(prev, '←')}${card(next, '→')}</nav>`;
}
const closing = `<section class="floor sub"><h2 class="h2">Something in mind?</h2><p>Reach out and let me know how I can help.</p><div class="actions">${mailPill}<a class="pill" href="${base}/archive.html">All work</a></div></section>`;

/* ---------- case studies: one layout for all of them. A glowing title, one line under it, the facts,
   then pictures and paragraphs in turn. Pictures share one left edge; pairs are cropped to the same shape. ---------- */
const copy = require('./case-copy.cjs');
const pfig = (src, cap, ar) => { const i = iar(src), a = ar || i; return `<figure class="pl-fig">${plate(src, cap, { ar: a, tag: 'button', attrs: `type="button" data-image="${esc(orig(src))}" data-caption="${esc(cap)}" aria-label="Enlarge: ${esc(cap || 'project image')}"` })}${cap ? `<figcaption>${esc(cap)}</figcaption>` : ''}</figure>`; };
const ptext = t => `<div class="pl-text"><p>${esc(t)}</p></div>`;
function pics(list) { let out = ''; for (let k = 0; k < list.length;) { const left = list.length - k;
    if (left === 1 || left === 3 && k === 0) { out += pfig(list[k].src, list[k].caption); k += 1; continue; }
    const a = list[k], b = list[k + 1], portrait = iar(a.src) < 1 && iar(b.src) < 1;
    out += `<div class="pl-pair">${pfig(a.src, a.caption, portrait ? 4 / 5 : 16 / 10)}${pfig(b.src, b.caption, portrait ? 4 / 5 : 16 / 10)}</div>`; k += 2; }
  return out; }
function nextCard(id) { const k = order[(order.indexOf(id) + 1) % order.length];
  return `<a class="pl-next" href="${base}/projects/${k}.html"><span class="nx-label">Next project</span><span class="nx-title">${esc(copy[k].title)}</span>${plate(projectData[k].card.image, '', { ar: 16 / 9, thumb: true })}</a>`; }
for (const [id, p] of Object.entries(projectData)) {
  const c = copy[id]; if (!c) throw new Error('no case copy for ' + id);
  const head = `<section class="pl-head"><h1 class="glow cased pl-title">${esc(c.title)}</h1><p class="pl-sub">${esc(c.sub)}</p><dl class="facts-line">${p.meta.map(m => `<div><dt>${esc(m.label)}</dt><dd>${esc(m.value)}</dd></div>`).join('')}</dl></section>`;
  let body = '';
  if (p.layout === 'case') {
    const [s1, s2, s3, s4] = c.story, g = p.gallery;
    body += pfig(p.hero, p.heroCaption || '') + ptext(s1) + ptext(s2);
    if (g.length) body += pfig(g[0].src, g[0].caption);
    body += ptext(s3);
    if (g.length > 1) body += pics(g.slice(1));
    body += ptext(s4);
  } else {
    const leadImage = p.feature?.media?.type === 'image' ? p.feature.media.src : p.card.image;
    body += pfig(leadImage, '') + p.lede.map(l => ptext(l.text)).join('');
    body += p.sections.map((s, n) => `<section class="pl-ch"><h2>${esc(chapterTitles[id]?.[n] || s.heading)}</h2>${s.body ? `<p>${esc(s.body)}</p>` : ''}${s.note ? `<p class="pl-note">${esc(s.note)}</p>` : ''}</section>${s.image ? pfig(s.image.src, s.image.caption || s.image.alt) : ''}${s.code ? `<details class="code pl-code"><summary>Show the code <span>${esc(s.code.file)}</span></summary><pre><code>${esc(s.code.src)}</code></pre></details>` : ''}`).join('');
    if (p.links?.length) body += `<p class="pl-links">${p.links.map(l => `<a href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}&nbsp;↗</a>`).join('')}</p>`;
  }
  built.push(page(`projects/${id}.html`, `${p.title} — Oliver T. Williams`, `<main id="top" data-morph="${themeOf(id)}" class="pl">${head}<article aria-label="${esc(p.title)} case study">${body}</article>${nextCard(id)}${closing}</main>`, { active: 'work', after: viewer, desc: `${copy[id].title}: ${copy[id].sub}. A case study by Oliver T. Williams.` }));
}

/* ---------- the work index: one even grid. Every project gets the same tile (picture, name, one line), grouped by collection ---------- */
{
  const tabs = [['all', 'All'], ['brushfactory', 'Product'], ['data', 'Data'], ['design', 'Design']].map(([v, l]) => `<button class="tab" type="button" data-filter="${v}" aria-pressed="${v === 'all'}">${l}</button>`).join('');
  const tileHtml = id => `<a class="wtile" href="${base}/projects/${id}.html">${plate(projectData[id].card.image, '', { ar: 4 / 3, thumb: true })}<span class="wt-title">${esc(copy[id].title)}</span><span class="wt-sub">${esc(copy[id].sub)}</span></a>`;
  const index = collections.map(c => `<section class="coll" id="${c.id}" data-theme="${c.theme}"><h2 class="coll-name">${esc(c.name)}</h2><div class="tiles">${c.ids.map(tileHtml).join('')}</div></section>`).join('');
  built.push(page('archive.html', 'Work — Oliver T. Williams', `<main id="top" data-morph="" class="wk"><section class="pl-head"><h1 class="glow cased pl-title">Work</h1></section><div class="tabs" role="group" aria-label="Show work by theme">${tabs}</div><div class="index">${index}</div>${closing}</main>`, { active: 'work' }));
}

/* ---------- documents: content, print rules and scripts come straight from the originals ---------- */
const route = s => s === '/' ? base + '/index.html' : s.startsWith('/#') ? base + '/index.html' + s.slice(1) : /^\/(projects\/[^?#]+\.html|[^/]+\.html)([?#]|$)/.test(s) ? base + s : s;
const relink = s => s.replace(/href="([^"]+)"/g, (_, url) => `href="${route(url.replace(/^https:\/\/(?:www\.)?olivertwilliams\.com(?=\/|$)/, '') || '/')}"`);
/* the cover letter is private (addressed to one employer) and is never built into this site */
for (const file of ['resume.html']) {
  const original = fs.readFileSync(path.join(__dirname, 'resume.source.html'), 'utf8');
  const fonts = (original.match(/<link href="https:\/\/fonts.googleapis.com[^>]+>/) || [])[0] || '';
  const inline = [...original.matchAll(/<style[\s\S]*?<\/style>/g)].map(m => m[0]).join('');
  const main = original.match(/<main[\s\S]*?<\/main>/)[0].replace('<main id="main"', '<div id="document-content"').replace(/<\/main>$/, '</div>').replace(/relocating Oct 2026/g, 'relocating Dec 2026');
  const scripts = [...original.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).filter(s => /function (setPageMargin|setMode)/.test(s)).map(s => `<script>${s}</script>`).join('');
  const resume = file.startsWith('resume'), av = file === 'resume-av.html';
  const seg = (legend, name, opts) => `<fieldset class="switch"><legend>${legend}</legend><div class="segments">${opts.map(([v, l], i) => `<label><input type="radio" name="${name}" value="${v}"${i ? '' : ' checked'}><span>${l}</span></label>`).join('')}</div></fieldset>`;
  const controls = resume
    ? `<div class="doc-controls">${av ? '' : seg('Focus', 'resume-focus', [['design', 'Design'], ['data', 'Data']])}${seg('PDF format', 'resume-format', [['styled', 'Styled'], ['ats', 'ATS-friendly']])}<button class="pill solid" type="button" data-resume-save>Save PDF</button></div>`
    : `<div class="doc-controls"><button class="pill solid" type="button" data-print>Save PDF</button></div>`;
  const panel = `<aside class="doc-panel" data-stick="104"><h1 class="glow cased">${resume ? '<span class="ln">Resume</span>' : '<span class="ln">Cover</span><span class="ln">Letter</span>'}</h1>${controls}<ul class="doc-links"><li><a href="mailto:${EMAIL}">${EMAIL}</a></li><li><a href="https://www.linkedin.com/in/oliver-t-williams/" target="_blank" rel="noopener">LinkedIn ↗</a></li></ul></aside>`;
  built.push(page(file, resume ? 'Resume — Oliver T. Williams' : 'Cover letter — Oliver T. Williams', `<main id="top"><div class="doc-layout">${panel}<div class="sheet-frame">${relink(main)}</div></div><section class="floor sub"><h2 class="h2">Let’s talk</h2><p>Reach out and let me know how I can help.</p><div class="actions">${mailPill}</div></section></main>`, {
    active: 'resume', bodyClass: 'doc', bodyAttrs: `data-mode="${av ? 'av' : 'design'}" data-document="true"`, scripts,
    extra: `${fonts}<link rel="stylesheet" href="/assets/tailwind.css"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">${inline}\n`,
  }));
}

/* ---------- home, sources, and the two signpost pages ---------- */
/* the way into the work index: a slow strip of every project's picture above the link */
{ const thumbs = order.map(id => `<img src="${thumbOf(id)}" alt="" loading="lazy">`).join('');
  const allWork = `<a class="all-work" href="${base}/archive.html"><span class="aw-strip" aria-hidden="true"><span class="aw-track">${thumbs}${thumbs}</span></span><span class="aw-label">See all projects <span aria-hidden="true">→</span></span></a>`;
  built.push(page('index.html', 'Oliver T. Williams — Design, Data & AI Evaluation', inc('home.inc').replace('{{all-work}}', allWork))); }
built.push(page('references.html', 'Sources — Oliver T. Williams', `<main id="top">${hero('Sources', 'References, typefaces and credits.')}<div class="colophon">${inc('references.inc')}</div><section class="floor sub"><div class="actions"><a class="pill" href="${base}/index.html">Back home</a><a class="pill" href="${base}/archive.html">See the work</a></div></section></main>`));
built.push(page('404.html', 'Page not found — Oliver T. Williams', `<main id="top">${hero('Page not found', 'This page doesn’t exist.')}<div class="actions gapless"><a class="pill solid" href="${base}/index.html">Back home</a><a class="pill" href="${base}/archive.html">Explore the work</a></div><section class="floor sub"></section></main>`, { index: false }));
built.push(page('project.html', 'Find a project — Oliver T. Williams', `<main id="top">${hero('Find a project', '')}<div class="actions gapless"><a class="pill solid" href="${base}/archive.html">View all work</a></div><section class="floor sub"></section></main>`, { index: false, scripts: `<script>const id=new URLSearchParams(location.search).get('id');const ids=${JSON.stringify(ids)};if(ids.includes(id))location.replace('${base}/projects/'+encodeURIComponent(id)+'.html');</script>` }));
/* the sitemap follows the pages */
fs.writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generated by drift-build/build.cjs. -->\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${['', 'archive.html', 'resume.html', ...order.map(k => 'projects/' + k + '.html'), 'references.html'].map(u => `  <url><loc>${SITE}/${u}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log(`Built ${built.length} pages.`);
