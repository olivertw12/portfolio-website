// Builds the site's pages in the hand-drawn design. Run from the repo root:  node sketch-build/build.cjs
// Reads:  ../projects.js (project data), ../drift-build/case-copy.cjs (case study text), ../drift-build/resume.source.html
//         (the resume: content, print rules and scripts kept as they are), content.cjs (headings and groupings), art.cjs (drawings).
// Writes: the pages at the repo root and in projects/, sketch/sketch.css, sketch/sketch.js and sitemap.xml.
// Pictures come from drift/img/ (1600px, and 800px "-t" thumbnails). The cover letter is private and is never built.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), crypto = require('node:crypto');
const root = path.resolve(__dirname, '..'), A = '/sketch', SITE = 'https://olivertwilliams.com', EMAIL = 'olivertwilliams2016@gmail.com';
const CSS = fs.readFileSync(path.join(__dirname, 'sketch.css'), 'utf8'), JS = fs.readFileSync(path.join(__dirname, 'sketch.js'), 'utf8');
fs.mkdirSync(path.join(root, 'sketch'), { recursive: true });
fs.writeFileSync(path.join(root, 'sketch/sketch.css'), CSS); fs.writeFileSync(path.join(root, 'sketch/sketch.js'), JS);
const VER = crypto.createHash('sha1').update(CSS + JS).digest('hex').slice(0, 8);

const art = require('./art.cjs'), { stepTitles, chapterTitles, collections, longLede, stats } = require('./content.cjs');
const copy = require('../drift-build/case-copy.cjs');
const sizes = JSON.parse(fs.readFileSync(path.join(root, 'drift/img/sizes.json'), 'utf8'));
const { projectData } = vm.runInNewContext(fs.readFileSync(path.join(root, 'projects.js'), 'utf8') + ';({projectData})');
projectData['site-build'].card.image = 'images/thumbs/p-sitebuild.jpg';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const key = src => path.basename(src).replace(/\.\w+$/, '');
const draw = (name, cls = '') => art[name].replace('{cls}', cls);
const ids = Object.keys(projectData), order = collections.flatMap(c => c.ids);
if (order.length !== ids.length || ids.some(k => !order.includes(k))) throw new Error('every project must sit in exactly one collection');
const collOf = id => collections.find(c => c.ids.includes(id));
const nextOf = id => order[(order.indexOf(id) + 1) % order.length];

/* a picture from drift/img, sized so the page does not jump while it loads */
const zoomLink = (markup, src, caption) => `<a class="image-zoom" href="${esc(src)}" data-gallery-image data-caption="${esc(caption)}" aria-label="${esc('View full size: ' + (caption || 'Project image'))}">${markup}</a>`;
function img(src, alt, { thumb = false, cls = 'stk', eager = false, zoom = false } = {}) {
  const k = key(src), s = sizes[k] || [1600, 1200], w = thumb ? 800 : Math.min(1600, s[0]), h = Math.round(w * s[1] / s[0]);
  const markup = `<img class="${cls}" src="/drift/img/${k}${thumb ? '-t' : ''}.jpg" width="${w}" height="${h}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`;
  const full = fs.existsSync(path.join(root, src)) ? '/' + src : `/drift/img/${k}.jpg`;
  return zoom ? zoomLink(markup, full, alt) : markup;
}

