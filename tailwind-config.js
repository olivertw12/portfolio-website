tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                cream: '#F0EFEA',
                surface: '#FFFFFF',
                'dark-bg': '#18181B',
                'dark-surface': '#27272A',
                primary: '#111827',
                'primary-dark': '#FAFAFA',
                success: '#3B82F6',
                accent: '#3B82F6',
                code: '#1e1e1e',
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'glow': '0 0 15px rgba(59, 130, 246, 0.5)',
                'paper': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            }
        }
    }
}