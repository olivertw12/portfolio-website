// components.js

function loadComponents() {
    renderNavbar();
    renderFooter();
    initializeTheme(); // Re-run theme logic after DOM injection
    lucide.createIcons(); // Re-run icon rendering
}

function renderNavbar() {
    const navContainer = document.getElementById('navbar-placeholder');
    if (!navContainer) return;

    // Check if this is the home page or a project page
    const pageType = navContainer.getAttribute('data-type');
    
    let navContent = '';

    if (pageType === 'home') {
        // --- HOME NAVIGATION ---
        navContent = `
        <div class="max-w-7xl mx-auto bg-surface/80 dark:bg-dark-surface/80 backdrop-blur-md rounded-2xl shadow-soft px-6 py-4 flex justify-between items-center border border-gray-100 dark:border-gray-700 transition-all duration-500">
            <div class="flex items-center gap-3 group cursor-pointer" onclick="window.location.href='index.html'">
                <div class="bg-gray-100 dark:bg-gray-700 p-2 rounded-xl transition-colors">
                    <i data-lucide="anchor" class="text-gray-900 dark:text-white w-5 h-5"></i>
                </div>
                <span class="font-bold text-gray-900 dark:text-white text-sm tracking-tight hidden md:block">Oliver T. Williams</span>
            </div>
            <div class="flex items-center gap-2 md:gap-6">
                <div class="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                    <a href="index.html#design" class="px-4 py-2 rounded-[12px] text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hover:shadow-sm transition-all">Design</a>
                    <a href="index.html#data" class="px-4 py-2 rounded-[12px] text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hover:shadow-sm transition-all">Data</a>
                    <a href="index.html#contact" class="px-4 py-2 rounded-[12px] text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hover:shadow-sm transition-all">Contact</a>
                </div>
                ${getThemeButton()}
            </div>
        </div>
        `;
    } else {
        // --- PROJECT NAVIGATION (Back Button) ---
        navContent = `
        <div class="max-w-7xl mx-auto bg-surface/80 dark:bg-dark-surface/80 backdrop-blur-md rounded-2xl shadow-soft px-6 py-4 flex justify-between items-center border border-gray-100 dark:border-gray-700 transition-all duration-500">
            <div class="flex items-center gap-3 cursor-pointer" onclick="window.location.href='index.html'">
                <div class="bg-gray-100 dark:bg-gray-700 p-2 rounded-xl">
                    <i data-lucide="arrow-left" class="text-gray-900 dark:text-white w-5 h-5"></i>
                </div>
                <span class="font-bold text-gray-900 dark:text-white text-sm">Back to Home</span>
            </div>
            
            ${getThemeButton()}
        </div>
        `;
    }

    navContainer.innerHTML = navContent;
}

function renderFooter() {
    const footerContainer = document.getElementById('footer-placeholder');
    if (!footerContainer) return;

    footerContainer.innerHTML = `
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        <div class="text-gray-500 dark:text-gray-400">
            &copy; 2025 Oliver T. Williams.
        </div>
        
        <div class="flex flex-wrap justify-center items-center gap-6">
            <div class="flex items-center gap-6">
                <a href="mailto:oliver_tw@icloud.com" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">oliver_tw@icloud.com</a>
                <span class="text-gray-300 dark:text-gray-700">•</span>
                <span class="text-gray-600 dark:text-gray-400 font-medium">+1 (317) 914-8047</span>
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

// Helper to avoid repeating the button HTML
function getThemeButton() {
    return `
    <button onclick="toggleTheme()" class="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
        <i class="fa-solid fa-sun hidden dark:block text-sm"></i>
        <i class="fa-solid fa-moon block dark:hidden text-sm"></i>
    </button>
    `;
}

// Theme Logic
function initializeTheme() {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

function toggleTheme() {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Run everything when DOM is ready
document.addEventListener('DOMContentLoaded', loadComponents);