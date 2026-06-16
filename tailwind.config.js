/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
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
        // Design system colors
        foreground: 'var(--text-foreground)',
        'foreground-alt': 'var(--text-foreground-alt)',
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        tertiary: 'var(--text-tertiary)',
        disabled: 'var(--text-disabled)',
      }
    },
  },
  plugins: [],
}
