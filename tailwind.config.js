/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./landing-page-premium/index.html",
    "./docs/**/*.{html,js,md}",
    "./presentation/**/*.{html,js}"
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: 'var(--bg)',
        bg2: 'var(--bg2)',
        surface: 'var(--surface)',
        surface2: 'var(--surface2)',
        border: 'var(--border)',
        'border-soft': 'var(--border-soft)',
        muted: 'var(--text-muted)',
        accent: 'var(--accent)',
        'accent-dim': 'var(--accent-dim)',
        'accent-border': 'var(--accent-border)',
      }
    },
  },
  plugins: [],
}
