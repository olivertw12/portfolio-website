// This file is now statically wired to style.css
// You never need to edit this file again! Modify style.css instead.
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                cream: 'var(--color-cream)',
                surface: 'var(--color-surface)',
                'dark-bg': 'var(--color-dark-bg)',
                'dark-surface': 'var(--color-dark-surface)',
                primary: 'var(--color-primary)',
                'primary-dark': 'var(--color-primary-dark)',
                success: 'var(--color-success)',
                accent: 'var(--color-accent)',
                'accent-light': 'var(--color-accent-light)',
                'accent-muted': 'var(--color-accent-muted)',
                muted: 'var(--color-muted)',
                code: 'var(--color-code)',
            },
            fontFamily: {
                sans: 'var(--font-sans)',
                mono: 'var(--font-mono)',
            },
            borderRadius: {
                'xl': 'var(--radius-xl)',
                '2xl': 'var(--radius-2xl)',
                '3xl': 'var(--radius-3xl)',
            },
            boxShadow: {
                'soft': 'var(--shadow-soft)',
                'glow': 'var(--shadow-glow)',
                'paper': 'var(--shadow-paper)',
            }
        }
    }
}