/* the anchor from my logo: Lucide's anchor, outlined and thickened; used everywhere the mark appears */
const LOGO_D = 'M13.3 6.95 C16.8 5.5 16 0.7 12 .7 C8 .7 7.2 5.5 10.7 6.95 L10.7 9.7 L9 9.7 C7.3 9.7 7.3 12.3 9 12.3 L10.7 12.3 L10.7 19.65 C7.3 19.2 5.1 16.8 4.5 14 C6.2 15 7.2 12.8 5.5 11.9 L3.7 10.9 C2.7 10.3 1.6 11 1.7 12.1 C2.1 17.8 6.1 21.8 10.7 22.2 C10.8 23.7 13.2 23.7 13.3 22.2 C17.9 21.8 21.9 17.8 22.3 12.1 C22.4 11 21.3 10.3 20.3 10.9 L18.5 11.9 C16.8 12.8 17.8 15 19.5 14 C18.9 16.8 16.7 19.2 13.3 19.65 L13.3 12.3 L15 12.3 C16.7 12.3 16.7 9.7 15 9.7 L13.3 9.7 L13.3 6.95 Z M13.6 4 A1.6 1.6 0 1 0 10.4 4 A1.6 1.6 0 1 0 13.6 4 Z';
/* the mark in the header is the favicon: the anchor tipped onto its arm, resting on sand */
const ANCHOR = '<svg viewBox="0 0 64 64" aria-hidden="true"><defs><clipPath id="mk-c"><path d="M0 0H64V60.5C52 50 40 47.5 32 47.5S12 50 0 60.5Z"/></clipPath></defs><g clip-path="url(#mk-c)"><g transform="translate(33 27.5) rotate(-22) scale(2.25) translate(-12 -12.2)"><path fill="#4f78b8" stroke="#4f78b8" stroke-width="0.4" stroke-linejoin="round" fill-rule="evenodd" d="M13.3 6.95 C16.8 5.5 16 0.7 12 .7 C8 .7 7.2 5.5 10.7 6.95 L10.7 9.7 L9 9.7 C7.3 9.7 7.3 12.3 9 12.3 L10.7 12.3 L10.7 19.65 C7.3 19.2 5.1 16.8 4.5 14 C6.2 15 7.2 12.8 5.5 11.9 L3.7 10.9 C2.7 10.3 1.6 11 1.7 12.1 C2.1 17.8 6.1 21.8 10.7 22.2 C10.8 23.7 13.2 23.7 13.3 22.2 C17.9 21.8 21.9 17.8 22.3 12.1 C22.4 11 21.3 10.3 20.3 10.9 L18.5 11.9 C16.8 12.8 17.8 15 19.5 14 C18.9 16.8 16.7 19.2 13.3 19.65 L13.3 12.3 L15 12.3 C16.7 12.3 16.7 9.7 15 9.7 L13.3 9.7 L13.3 6.95 Z M13.6 4 A1.5999999999999999 1.5999999999999999 0 1 0 10.4 4 A1.5999999999999999 1.5999999999999999 0 1 0 13.6 4 Z"/></g></g><path fill="#ead9bb" d="M3 61C14 50.5 23 47.5 32 47.5S50 50.5 61 61Q61 63 58 63H6Q3 63 3 61Z"/><path fill="#d8c197" d="M38 49C47 51 54 55 61 61Q61 63 58 63H44C45 57 43 52 38 49Z"/><path fill="#ffffff" opacity=".55" d="M12 54C19 49.6 25 48.4 32 48.4S44 49.6 51 53.4C44 50.6 38 49.6 32 49.6S20 50.6 12 54Z"/></svg>';
const COPY_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8.5" y="8.5" width="11" height="11" rx="2.6"/><path d="M15.5 8.5V6.6A2.1 2.1 0 0 0 13.4 4.5H6.6A2.1 2.1 0 0 0 4.5 6.6v6.8a2.1 2.1 0 0 0 2.1 2.1h1.9"/></svg>';
const CODE_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="8,7 3,12 8,17"/><polyline points="16,7 21,12 16,17"/></svg>';
const mail = (cls = 'copy-mail') => `<button class="${cls}" type="button" data-copy="${EMAIL}" aria-label="Copy email address ${EMAIL}"><span class="mail">${EMAIL}</span>${COPY_ICON}</button>`;

/* a soft blue section with wavy top and bottom edges */
const band = inner => `<div class="band"><div class="band-bg" aria-hidden="true"><div class="dots"></div><svg class="top" viewBox="0 0 1440 90" preserveAspectRatio="none"><path d="M0 0 H1440 V34 C 1270 78 1080 20 880 44 C 660 70 470 8 250 30 C 150 40 70 56 0 46 Z" fill="#f5f3ee"/></svg><svg class="bottom" viewBox="0 0 1440 90" preserveAspectRatio="none"><path d="M0 90 H1440 V50 C 1300 20 1120 72 900 52 C 690 32 520 80 300 60 C 180 49 80 30 0 40 Z" fill="#f5f3ee"/></svg></div><div class="inner">${inner}</div></div>`;

