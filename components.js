/* ============================================================
   components.js — shared chrome (nav, footer) + theme logic.
   Injected into #navbar-placeholder / #footer-placeholder on every
   page, so the nav exists in exactly one place.

   Links are root-absolute, because pages under /projects/ load this
   same markup.
   ============================================================ */

/* The anchor mark. Inlined rather than pulled from an icon library:
   it is the only non-Font-Awesome glyph on the site, and it appears in
   the nav on every page and on the printed resume. Path data is
   lucide's `anchor`. */
function anchorMark(cls, strokeWidth) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
           'stroke-width="' + (strokeWidth || 2) + '" stroke-linecap="round" stroke-linejoin="round" ' +
           'aria-hidden="true" class="' + cls + '">' +
             '<path d="M12 6v16"/>' +
             '<path d="m19 13 2-1a9 9 0 0 1-18 0l2 1"/>' +
             '<path d="M9 11h6"/>' +
             '<circle cx="12" cy="4" r="2"/>' +
           '</svg>';
}

/* --- THEME --- */
function toggleTheme() {
    const html = document.documentElement;

    /* Suppress every transition while the class is swapped, so the whole
       page changes theme in a single paint. Without this the switch runs at
       four different speeds and the page spends half a second half-light.
       The class is dropped on the next frame, with a timer as a fallback
       for tabs where rAF is throttled. */
    html.classList.add('theme-switching');

    const dark = html.classList.toggle('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    updateThemeIcons();

    void html.offsetHeight;   /* apply the new colors before transitions return */
    const restore = () => html.classList.remove('theme-switching');
    requestAnimationFrame(restore);
    setTimeout(restore, 120);
}

function updateThemeIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    document.querySelectorAll('.fa-sun').forEach(el => el.style.display = isDark ? 'block' : 'none');
    document.querySelectorAll('.fa-moon').forEach(el => el.style.display = isDark ? 'none' : 'block');
}

const themeButton = (extra) => `
    <button onclick="toggleTheme()" aria-label="Toggle color theme" class="theme-toggle p-2.5 rounded-xl border transition-colors${extra ? ' ' + extra : ''}">
        <i class="fa-solid fa-sun text-sm"></i>
        <i class="fa-solid fa-moon text-sm"></i>
    </button>`;

const backLink = (label) => `
    <a href="/" class="flex items-center gap-3 shrink-0">
        <div class="nav-icon-bg p-2 rounded-xl transition-colors">
            <i class="fa-solid fa-arrow-left nav-icon-color text-base"></i>
        </div>
        <span class="text-ink font-bold text-sm">${label}</span>
    </a>`;

/* --- MOBILE MENU ---
   The section links are hidden below md, which would leave phone visitors
   with no navigation beyond the logo and the theme toggle. */
function toggleNavMenu() {
    const panel = document.getElementById('nav-mobile-panel');
    const button = document.getElementById('nav-mobile-button');
    if (!panel) return;
    const open = panel.classList.toggle('hidden') === false;
    if (button) button.setAttribute('aria-expanded', String(open));
}

function closeNavMenu() {
    const panel = document.getElementById('nav-mobile-panel');
    const button = document.getElementById('nav-mobile-button');
    if (panel && !panel.classList.contains('hidden')) {
        panel.classList.add('hidden');
        if (button) button.setAttribute('aria-expanded', 'false');
    }
}

const HOME_LINKS = [
    ['/#product', 'brushfactory'],
    ['/#data',    'data'],
    ['/#design',  'design'],
    ['/#contact', 'contact']
];

