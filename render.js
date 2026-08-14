/* ============================================================
   render.js — every piece of project markup the site generates.
   ------------------------------------------------------------
   Pure string functions over the objects in projects.js. Nothing in
   here touches the DOM except renderCards(), which is the one place
   that writes into a container.

   That restriction is the point: tailwind-build/prerender.js runs this
   same file under Node at build time to bake the markup into the HTML,
   so search engines and no-JS visitors get real content. If a renderer
   reaches for `document`, the build breaks.

   Load order on every page: projects.js, then render.js.
   ============================================================ */

/* --- small helpers ------------------------------------------------ */

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* Root-absolute so a page under /projects/ links the same way the
   homepage does. */
function projectHref(id) {
  return '/projects/' + encodeURIComponent(id) + '.html';
}

/* Image paths are stored relative in projects.js ("images/x.png"). Pages
   live at two depths (/ and /projects/), so they are made root-absolute
   here rather than in the data. */
function asset(src) {
  return (!src || /^(?:[a-z]+:)?\/\//i.test(src) || src.charAt(0) === '/') ? src : '/' + src;
}

/* Font Awesome class. A bare name is assumed solid; anything with a
   space (e.g. "fa-brands fa-github") is passed through. */
function faClass(name) {
  return /\s/.test(name) ? name : 'fa-solid ' + name;
}

function icon(name, extra) {
  return '<i class="' + esc(faClass(name)) + (extra ? ' ' + extra : '') + '"></i>';
}


/* --- syntax highlighting ------------------------------------------ */
/* One pass over the raw source, escaping each piece as it goes, so a
   pattern can't match inside an entity it just emitted. */

var HL_KEYWORDS = /\b(?:const|let|var|function|return|if|else|for|while|of|in|new|export|import|from|class|async|await|typeof|true|false|null|undefined|TRUE|FALSE|NULL|NA|library|module|require)\b/;

var HL_TOKEN = new RegExp([
  '(#[^\\n]*|//[^\\n]*)',                                   // 1 comment
  '("(?:[^"\\\\\\n]|\\\\.)*"|\'(?:[^\'\\\\\\n]|\\\\.)*\')', // 2 string
  '(\\b\\d+(?:\\.\\d+)?\\b)',                               // 3 number
  '(' + HL_KEYWORDS.source + ')',                           // 4 keyword
  '([A-Za-z_.$][A-Za-z0-9_.$]*(?=\\s*\\())'                 // 5 call
].join('|'), 'g');

var HL_CLASS = { 1: 'token-comment', 2: 'token-str', 3: 'token-num', 4: 'token-kw', 5: 'token-func' };

function highlight(src) {
  var out = '', last = 0, m;
  HL_TOKEN.lastIndex = 0;
  while ((m = HL_TOKEN.exec(src)) !== null) {
    out += esc(src.slice(last, m.index));
    for (var g = 1; g <= 5; g++) {
      if (m[g] !== undefined) {
        out += '<span class="' + HL_CLASS[g] + '">' + esc(m[g]) + '</span>';
        break;
      }
    }
    last = m.index + m[0].length;
  }
  return out + esc(src.slice(last));
}

function windowDots(vivid) {
  var s = vivid ? '-vivid' : '';
  return '<div class="flex gap-1.5">' +
    '<div class="w-3 h-3 rounded-full chrome-close' + s + '"></div>' +
    '<div class="w-3 h-3 rounded-full chrome-minimize' + s + '"></div>' +
    '<div class="w-3 h-3 rounded-full chrome-maximize' + s + '"></div>' +
  '</div>';
}


/* --- grid cards ---------------------------------------------------- */

/* Image-led card, used for design and data work. */
function projectCard(id, level) {
  var h = 'h' + (level || 3);
  var p = projectData[id];
  if (!p) return '';
  var img = p.card.image;
  var media = img
    ? '<img src="' + esc(asset(img)) + '" alt="" loading="lazy" ' +
      'class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">'
    : '<div class="w-full h-full flex items-center justify-center">' + icon('fa-file-code', 'text-4xl text-subtle') + '</div>';

  return '' +
    '<a href="' + projectHref(id) + '" class="glass-card bg-surface rounded-3xl p-4 shadow-soft border border-themed group flex flex-col h-full">' +
      '<div class="relative aspect-photo bg-wash rounded-2xl overflow-hidden mb-3 shrink-0">' + media + '</div>' +
      '<div class="px-1 pb-1 flex-grow">' +
        '<div class="flex items-start justify-between gap-2 mb-1.5">' +
          '<' + h + ' class="text-ink text-base font-bold">' + esc(p.card.title || p.title) + '</' + h + '>' +
          '<span class="tech-pill text-2xs font-bold px-2.5 py-0.5 rounded-full shrink-0 whitespace-nowrap">' + esc(p.card.chip) + '</span>' +
        '</div>' +
        '<p class="text-muted text-sm font-normal line-clamp-3">' + esc(p.card.blurb) + '</p>' +
      '</div>' +
    '</a>';
}

/* Archive cards sit directly under the page h1, so they are h2 there. */
function archiveCard(id) { return projectCard(id, 2); }


/* --- feature card --------------------------------------------------
   The large two-column block the homepage gives a lead project. Shape:

     feature: {
       mediaSide: 'left' | 'right',      // on lg+; media is always first on mobile
       height:    'card-lg' | 'card-xl', // min height of the block on lg+
       media:  { type:'image', src, alt, fit:'cover'|'contain' }
             | { type:'code',  file, src },
       heading, body,
       actions:[{ label, style:'primary'|'secondary',
                  href? | project?, external?, icon?, iconTurn? }]
     }
   ------------------------------------------------------------------ */

function featureMedia(f) {
  var right = f.mediaSide === 'right';
  var edge  = right ? 'lg:border-l lg:order-2' : 'lg:border-r';
  var m     = f.media;

  if (m.type === 'code') {
    return '' +
      '<div class="bg-code-panel border-b lg:border-b-0 ' + edge + ' border-code min-h-card lg:min-h-full group overflow-hidden flex flex-col">' +
        '<div class="flex items-center px-4 py-3 border-b border-code bg-code-panel-header">' +
          '<div class="mr-3">' + windowDots(true) + '</div>' +
          '<span class="text-code-label text-2xs font-mono tracking-wide">' + esc(m.file) + '</span>' +
        '</div>' +
        '<div class="text-code p-6 font-mono text-xs leading-loose select-none opacity-80 group-hover:opacity-100 transition-opacity flex flex-col justify-center h-full overflow-x-auto">' +
          '<pre class="m-0"><code>' + highlight(m.src) + '</code></pre>' +
        '</div>' +
      '</div>';
  }

  if (m.fit === 'contain') {
    return '' +
      '<div class="bg-wash border-b lg:border-b-0 ' + edge + ' border-themed flex items-center justify-center p-6 md:p-8 group overflow-hidden">' +
        '<img src="' + esc(asset(m.src)) + '" alt="' + esc(m.alt) + '" class="w-full h-auto rounded-xl border border-themed shadow-soft transition-transform duration-700 group-hover:scale-102">' +
      '</div>';
  }

  return '' +
    '<div class="relative bg-wash border-b lg:border-b-0 ' + edge + ' border-themed min-h-card lg:min-h-full group overflow-hidden">' +
      '<img src="' + esc(asset(m.src)) + '" alt="' + esc(m.alt) + '" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">' +
    '</div>';
}

function featureAction(a) {
  var href = a.href || projectHref(a.project);
  var cls  = (a.style === 'secondary' ? 'btn-secondary' : 'btn-primary') +
             ' inline-flex items-center gap-2 px-7 py-3';
  var ext  = a.external ? ' target="_blank" rel="noopener"' : '';
  var ico  = a.icon ? ' ' + icon(a.icon, a.iconTurn ? '-rotate-45' : '') : '';
  return '<a href="' + esc(href) + '" class="' + cls + '"' + ext + '>' + esc(a.label) + ico + '</a>';
}

function featureCard(id) {
  var p = projectData[id];
  if (!p || !p.feature) return '';
  var f = p.feature;
  var textOrder = f.mediaSide === 'right' ? ' lg:order-1' : '';
  var height    = f.height ? ' lg:min-h-' + f.height : '';

  return '' +
    '<div class="bg-surface rounded-3xl overflow-hidden shadow-soft border border-themed">' +
      '<div class="grid grid-cols-1 lg:grid-cols-2' + height + '">' +
        featureMedia(f) +
        '<div class="p-8 md:p-12 flex flex-col justify-center relative z-10' + textOrder + '">' +
          '<div class="mb-6">' +
            '<h3 class="text-ink text-3xl font-bold mb-4">' + esc(f.heading) + '</h3>' +
            '<p class="text-body text-lg mb-6">' + esc(f.body) + '</p>' +
          '</div>' +
          '<div class="mt-auto flex flex-wrap items-center gap-4">' +
            (f.actions || []).map(featureAction).join('') +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
}


/* --- project page: shared header ----------------------------------- */

function projectHeader(d) {
  return '' +
    /* Plain eyebrow rather than a pill, matching the PART 01/02/03 labels
       on the homepage. */
    '<span class="text-accent text-sm font-bold tracking-wider uppercase mb-4 block">' + esc(d.category) + '</span>' +
    '<h1 class="text-ink text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight break-words max-w-4xl">' + esc(d.title) + '</h1>' +
    '<div class="grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-themed py-6">' +
      (d.meta || []).map(function (m) {
        return '<div class="min-w-0">' +
          '<span class="text-muted text-xs font-bold uppercase tracking-wider block mb-1">' + esc(m.label) + '</span>' +
          '<span class="text-ink font-medium block">' + esc(m.value) + '</span>' +
        '</div>';
      }).join('') +
    '</div>';
}


/* --- project page: technical layout -------------------------------- */

function codePanel(code) {
  return '' +
  '<div class="bg-surface rounded-3xl p-5 border border-themed shadow-soft">' +
    '<div class="bg-code rounded-2xl overflow-hidden border-code border flex flex-col w-full min-w-0">' +
      '<div class="flex items-center justify-between px-4 py-2.5 bg-code-titlebar border-b border-code shrink-0">' +
        '<span class="text-code-label text-xs font-mono">' + esc(code.file) + '</span>' +
        windowDots(false) +
      '</div>' +
      '<div class="p-4 overflow-x-auto flex-grow font-mono text-sm text-code">' +
        '<pre><code>' + highlight(code.src) + '</code></pre>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function figurePanel(img) {
  return '' +
  '<figure class="bg-surface rounded-3xl p-5 border border-themed shadow-soft">' +
    '<div class="bg-wash rounded-2xl border border-themed overflow-hidden flex items-center justify-center min-h-panel">' +
      '<img src="' + esc(asset(img.src)) + '" alt="' + esc(img.alt || '') + '" loading="lazy" class="w-full h-auto object-contain">' +
    '</div>' +
    (img.caption ? '<figcaption class="text-muted text-sm mt-3 px-1">' + esc(img.caption) + '</figcaption>' : '') +
  '</figure>';
}

function technicalLayout(d) {
  var pad = function (n) { return String(n).padStart(2, '0'); };

  var lede = '<div class="text-lg text-body font-normal mb-20 max-w-4xl">' +
    (d.lede || []).map(function (p) {
      return '<p class="mb-6 last:mb-0"><strong class="text-ink font-semibold">' + esc(p.label) + ':</strong> ' + esc(p.text) + '</p>';
    }).join('') + '</div>';

  var n = 0;
  var sections = (d.sections || []).map(function (s) {
    var titled = !!s.heading;
    if (titled) n++;

    var html = '<section class="mb-24">';

    if (titled) {
      html += '<div class="flex items-baseline gap-3 mb-6">' +
                '<span class="text-accent font-mono font-bold text-xl">' + pad(n) + '</span>' +
                '<h2 class="text-ink text-2xl md:text-3xl font-bold">' + esc(s.heading) + '</h2>' +
              '</div>';
    }
    if (s.body) {
      html += '<p class="text-body font-normal mb-8 text-lg max-w-4xl">' + esc(s.body) + '</p>';
    }

    if (s.code && s.image) {
      html += '<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">' + codePanel(s.code) + figurePanel(s.image) + '</div>';
    } else if (s.code) {
      html += codePanel(s.code);
    } else if (s.image) {
      html += figurePanel(s.image);
    }

    if (s.note) html += '<aside class="callout mt-8">' + esc(s.note) + '</aside>';

    return html + '</section>';
  }).join('');

  var links = '';
  if (d.links && d.links.length) {
    links = '<div class="mb-20">' + d.links.map(function (l) {
      return '<a href="' + esc(l.href) + '" target="_blank" rel="noopener" class="inline-flex items-center gap-2 mr-3 mb-3 px-5 py-3 rounded-xl font-semibold text-sm border border-themed bg-surface text-ink hover:text-accent transition-colors">' +
        (l.icon === 'github' ? icon('fa-brands fa-github') : icon('fa-link')) + esc(l.label) +
      '</a>';
    }).join('') + '</div>';
  }

  return lede + '<div>' + sections + '</div>' + links;
}


/* --- project page: case-study layout -------------------------------- */

/* The lightbox walks this list, so the hero is index 0 and the gallery
   images follow in order. */
function galleryImages(d) {
  return [{ src: asset(d.hero), caption: d.heroCaption }]
    .concat((d.gallery || []).map(function (g) { return { src: asset(g.src), caption: g.caption }; }));
}

function caseStudyLayout(d) {
  var gallery = d.gallery || [];
  var isLarge = gallery.length > 3;

  var body = [
    ['01', 'Background',    d.background],
    ['02', 'The Challenge', d.challenge],
    ['03', 'The Solution',  d.solution],
    ['04', 'The Result',    d.result]
  ].map(function (row) {
    return '<div class="w-full md:col-span-4"><div class="flex items-baseline gap-3">' +
             '<span class="text-accent font-mono font-bold text-xl">' + row[0] + '</span>' +
             '<h2 class="text-ink text-2xl font-bold">' + row[1] + '</h2>' +
           '</div></div>' +
           '<div class="w-full md:col-span-8"><p class="text-body font-normal text-base md:text-lg break-words">' + esc(row[2]) + '</p></div>';
  }).join('');

  var figures = gallery.map(function (img, i) {
    var span   = (!isLarge && (i + 1) % 3 === 0) ? 'md:col-span-2' : '';
    var aspect = (!isLarge && (i + 1) % 3 === 0) ? 'aspect-video'  : 'aspect-photo';
    return '<figure class="' + span + ' group cursor-pointer" onclick="openLightbox(' + (i + 1) + ')">' +
             '<div class="bg-wash rounded-2xl overflow-hidden ' + aspect + ' border border-themed shadow-soft mb-3 relative">' +
               '<img src="' + esc(asset(img.src)) + '" alt="' + esc(img.caption) + '" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">' +
               '<div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">' +
                 '<div class="bg-white/20 backdrop-blur-md p-3 rounded-full">' + icon('fa-up-right-and-down-left-from-center', 'text-white text-lg') + '</div>' +
               '</div>' +
             '</div>' +
             '<figcaption class="text-muted font-normal text-sm px-1">' + esc(img.caption) + '</figcaption>' +
           '</figure>';
  }).join('');

  return '' +
    '<figure class="mb-20">' +
      '<div class="w-full aspect-video bg-wash rounded-3xl overflow-hidden shadow-soft mb-3 border border-themed group cursor-pointer relative" onclick="openLightbox(0)">' +
        '<img src="' + esc(asset(d.hero)) + '" alt="' + esc(d.heroCaption || d.title) + '" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">' +
        '<div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">' +
          '<div class="bg-white/20 backdrop-blur-md p-3 rounded-full">' + icon('fa-up-right-and-down-left-from-center', 'text-white text-lg') + '</div>' +
        '</div>' +
      '</div>' +
      '<figcaption class="text-muted font-normal text-sm text-center italic px-4">' + esc(d.heroCaption || '') + '</figcaption>' +
    '</figure>' +
    '<div class="flex flex-col md:grid md:grid-cols-12 gap-y-10 md:gap-x-12 mb-24">' + body + '</div>' +
    '<div class="' + (isLarge ? 'grid grid-cols-1 md:grid-cols-3 gap-6 mb-20' : 'grid grid-cols-1 md:grid-cols-2 gap-6 mb-20') + '">' + figures + '</div>';
}

function projectLayout(d) {
  return d.layout === 'technical' ? technicalLayout(d) : caseStudyLayout(d);
}


/* --- next project --------------------------------------------------
   Stays within the same group, so a data page doesn't hand off to a
   poster. A group with only one entry would link to itself, so those
   fall back to the full running order. */
function nextProjectId(id) {
  var d = projectData[id];
  var group = Object.keys(projectData).filter(function (k) { return projectData[k].group === d.group; });
  var order = group.length > 1 ? group : Object.keys(projectData);
  return order[(order.indexOf(id) + 1) % order.length];
}

function nextProjectHTML(id) {
  var nextKey = nextProjectId(id);
  return '<span class="text-muted text-sm font-medium">Next</span>' +
    '<a href="' + projectHref(nextKey) + '" class="group text-ink hover:text-accent flex items-center gap-4 text-xl md:text-3xl font-bold transition-colors w-full md:w-auto">' +
      '<span class="break-words">' + esc(projectData[nextKey].title) + '</span>' +
      icon('fa-arrow-right', 'text-2xl md:text-4xl group-hover:translate-x-2 transition-transform shrink-0') +
    '</a>';
}


/* --- card containers ------------------------------------------------
   A container declares what it holds:

     <div id="design-grid" data-cards="project:design"></div>

   which is "render featured.design with projectCard". The build fills
   these in; mountCards() fills any that are still empty at runtime, so
   the page works whether or not the build ran. */

var CARD_RENDERERS = {
  feature: featureCard,
  project: projectCard,
  archive: archiveCard
};

function cardsHTML(spec) {
  var parts    = String(spec).split(':');
  var renderer = CARD_RENDERERS[parts[0]];
  var ids      = parts[1] === 'all' ? archiveOrder : (featured[parts[1]] || []);
  if (!renderer) return '';
  return ids.map(function (id) { return renderer(id); }).join('');
}

/* The one place in this file that touches the DOM. */
function mountCards() {
  if (typeof document === 'undefined') return;
  var nodes = document.querySelectorAll('[data-cards]');
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].children.length) continue;   // already prerendered
    nodes[i].innerHTML = cardsHTML(nodes[i].getAttribute('data-cards'));
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', mountCards);
}