function nav(active) {
  const items = [['archive.html', 'Work'], ['index.html#about', 'About'], ['resume.html', 'Resume'], ['index.html#contact', 'Contact']];
  return `<header class="bar"><a class="me" href="/index.html">${ANCHOR}<span>Oliver T. Williams</span></a><nav aria-label="Main">${items.map(([u, l]) => `<a href="/${u}"${active === l ? ' aria-current="page"' : ''}>${l}</a>`).join('')}</nav></header>`;
}
const footer = `<footer class="foot"><span><strong>Oliver T. Williams</strong>, design, data and AI evaluation</span><span class="links"><button class="pause" type="button" aria-pressed="false" data-pause>Pause motion</button><a href="/archive.html">All work</a><a href="/references.html">Sources</a><a href="https://www.linkedin.com/in/oliver-t-williams/" rel="noopener">LinkedIn</a><a href="https://www.instagram.com/oliver_williams1212/" rel="noopener">Instagram</a><a href="https://github.com/olivertw12" rel="noopener">GitHub</a></span></footer>`;

const DESC = 'Portfolio of Oliver T. Williams. Graphic designer and data analyst, working full time as a remote AI evaluator and building Brushfactory, a web-based brush converter for digital artists.';
const built = [];
function page(file, title, body, { active = '', extra = '', bodyAttrs = '', scripts = '', desc = DESC, index = true } = {}) {
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
<meta property="og:image" content="${SITE}/images/og-sketch.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Oliver T. Williams — design, data and AI evaluation, with a blue anchor on sand.">
<meta property="og:url" content="${url}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#f5f3ee">
<title>${esc(title)}</title>
<link rel="icon" href="/favicon.ico" sizes="48x48"><link rel="icon" href="/images/favicon/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/images/favicon/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@700;800;900&family=Red+Hat+Mono:wght@400&family=Manrope:wght@400;500;600;700&display=swap">
${extra}<link rel="stylesheet" href="${A}/sketch.css?v=${VER}">
</head>
<body ${bodyAttrs}>
<a class="skip" href="#top">Skip to content</a>
<svg width="0" height="0" aria-hidden="true" style="position:absolute"><defs><pattern id="ht" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="4.5" cy="4.5" r="1.9" fill="#1a2547"/></pattern></defs></svg>
<div class="wrap">
${nav(active)}
${body}
${footer}
</div>
${scripts}<script src="${A}/sketch.js?v=${VER}" defer></script>
</body>
</html>
`;
  const out = path.join(root, file); fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, html); built.push(file);
}

const tile = id => `<a class="tile stk" href="/projects/${id}.html">${img(projectData[id].card.image, '', { thumb: true, cls: '' })}<h3>${esc(copy[id].title)}</h3><p>${esc(copy[id].sub)}</p></a>`;
const nextCard = id => { const k = nextOf(id);
  return `<a class="next-card stk-card" href="/projects/${k}.html">${img(projectData[k].card.image, '', { thumb: true, cls: '' })}<div><h2>Next case study: ${esc(copy[k].title)}</h2><p>${esc(copy[k].sub)}</p></div></a>`; };
const facts = p => `<dl class="facts stk-card">${p.meta.map(m => `<div><dt>${esc(m.label)}</dt><dd>${esc(m.value)}</dd></div>`).join('')}</dl>`;
const heroArt = { product: 'tablet_hero', data: 'map_hero', identity: 'type_card', campaigns: 'prints', maps: 'map_hero', studio: 'prints' };
const longArt = { brushfactory: 'tablet_hero', dmarc: 'map_hero', 'site-build': 'prints' };
const pageHero = (title, lede, artName, back = true) => `<section class="page-hero"><div>${back ? '<a class="back" href="/archive.html">All work</a>' : ''}<h1>${esc(title)}</h1>${lede ? `<p class="lede">${esc(lede)}</p>` : ''}</div>${draw(artName, 'art')}</section>`;

/* ---------- case studies ---------- */
for (const [id, p] of Object.entries(projectData)) {
  const c = copy[id]; if (!c) throw new Error('no case copy for ' + id);
  let body = '';
  if (p.layout === 'case') {
    const [s1, s2, s3, s4] = c.story, g = p.gallery || [], t = stepTitles[id];
    body += pageHero(c.title, c.sub, heroArt[collOf(id).id]) + facts(p);
    body += `<figure class="lead-img stk" style="margin:0">${img(p.hero, p.heroCaption || c.title, { eager: true, cls: '', zoom: true })}</figure>`;
    body += `<section class="story first"><p>${esc(s1)}</p></section>`;
    const part = (title, text, pic, flip) => pic
      ? `<section class="row${flip ? ' flip' : ''}"><div class="pic">${img(pic.src, pic.caption || '', { zoom: true })}</div><div><h2 class="h3">${esc(title)}</h2><p>${esc(text)}</p></div></section>`
      : `<section class="story" style="padding:0"><h2 class="h3">${esc(title)}</h2><p>${esc(text)}</p></section>`;
    const mid = part(t[0], s2, g[0], false) + `<div style="height:clamp(56px,7vw,96px)"></div>` + part(t[1], s3, g[1], true);
    body += g.length ? band(mid) : `<div style="padding-bottom:clamp(56px,7vw,96px)">${mid}</div>`;
    body += `<section class="story" style="padding-top:${g.length ? '0' : 'clamp(56px,7vw,96px)'}"><h2 class="h3">${esc(t[2])}</h2><p>${esc(s4)}</p></section>`;
    const rest = g.slice(2);
    if (rest.length) body += `<div class="pics${rest.length === 1 ? ' one' : ''}">${rest.map(x => img(x.src, x.caption || '', { zoom: true })).join('')}</div>`;
  } else {
    const lead = p.feature?.media?.type === 'image' ? p.feature.media.src : p.card.image;
    body += pageHero(c.title, longLede[id] || c.sub, longArt[id]) + facts(p);
    if (stats[id]) body += `<section class="stats" aria-label="Key figures">${stats[id].map(([n, l]) => `<div class="stat stk-card"><p class="n">${esc(n)}</p><p class="l">${esc(l)}</p></div>`).join('')}</section>`;
    body += `<section class="story first" style="padding-top:0">${p.lede.map(l => `<p style="margin-bottom:18px">${esc(l.text)}</p>`).join('')}</section>`;
    if (!p.sections.some(s => s.image && key(s.image.src) === key(lead))) body += `<figure class="lead-img stk" style="margin:0 0 clamp(72px,8vw,112px)">${img(lead, p.feature?.media?.alt || c.title, { cls: '', zoom: true })}</figure>`;
    const chapter = (s, n) => {
      const title = chapterTitles[id]?.[n] || s.heading;
      let fig = '';
      if (id === 'dmarc' && n === 3) {
        const chart = draw('dmarc_demographics'), caption = "Hispanic families' share of all DMARC visits, 2018 and 2024.";
        const standalone = chart.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ').replace(/(<svg[^>]*>)/, '$1<rect width="900" height="360" fill="#f5f3ee"/>');
        fs.writeFileSync(path.join(root, 'sketch/dmarc-demographics.svg'), standalone);
        fig = `<figure class="chart stk-card">${zoomLink(chart, '/sketch/dmarc-demographics.svg', caption)}<figcaption>${esc(caption)}</figcaption></figure>`;
      }
      else if (s.image) fig = `<figure class="fig">${img(s.image.src, s.image.alt || s.image.caption || '', { zoom: true })}${s.image.caption ? `<figcaption>${esc(s.image.caption)}</figcaption>` : ''}</figure>`;
      const code = s.code ? `<details class="code"><summary>${CODE_ICON}Show the code: ${esc(s.code.file)}</summary><pre><code>${esc(s.code.src)}</code></pre></details>` : '';
      return `<section class="chapter"><div class="copy"><h2 class="h3">${esc(title)}</h2>${s.body ? `<p>${esc(s.body)}</p>` : ''}${s.note ? `<p class="note">${esc(s.note)}</p>` : ''}${fig ? '' : code}</div>${fig}${fig && code ? `<div class="copy" style="margin-top:24px">${code}</div>` : ''}</section>`;
    };
    const ch = p.sections.map(chapter);
    body += ch.length >= 3 ? ch[0] + band(ch.slice(1, 3).join('')) + ch.slice(3).join('') : ch.join('');
    if (p.links?.length) body += `<p class="ext-links">${p.links.map(l => `<a class="text-link" href="${esc(l.href)}" rel="noopener">Visit ${esc(l.label.charAt(0).toLowerCase() === l.label.charAt(0) ? l.label : 'the ' + l.label.toLowerCase())}</a>`).join('')}</p>`;
  }
  body += nextCard(id);
  page(`projects/${id}.html`, `${c.title}, a case study by Oliver T. Williams`, `<main id="top">${body}</main>`, { active: 'Work', desc: `${c.title}: ${c.sub}. A case study by Oliver T. Williams.` });
}

/* ---------- the work index, grouped; every other group sits on the wave band ---------- */
{
  const groups = collections.map((c, n) => { const inner = `<section class="coll" id="${c.id}"${n % 2 ? ' style="padding-bottom:0"' : ''}><h2 class="h3">${esc(c.name)}</h2><p class="intro">${esc(c.note)}</p><div class="tiles">${c.ids.map(tile).join('')}</div></section>`; return n % 2 ? band(inner) : inner; }).join('');
  page('archive.html', 'Work by Oliver T. Williams', `<main id="top">${pageHero('All work', 'Product design, data analysis and brand identity, from client identities and event posters to the analysis and code behind my own projects.', 'prints', false)}${groups}</main>`, { active: 'Work' });
}

/* ---------- home ---------- */
{
  /* a practice card: the drawing sits over a picture of the work; on hover, focus or (on touch screens) scrolling into view,
     a scribbled mask scrubs the drawing away to show the picture underneath */
  let scrubN = 0;
  const scrub = (artName, bg) => { const n = ++scrubN, inner = draw(artName).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    return `<svg class="boil scrubber" viewBox="0 0 360 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><mask id="scrub-${n}" maskUnits="userSpaceOnUse" x="0" y="0" width="360" height="240"><rect width="360" height="240" fill="#fff"/><path class="scrub" pathLength="1" d="M-30 18 L390 -14 L-30 66 L390 34 L-30 114 L390 82 L-30 162 L390 130 L-30 210 L390 178 L-30 258 L390 226" fill="none" stroke="#000" stroke-width="64" stroke-linecap="round" stroke-linejoin="round"/></mask></defs><g mask="url(#scrub-${n})"><rect width="360" height="240" fill="${bg}"/><g transform="translate(36 30) scale(.8)">${inner}</g></g></svg>`; };
  const pcard = (href, bg, artName, pic, picAlt, title, text, go) => `<a class="pcard stk-card" href="${href}"><div class="art">${img(pic, picAlt, { thumb: true, cls: 'peek' })}${scrub(artName, bg)}</div><div class="txt"><h3>${title}</h3><p>${text}</p><span class="go">${go}</span></div></a>`;
  const fact = (icon, dt, dd) => `<div class="fact stk-card">${draw(icon, 'icon')}<dt>${dt}</dt><dd>${dd}</dd></div>`;
  const body = `<main id="top">
<section class="home-hero"><div><h1>I design brand identities and turn data into clear visuals.</h1><p class="lede">I'm Oliver, a graphic designer and data analyst. I evaluate AI model output for design quality, and I design, build and run Brushfactory, a brush converter for digital artists.</p><div class="actions"><a class="btn" href="/resume.html">Resume</a>${mail()}</div></div>${draw('anchor')}</section>
<section class="block"><h2 class="h2">What I work on</h2><p class="intro">My work splits three ways: a product I run, data I analyze, and identities I design for clients.</p><div class="practice">
${pcard('/projects/brushfactory.html', '#dbe7f6', 'tablet_card', 'images/brushfactory-home.jpg', 'The Brushfactory converter', 'Brushfactory', 'A web app that converts brushes between Photoshop, Procreate, Clip Studio Paint and Krita. I design, build and run it, from the conversion code to the brand.', 'Read the case study')}
${pcard('/projects/dmarc.html', '#d3ebe5', 'chart_card', 'images/dmarc1.jpg', 'Map of repeat pantry visits by zip code', 'Data analysis', 'Mapping and forecasting in R, Python and SQL, presented as charts people can read at a glance. Most recently, food pantry access across the Des Moines metro.', 'Read the case study')}
${pcard('/projects/mainframe.html', '#e6e2f3', 'type_card', 'images/mainframe2.png', 'The Mainframe Studios First Friday poster', 'Brand identity', 'Logos, typefaces and visual systems for studios, firms and events, from a custom typeface for Mainframe Studios to the official Drake Relays 2025 theme.', 'Read the case study')}
</div></section>
${band(`<section class="carousel" aria-labelledby="recent-h"><div class="car-head"><div><h2 class="h2" id="recent-h">Recent projects</h2><p class="intro">Identities, posters and campaigns from the last few years.</p></div><div class="car-nav"><button class="car-btn" type="button" data-car="-1" aria-controls="recent-track">Previous</button><button class="car-btn" type="button" data-car="1" aria-controls="recent-track">Next</button></div></div><ul class="track" id="recent-track" tabindex="0" aria-label="Recent projects, scroll sideways for more">${['brushfactory-identity', 'dessa', 'jeremy', 'relays', 'data', 'forged', 'pyrkia', 'citymap'].map(id => `<li>${tile(id)}</li>`).join('')}</ul></section><a class="more" href="/archive.html">See all projects</a>`)}
<section class="block" id="about"><h2 class="h2">About</h2><p class="intro">Graphic designer and data analyst, working full time as a remote AI evaluator and building Brushfactory on the side.</p><dl class="facts4">
${fact('icon_now', 'Now', 'Evaluating AI model output for design quality at Mercor and Handshake AI.')}
${fact('icon_building', 'Building', 'Brushfactory, from the conversion code to the brand.')}
${fact('icon_studied', 'Studied', 'BA Graphic Design and BS Data Analytics, Drake University, 2025.')}
${fact('icon_tools', 'Tools', 'Illustrator, InDesign, Photoshop, R, Python, SQL, Tableau.')}
</dl></section>
<section class="contact" id="contact"><div class="say"><h2>Have a design or data project in mind?</h2><p>Email me with a short description, your timeline and what you need delivered, and we can work out the details from there.</p></div><div class="mailbox">${draw('envelope', 'env')}${mail('btn')}</div></section>
</main>`;
  page('index.html', 'Oliver T. Williams: design, data and AI evaluation', body);
}