/* --- NAV VARIANTS --- */
const navConfig = {
    home: `
        <a href="/" class="flex items-center gap-3 group">
            ${anchorMark('text-accent w-5 h-5 shrink-0')}
            <span class="text-ink font-display font-bold text-base lowercase tracking-tight">oliver t. williams</span>
        </a>
        <div class="flex items-center gap-2 md:gap-6">
            <div class="hidden md:flex items-center gap-1 nav-pill p-1 rounded-2xl border">
                ${HOME_LINKS.map(([href, label]) => `<a href="${href}" class="nav-pill-item px-4 py-2 rounded-xl text-sm font-medium hover:shadow-sm transition-all">${label}</a>`).join('')}
            </div>
            <button id="nav-mobile-button" onclick="toggleNavMenu()" aria-label="Open section menu" aria-expanded="false" aria-controls="nav-mobile-panel" class="md:hidden theme-toggle p-2.5 rounded-xl border transition-colors">
                <i class="fa-solid fa-bars text-sm"></i>
            </button>
            ${themeButton()}
        </div>
    `,
    project: `
        ${backLink('back to home')}
        ${themeButton('shrink-0')}
    `,
    resume: `
        ${backLink('back to portfolio')}
        <div class="nav-pill flex items-center gap-0.5 p-1 rounded-xl border" id="nav-mode-toggle">
            <button id="btn-design" onclick="setMode('design')" class="mode-btn active">Design Focus</button>
            <button id="btn-data"   onclick="setMode('data')"   class="mode-btn">Data Focus</button>
        </div>
        <div class="flex items-center gap-4">
            <div class="relative">
                <button id="download-button" onclick="toggleDownloadMenu()" aria-haspopup="true" aria-expanded="false" aria-controls="download-menu"
                        class="text-muted hover:text-accent flex items-center gap-2 text-sm font-medium transition-colors">
                    <i class="fa-solid fa-download"></i> Download <i class="fa-solid fa-chevron-down text-2xs"></i>
                </button>
                <div id="download-menu" role="menu" class="hidden absolute right-0 top-full mt-3 w-72 max-w-none bg-surface border border-themed rounded-2xl shadow-soft p-2 z-nav">
                    <button role="menuitem" onclick="downloadResume('styled')" class="download-option">
                        <span class="download-option-title">Styled PDF</span>
                        <span class="download-option-note">The layout on screen. For a person reading it.</span>
                    </button>
                    <button role="menuitem" onclick="downloadResume('ats')" class="download-option">
                        <span class="download-option-title">ATS-friendly PDF</span>
                        <span class="download-option-note">One column without icons or rules for resume parsers.</span>
                    </button>
                </div>
            </div>
            ${themeButton()}
        </div>
    `,
    minimal: `
        ${backLink('back to portfolio')}
        ${themeButton()}
    `
};

function renderComponents() {
    const navPlaceholder = document.getElementById('navbar-placeholder');
    if (navPlaceholder) {
        const type = navPlaceholder.getAttribute('data-type') || 'home';
        navPlaceholder.innerHTML = `
            <div class="max-w-7xl mx-auto bg-surface rounded-2xl shadow-soft px-6 py-4 flex justify-between items-center border border-themed transition-all duration-500">
                ${navConfig[type] || navConfig.home}
            </div>
            ${type === 'home' ? `
            <div id="nav-mobile-panel" class="hidden md:hidden max-w-7xl mx-auto mt-2 bg-surface rounded-2xl shadow-soft border border-themed p-2">
                ${HOME_LINKS.map(([href, label]) => `<a href="${href}" onclick="closeNavMenu()" class="nav-pill-item block px-4 py-3 rounded-xl text-sm font-medium">${label}</a>`).join('')}
            </div>` : ''}
        `;
    }

    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = `
            <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                <div class="text-muted text-center md:text-left">&copy; 2026 Oliver T. Williams. All rights reserved.</div>
                <div class="flex flex-wrap justify-center items-center gap-6">
                    <div class="flex items-center gap-6">
                        <a href="mailto:oliver_tw@icloud.com" class="text-body hover:text-accent font-medium transition-colors">oliver_tw@icloud.com</a>
                        <span class="w-px h-4 bg-divider self-center hidden md:inline-block"></span>
                    </div>
                    <div class="flex items-center gap-4">
                        <a href="https://www.instagram.com/oliver_williams1212/" rel="me noopener" class="text-muted hover:text-accent transition-colors text-lg" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                        <a href="https://www.linkedin.com/in/oliver-t-williams/" rel="me noopener" class="text-muted hover:text-accent transition-colors text-lg" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
                        <a href="https://github.com/olivertw12" rel="me noopener" class="text-muted hover:text-accent transition-colors text-lg" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
                    </div>
                </div>
            </div>
        `;
    }

    updateThemeIcons();
}

