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
    // Updates all sun/moon icons on the page
    const isDark = document.documentElement.classList.contains('dark');
    document.querySelectorAll('.fa-sun').forEach(el => el.style.display = isDark ? 'block' : 'none');
    document.querySelectorAll('.fa-moon').forEach(el => el.style.display = isDark ? 'none' : 'block');
}

// --- COMPONENT INJECTION ---

const navConfig = {
    home: `
        <div class="flex items-center gap-3 group cursor-pointer" onclick="window.location.href='index.html'">
            <div class="bg-gray-100 dark:bg-gray-700 p-2 rounded-xl transition-colors">
                <i data-lucide="anchor" class="text-gray-900 dark:text-white w-5 h-5"></i>
            </div>
            <span class="font-bold text-gray-900 dark:text-white text-sm tracking-tight hidden md:block">Oliver T. Williams</span>
        </div>
        <div class="flex items-center gap-2 md:gap-6">
            <div class="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                <a href="#design" class="px-4 py-2 rounded-[12px] text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hover:shadow-sm transition-all">Design</a>
                <a href="#data" class="px-4 py-2 rounded-[12px] text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hover:shadow-sm transition-all">Data</a>
                <a href="#contact" class="px-4 py-2 rounded-[12px] text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hover:shadow-sm transition-all">Contact</a>
            </div>
            <button onclick="toggleTheme()" class="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors">
                <i class="fa-solid fa-sun hidden dark:block text-sm"></i>
                <i class="fa-solid fa-moon block dark:hidden text-sm"></i>
            </button>
        </div>
    `,
    project: `
        <div class="flex items-center gap-3 cursor-pointer shrink-0" onclick="window.location.href='index.html'">
            <div class="bg-gray-100 dark:bg-gray-700 p-2 rounded-xl">
                <i data-lucide="arrow-left" class="text-gray-900 dark:text-white w-5 h-5"></i>
            </div>
            <span class="font-bold text-gray-900 dark:text-white text-sm">Back to Home</span>
        </div>
        <button onclick="toggleTheme()" class="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0">
            <i class="fa-solid fa-sun hidden dark:block text-sm"></i>
            <i class="fa-solid fa-moon block dark:hidden text-sm"></i>
        </button>
    `,
    resume: `
        <div class="flex items-center gap-3 cursor-pointer" onclick="window.location.href='index.html'">
            <div class="bg-gray-100 dark:bg-gray-700 p-2 rounded-xl">
                <i class="fa-solid fa-arrow-left text-gray-900 dark:text-white text-lg"></i>
            </div>
            <span class="font-bold text-gray-900 dark:text-white text-sm">Back to Portfolio</span>
        </div>
        <div class="flex items-center gap-4">
            <button onclick="window.print()" class="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <i class="fa-solid fa-print"></i>
                Print / Save PDF
            </button>
            <button onclick="toggleTheme()" class="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <i class="fa-solid fa-sun hidden dark:block"></i>
                <i class="fa-solid fa-moon block dark:hidden"></i>
            </button>
        </div>
    `
};

function renderComponents() {
    // 1. Inject Navbar
    const navPlaceholder = document.getElementById('navbar-placeholder');
    if (navPlaceholder) {
        const type = navPlaceholder.getAttribute('data-type') || 'home';
        navPlaceholder.innerHTML = `
            <div class="max-w-7xl mx-auto bg-surface/80 dark:bg-dark-surface/80 backdrop-blur-md rounded-2xl shadow-soft px-6 py-4 flex justify-between items-center border border-gray-100 dark:border-gray-700 transition-all duration-500">
                ${navConfig[type]}
            </div>
        `;
    }

    // 2. Inject Footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = `
            <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                <div class="text-gray-500 dark:text-gray-400 text-center md:text-left">
                    &copy; 2025 Oliver T. Williams.
                </div>
                
                <div class="flex flex-wrap justify-center items-center gap-6">
                    <div class="flex items-center gap-6">
                        <a href="mailto:oliver_tw@icloud.com" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">oliver_tw@icloud.com</a>
                        <span class="text-gray-300 dark:text-gray-700">•</span>
                        <span class="text-gray-600 dark:text-gray-400 font-medium">+1 (317) 914-8047</span>
                        <span class="text-gray-300 dark:text-gray-700 hidden md:inline">•</span>
                    </div>

                    <div class="flex items-center gap-4">
                        <a href="https://www.instagram.com/oliver_williams1212/" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-lg" aria-label="Instagram">
                            <i class="fa-brands fa-instagram"></i>
                        </a>
                        <a href="https://www.linkedin.com/in/oliver-t-williams/" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-lg" aria-label="LinkedIn">
                            <i class="fa-brands fa-linkedin"></i>
                        </a>
                        <a href="https://github.com/olivertw12" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-lg" aria-label="GitHub">
                            <i class="fa-brands fa-github"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    // 3. Update Icons based on current state (which was set by inline script)
    updateThemeIcons();

    // 4. Initialize Lucide Icons (if loaded)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Enable transitions after page load to prevent flash
document.addEventListener('DOMContentLoaded', () => {
    renderComponents();
    
    // Remove the preload class after a short delay
    setTimeout(() => {
        document.body.classList.remove('preload');
    }, 100);
});