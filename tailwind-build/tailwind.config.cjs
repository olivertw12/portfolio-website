/* The only Tailwind config in the repo.
 *
 * Color names map onto the CSS variables in ../style.css, so any name used
 * here has to exist there. Everything else in `extend` is the site's scale:
 * radii, line heights, small type sizes, z-index layers, panel heights. They
 * live here so no page ever needs an arbitrary [value] in a class — if a
 * number isn't in this file, it isn't part of the system.
 *
 * Rebuild after editing anything here or in ../style.css:
 *   npm run build        (see README.md)
 */
module.exports = {
  darkMode: 'class',
  content: ['../*.html', '../*.js', '../projects/*.html'],
  theme: {
    extend: {
      /* Every one of these variables flips in .dark, so `text-muted` and
         `bg-surface` are correct in both themes and the markup carries no
         `dark:` variants.

         Note the text names are deliberately not `primary` — Tailwind would
         then generate a `.text-primary` that fights the button color, which
         is what the old `html .text-primary` override existed to patch. */
      colors: {
        page:    'var(--color-page)',
        surface: 'var(--color-surface)',
        wash:    'var(--color-wash)',
        divider: 'var(--color-divider)',
        code:    'var(--color-code)',

        ink:     'var(--color-text-primary)',
        body:    'var(--color-text-body)',
        muted:   'var(--color-text-muted)',
        subtle:  'var(--color-text-subtle)',

        // small text needs the darker value; decorative uses reach for
        // var(--color-accent) directly in style.css
        accent:  'var(--color-accent-text)'
      },

      fontFamily: { sans: 'var(--font-sans)', mono: 'var(--font-mono)' },

      /* One step below Tailwind's text-xs, for the card category chips. */
      fontSize: { '2xs': ['0.625rem', { lineHeight: '1rem' }] },   // 10px

      /* Four line heights, and only four. tight/snug are for display type,
         normal for UI, relaxed for anything you actually read. */
      lineHeight: {
        tight:   '1.15',
        snug:    '1.3',
        normal:  '1.5',
        relaxed: '1.65'
      },

      borderRadius: {
        'xs':  'var(--radius-xs)',   //  8px — chips, pills
        'xl':  'var(--radius-xl)',   // 10px — buttons, small elements
        '2xl': 'var(--radius-2xl)',  // 14px — nav, inner images
        '3xl': 'var(--radius-3xl)'   // 20px — cards, panels
      },

      boxShadow: { 'soft': 'var(--shadow-soft)', 'paper': 'var(--shadow-paper)' },

      aspectRatio: { photo: '4 / 3' },

      zIndex: {
        nav:           '50',
        lightbox:      '100',
        'lightbox-ui': '110'
      },

      /* Named panel heights, so a card's minimum size is a decision made
         once rather than a number typed into the markup. */
      minHeight: {
        hero:      '60vh',
        panel:     '15rem',      // 240px — figure panels
        card:      '18.75rem',   // 300px — feature card media, mobile
        'card-lg': '25rem',      // 400px — feature card, desktop
        'card-xl': '31.25rem',   // 500px — tall feature card, desktop
        page:      '11in'        // resume / cover letter paper
      },
      maxHeight: { lightbox: '85vh' },
      width:     { page: '8.5in' },

      gridTemplateColumns: { 'resume-contact': '1fr auto 1fr' },

      scale: { 102: '1.02' }
    }
  }
}