/* The nav highlight.
   Driven only by what was clicked, never by scroll position. A scroll-spy
   was the obvious thing here and it was the wrong thing: clicking a link
   starts a smooth scroll AND opens an accordion panel, so for the better
   part of a second the page is moving and every section between here and
   the destination crosses the detection line in turn. The highlight
   faithfully reported each one, which reads as a glitch. Pinning and
   debouncing made it less frequent without making it correct.

   So the highlight now answers a simpler question — "which link did you
   press?" — which is the thing it can always answer accurately. */
function trackActiveSection() {
    const links = document.querySelectorAll('.nav-pill-item[href*="#"]');
    if (!links.length) return;

    const byId = {};
    links.forEach(a => {
        const id = a.getAttribute('href').split('#')[1];
        if (id) (byId[id] = byId[id] || []).push(a);
    });

    let current = null;
    const setActive = id => {
        if (id === current) return;
        current = id;
        links.forEach(a => a.classList.remove('nav-pill-item-active'));
        (byId[id] || []).forEach(a => a.classList.add('nav-pill-item-active'));
    };

    const fromHash = () => {
        const id = location.hash.slice(1);
        if (byId[id]) setActive(id);
        else {
            current = null;
            links.forEach(a => a.classList.remove('nav-pill-item-active'));
        }
    };

    window.addEventListener('hashchange', fromHash);
    fromHash();
}


document.addEventListener('DOMContentLoaded', () => {
    renderComponents();
    trackActiveSection();
    // Two frames: one to paint the injected nav, one to drop the transition
    // freeze. Previously a 100ms timer, which was a guess at the same thing.
    /* rAF is throttled in background tabs, so a page opened in one could
       keep .preload — and its transitions — forever. The timer guarantees
       the class comes off either way. */
    const unpreload = () => document.body.classList.remove('preload');
    requestAnimationFrame(() => requestAnimationFrame(unpreload));
    setTimeout(unpreload, 300);
});


/* --- WASH DITHERING ---
   CSS gradients band: the browser quantizes each one to 8 bits per channel
   with no dithering, and the wash's low-alpha ramps cross few levels over
   long distances. This re-renders the same gradients onto canvases in float
   precision and quantizes each pixel through a 64x64 blue-noise threshold
   matrix (ordered dithering) â€” every pixel rounds to one of the two adjacent
   8-bit levels with probability equal to the fractional part, so the local
   average equals the exact gradient and no noise is added on top.

   The top light and bottom deep layers are baked opaque over the page color
   (dithering the final composite exactly); the drifting orbs are dithered
   alpha textures so their CSS transform animation is untouched. The CSS
   gradient declarations in style.css remain as the no-JS fallback; the
   .wash-dithered class switches them off once the canvases are attached.

   Colors are re-read from the CSS custom properties on every render, so the
   theme tokens stay the single source of truth. Re-renders on theme toggle
   and on real resizes; document height changes (the accordion) need none,
   because the canvases are viewport-sized and anchored top/bottom. */