/* ---------- resume: content, print rules and scripts come straight from the original ---------- */
{
  const original = fs.readFileSync(path.join(root, 'drift-build/resume.source.html'), 'utf8');
  const fonts = (original.match(/<link href="https:\/\/fonts.googleapis.com[^>]+>/) || [])[0] || '';
  const inline = [...original.matchAll(/<style[\s\S]*?<\/style>/g)].map(m => m[0]).join('');
  const route = s => s === '/' ? '/index.html' : s.startsWith('/#') ? '/index.html' + s.slice(1) : s;
  const relink = s => s.replace(/href="([^"]+)"/g, (_, url) => `href="${route(url.replace(/^https:\/\/(?:www\.)?olivertwilliams\.com(?=\/|$)/, '') || '/')}"`);
  const main = original.match(/<main[\s\S]*?<\/main>/)[0].replace('<main id="main"', '<div id="document-content"').replace(/<\/main>$/, '</div>').replace(/relocating Oct 2026/g, 'relocating Dec 2026');
  const scripts = [...original.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).filter(s => /function (setPageMargin|setMode)/.test(s)).map(s => `<script>${s}</script>`).join('');
  const seg = (legend, name, opts) => `<fieldset class="switch"><legend>${legend}</legend><div class="segments">${opts.map(([v, l], i) => `<label><input type="radio" name="${name}" value="${v}"${i ? '' : ' checked'}><span>${l}</span></label>`).join('')}</div></fieldset>`;
  const panel = `<aside class="doc-panel stk-card">${draw('paper', 'art')}<div class="doc-intro"><h1>Resume</h1><p>Pick the version that fits the role. The styled PDF is one page. The ATS-friendly PDF is two pages, with a plain-text layout for application systems.</p><div class="contact-links">${mail()}<a href="https://www.linkedin.com/in/oliver-t-williams/" rel="noopener">LinkedIn profile</a></div></div><div class="doc-controls">${seg('Focus', 'resume-focus', [['design', 'Design'], ['data', 'Data']])}${seg('PDF format', 'resume-format', [['styled', 'Styled'], ['ats', 'ATS-friendly']])}<button class="btn" type="button" data-resume-save>Save PDF</button></div></aside>`;
  page('resume.html', 'Resume of Oliver T. Williams', `<main id="top"><div class="doc-layout">${panel}<div class="sheet-frame">${relink(main)}</div></div></main>`, {
    active: 'Resume', bodyAttrs: 'class="doc" data-mode="design" data-document="true"', scripts,
    extra: `${fonts}<link rel="stylesheet" href="/assets/tailwind.css"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">${inline}\n`,
  });
}

/* ---------- sources, and the two signpost pages ---------- */
page('references.html', 'Sources for this site', `<main id="top">${pageHero('Sources', 'Where the look comes from, the typefaces, and what the site is made with.', 'paper', false)}<div class="colophon">
<section class="stk-card"><h2>The drawings</h2><p>The illustrations follow my own art style: heavy navy linework, flat shading, halftone dots and a white sticker edge around each piece. The lines are drawn as chains of small beads that shift a little a few times a second, so the drawings feel hand-made and alive. The movement stops if your device is set to reduce motion, or with Pause motion below.</p></section>
<section class="stk-card"><h2>Typefaces</h2><p><a href="https://fonts.google.com/specimen/Red+Hat+Display" rel="noopener">Red Hat Display</a> for headings, <a href="https://fonts.google.com/specimen/Manrope" rel="noopener">Manrope</a> for text and <a href="https://fonts.google.com/specimen/Red+Hat+Mono" rel="noopener">Red Hat Mono</a> for code, all under the SIL Open Font License.</p></section>
<section class="stk-card"><h2>The pictures</h2><p>Every project picture is the real work: the finished pieces, photographed or exported from the files I delivered.</p></section>
<section class="stk-card"><h2>How it's built</h2><p>Plain HTML and CSS generated from one data file of projects, with no framework, deployed from GitHub. The <a href="/projects/site-build.html">Personal Site Build</a> case study explains how.</p></section>
</div></main>`);
page('404.html', 'Page not found', `<main id="top" class="nf"><div><h1>This page isn't here</h1><p>The link may be out of date, or the page moved when the site was rebuilt. Every project is still on the work page.</p><div class="actions"><a class="btn" href="/archive.html">See all work</a><a class="text-link" href="/index.html">Back to the homepage</a></div></div>${draw('bottle', 'art')}</main>`, { index: false });
page('project.html', 'Find a project', `<main id="top" class="nf"><div><h1>Finding that project</h1><p>Old project links send you to the right page here. If nothing happens, the full list is on the work page.</p><div class="actions"><a class="btn" href="/archive.html">See all work</a></div></div>${draw('prints', 'art')}</main>`, { index: false, scripts: `<script>const id=new URLSearchParams(location.search).get('id');const ids=${JSON.stringify(ids)};if(ids.includes(id))location.replace('/projects/'+encodeURIComponent(id)+'.html');</script>` });

fs.writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generated by sketch-build/build.cjs. -->\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${['', 'archive.html', 'resume.html', ...order.map(k => 'projects/' + k + '.html'), 'references.html'].map(u => `  <url><loc>${SITE}/${u}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log(`Built ${built.length} pages.`);
