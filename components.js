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
            <span class="w-2.5 h-2.5 rounded-full bg-accent" aria-hidden="true"></span>
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
                        <span class="download-option-note">One column, no icons or rules. For résumé parsers.</span>
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
