// --- THEME LOGIC ---
function toggleTheme() {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
    updateThemeIcons();
}

function updateThemeIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    document.querySelectorAll('.fa-sun').forEach(el => el.style.display = isDark ? 'block' : 'none');
    document.querySelectorAll('.fa-moon').forEach(el => el.style.display = isDark ? 'none' : 'block');
}

// --- COMPONENT TEMPLATES ---
const navConfig = {
    home: `
        <div class="flex items-center gap-3 group cursor-pointer" onclick="window.location.href='index.html'">
            <div class="nav-icon-bg p-2 rounded-xl transition-colors">
                <i data-lucide="anchor" class="nav-icon-color w-5 h-5"></i>
            </div>
            <span class="text-primary font-bold text-sm tracking-tight hidden md:block">Oliver T. Williams</span>
        </div>
        <div class="flex items-center gap-2 md:gap-6">
            <div class="hidden md:flex items-center gap-1 nav-pill p-1 rounded-xl border">
                <a href="#design" class="nav-pill-item px-4 py-2 rounded-[12px] text-sm font-medium hover:shadow-sm transition-all">Design</a>
                <a href="#data"   class="nav-pill-item px-4 py-2 rounded-[12px] text-sm font-medium hover:shadow-sm transition-all">Data</a>
                <a href="#contact" class="nav-pill-item px-4 py-2 rounded-[12px] text-sm font-medium hover:shadow-sm transition-all">Contact</a>
            </div>
            <button onclick="toggleTheme()" class="theme-toggle p-2.5 rounded-xl border transition-colors">
                <i class="fa-solid fa-sun hidden dark:block text-sm"></i>
                <i class="fa-solid fa-moon block dark:hidden text-sm"></i>
            </button>
        </div>
    `,
    project: `
        <div class="flex items-center gap-3 cursor-pointer shrink-0" onclick="window.location.href='index.html'">
            <div class="nav-icon-bg p-2 rounded-xl transition-colors">
                <i data-lucide="arrow-left" class="nav-icon-color w-5 h-5"></i>
            </div>
            <span class="text-primary font-bold text-sm">Back to Home</span>
        </div>
        <button onclick="toggleTheme()" class="theme-toggle p-2.5 rounded-xl border transition-colors shrink-0">
            <i class="fa-solid fa-sun hidden dark:block text-sm"></i>
            <i class="fa-solid fa-moon block dark:hidden text-sm"></i>
        </button>
    `,
    resume: `
        <div class="flex items-center gap-3 cursor-pointer" onclick="window.location.href='index.html'">
            <div class="nav-icon-bg p-2 rounded-xl transition-colors">
                <i data-lucide="arrow-left" class="nav-icon-color w-5 h-5"></i>
            </div>
            <span class="text-primary font-bold text-sm">Back to Portfolio</span>
        </div>
        <div class="flex items-center gap-4">
            <button onclick="window.print()" class="text-muted hover:text-accent flex items-center gap-2 text-sm font-medium transition-colors">
                <i class="fa-solid fa-print"></i> Print / Save PDF
            </button>
            <button onclick="toggleTheme()" class="theme-toggle p-2.5 rounded-xl border transition-colors">
                <i class="fa-solid fa-sun hidden dark:block"></i>
                <i class="fa-solid fa-moon block dark:hidden"></i>
            </button>
        </div>
    `
};

function renderComponents() {
    // Navbar
    const navPlaceholder = document.getElementById('navbar-placeholder');
    if (navPlaceholder) {
        const type = navPlaceholder.getAttribute('data-type') || 'home';
        navPlaceholder.innerHTML = `
            <div class="max-w-7xl mx-auto bg-surface dark:bg-dark-surface rounded-2xl shadow-soft px-6 py-4 flex justify-between items-center border border-themed transition-all duration-500">
                ${navConfig[type]}
            </div>
        `;
    }

    // Footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = `
            <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                <div class="text-muted text-center md:text-left">&copy; 2026 Oliver T. Williams. All rights reserved.</div>
                <div class="flex flex-wrap justify-center items-center gap-6">
                    <div class="flex items-center gap-6">
                        <a href="mailto:oliver_tw@icloud.com" class="text-body hover:text-accent font-medium transition-colors">oliver_tw@icloud.com</a>
                        <span class="w-px h-4 bg-divider self-center inline-block"></span>
                        <span class="text-body font-medium">+1 (317) 914-8047</span>
                        <span class="w-px h-4 bg-divider self-center hidden md:inline-block"></span>
                    </div>
                    <div class="flex items-center gap-4">
                        <a href="https://www.instagram.com/oliver_williams1212/" class="text-muted hover:text-accent transition-colors text-lg" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                        <a href="https://www.linkedin.com/in/oliver-t-williams/" class="text-muted hover:text-accent transition-colors text-lg" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
                        <a href="https://github.com/olivertw12" class="text-muted hover:text-accent transition-colors text-lg" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
                    </div>
                </div>
            </div>
        `;
    }

    updateThemeIcons();
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', () => {
    renderComponents();
    setTimeout(() => document.body.classList.remove('preload'), 100);
});