(function () {
    'use strict';

    /* 64x64 blue-noise rank matrix (void-and-cluster), 4096 bytes, uniform
       histogram. Generated offline; see REBUILD-NOTES.md. */
    var MASK_B64 = '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';

    /* Mirrors of the .wash-orb gradient lists in style.css:
       [rx, ry, cx, cy, endStop] as fractions of the orb box. */
    var ORB_SHAPES = {
        a: [[.30,.22,.22,.20,.70],[.24,.17,.66,.30,.70],[.21,.25,.45,.60,.72],[.27,.15,.81,.72,.70],[.17,.21,.13,.77,.72]],
        b: [[.25,.18,.37,.26,.72],[.20,.26,.73,.55,.70],[.29,.16,.19,.49,.72],[.19,.21,.59,.83,.70]]
    };
    var wash, orbEls, canvases, MASK;
    var lastSizes = '', lastDark = null, jobToken = 0;

    function cssColor(name) {
        var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        var m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(v);
        if (m) {
            var h = m[1].length === 3 ? m[1].replace(/./g, '$&$&') : m[1];
            return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1];
        }
        m = /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\s*\)/.exec(v);
        return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null;
    }

    /* out = floor(v + threshold): rounds up with probability equal to v's
       fractional part, which is the whole trick. */
    function makeImage(ctx, w, h) { return ctx.createImageData(w, h); }

    function renderTop(w, h, page, tint) {
        var c = canvases.top; c.width = w; c.height = h;
        var ctx = c.getContext('2d');
        var img = makeImage(ctx, w, h), d = img.data;
        var a0 = tint[3];
        var rx = 1.30 * w, ry = 0.46 * h, cx = 0.50 * w, cy = -0.12 * h, END = 0.62;
        var dr = tint[0] - page[0], dg = tint[1] - page[1], db = tint[2] - page[2];
        var p = 0;
        for (var y = 0; y < h; y++) {
            var vy = (y - cy) / ry, vy2 = vy * vy;
            var mrow = (y & 63) << 6;
            for (var x = 0; x < w; x++) {
                var vx = (x - cx) / rx;
                var t2 = vx * vx + vy2;
                var a = t2 >= END * END ? 0 : a0 * (1 - Math.sqrt(t2) / END);
                var th = (MASK[mrow | (x & 63)] + 0.5) / 256;
                var q;
                q = (page[0] + a * dr + th) | 0; d[p++] = q > 255 ? 255 : q;
                q = (page[1] + a * dg + th) | 0; d[p++] = q > 255 ? 255 : q;
                q = (page[2] + a * db + th) | 0; d[p++] = q > 255 ? 255 : q;
                d[p++] = 255;
            }
        }
        ctx.putImageData(img, 0, 0);
    }

    function renderDeep(w, h, page, tint) {
        var c = canvases.deep; c.width = w; c.height = h;
        var ctx = c.getContext('2d');
        var img = makeImage(ctx, w, h), d = img.data;
        var a0 = tint[3];
        var dr = tint[0] - page[0], dg = tint[1] - page[1], db = tint[2] - page[2];
        var p = 0;
        for (var y = 0; y < h; y++) {
            var a = a0 * (h > 1 ? y / (h - 1) : 1);
            var r = page[0] + a * dr, g = page[1] + a * dg, b = page[2] + a * db;
            var mrow = (y & 63) << 6;
            for (var x = 0; x < w; x++) {
                var th = (MASK[mrow | (x & 63)] + 0.5) / 256;
                var q;
                q = (r + th) | 0; d[p++] = q > 255 ? 255 : q;
                q = (g + th) | 0; d[p++] = q > 255 ? 255 : q;
                q = (b + th) | 0; d[p++] = q > 255 ? 255 : q;
                d[p++] = 255;
            }
        }
        ctx.putImageData(img, 0, 0);
    }

    function renderOrb(key, w, h, tint) {
        var c = canvases[key]; c.width = w; c.height = h;
        var ctx = c.getContext('2d');
        var img = makeImage(ctx, w, h), d = img.data;
        var a0 = tint[3];
        /* precompute the shapes in pixels, with squared cutoff for the
           cheap outside-the-ellipse rejection */
        var shapes = ORB_SHAPES[key].map(function (s) {
            return { rx: s[0] * w, ry: s[1] * h, cx: s[2] * w, cy: s[3] * h, end: s[4], end2: s[4] * s[4] };
        });
        var n = shapes.length;
        var p = 0;
        for (var y = 0; y < h; y++) {
            var mrow = (y & 63) << 6;
            for (var x = 0; x < w; x++) {
                var keep = 1;
                for (var i = 0; i < n; i++) {
                    var s = shapes[i];
                    var vx = (x - s.cx) / s.rx, vy = (y - s.cy) / s.ry;
                    var t2 = vx * vx + vy * vy;
                    if (t2 < s.end2) keep *= 1 - a0 * (1 - Math.sqrt(t2) / s.end);
                }
                var th = (MASK[mrow | (x & 63)] + 0.5) / 256;
                var q = ((1 - keep) * 255 + th) | 0;
                d[p] = tint[0]; d[p + 1] = tint[1]; d[p + 2] = tint[2];
                d[p + 3] = q > 255 ? 255 : q;
                p += 4;
            }
        }
        ctx.putImageData(img, 0, 0);
    }

    /* The canvases live in the DOM from init (transparent until painted), so
       CSS is the single owner of their geometry — JS just reads the boxes it
       is given. The .wash-dithered class only lands after the first full
       render, so the CSS gradients cover until then. */
    function measure() {
        return {
            W: canvases.top.clientWidth,
            topH: canvases.top.clientHeight,
            deepH: canvases.deep.clientHeight,
            orbW: orbEls.a ? orbEls.a.clientWidth : 0,
            orbH: orbEls.a ? orbEls.a.clientHeight : 0
        };
    }

    function render() {
        var page = cssColor('--color-page');
        var top = cssColor('--wash-1');
        var deep = cssColor('--wash-deep');
        var caustic = cssColor('--wash-caustic');
        if (!page || !top || !deep || !caustic) return;

        var m = measure();
        if (!m.W || !m.topH) return;
        lastSizes = JSON.stringify(m);
        lastDark = document.documentElement.classList.contains('dark');

        /* Orbs render at reduced resolution (capped total pixels) and are
           stretched by CSS: at their alpha one texel of dither is well under
           a level of composite change, so the scaling is invisible. */
        var s = Math.min(0.5, Math.sqrt(2.2e6 / (m.orbW * m.orbH || 1)));

        /* One layer per task: the loops are the page-size ones, and doing
           them all in one task would block the first interaction. The class
           flips last so the swap from the CSS fallback is a single paint.
           setTimeout rather than rAF, which never fires in a hidden tab —
           a page opened in the background would stay on the fallback. */
        var token = ++jobToken;
        var jobs = [
            function () { renderTop(m.W, m.topH, page, top); },
            function () { renderDeep(m.W, m.deepH, page, deep); },
            function () { if (orbEls.a) renderOrb('a', Math.round(m.orbW * s), Math.round(m.orbH * s), caustic); },
            function () { if (orbEls.b) renderOrb('b', Math.round(m.orbW * s), Math.round(m.orbH * s), caustic); },
            function () { wash.classList.add('wash-dithered'); }
        ];
        (function step() {
            if (token !== jobToken || !jobs.length) return;
            jobs.shift()();
            setTimeout(step, 30);
        })();
    }

    function initWashDither() {
        wash = document.querySelector('.site-wash');
        if (!wash || !window.atob || !window.Uint8Array ||
            !document.createElement('canvas').getContext) return;
        try {
            var bin = atob(MASK_B64);
            MASK = new Uint8Array(4096);
            for (var i = 0; i < 4096; i++) MASK[i] = bin.charCodeAt(i);
        } catch (e) { return; }

        orbEls = { a: wash.querySelector('.wash-orb.a'), b: wash.querySelector('.wash-orb.b') };
        canvases = {
            top: document.createElement('canvas'),
            deep: document.createElement('canvas'),
            a: document.createElement('canvas'),
            b: document.createElement('canvas')
        };
        canvases.top.className = 'wash-canvas top';
        canvases.deep.className = 'wash-canvas deep';
        wash.insertBefore(canvases.deep, wash.firstChild);
        wash.insertBefore(canvases.top, wash.firstChild);
        if (orbEls.a) orbEls.a.appendChild(canvases.a);
        if (orbEls.b) orbEls.b.appendChild(canvases.b);

        render();

        var timer = null;
        window.addEventListener('resize', function () {
            clearTimeout(timer);
            timer = setTimeout(function () {
                /* Any change to a layer box means the canvas is being CSS-
                   stretched — re-render at the new size. --wash-unit already
                   absorbs small mobile URL-bar height jitter on most pages
                   (the vw arm of the max() wins), so this fires rarely. */
                if (JSON.stringify(measure()) !== lastSizes) render();
            }, 250);
        });

        /* Theme toggles swap every --wash-* token, so re-render. Keyed on the
           actual dark state: the observer also fires for .theme-switching. */
        new MutationObserver(function () {
            var dark = document.documentElement.classList.contains('dark');
            if (dark !== lastDark) render();
        }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWashDither);
    } else {
        initWashDither();
    }
})();
