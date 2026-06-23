/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    {
      pattern: /^(bg|text|border|ring|from|via|to|fill|stroke)-tenant-(primary|secondary|accent)$/,
      variants: ['hover', 'focus', 'focus-visible', 'active', 'disabled', 'group-hover'],
    },
  ],
  theme: {
    extend: {
      colors: {
        tenant: {
          primary: 'var(--tenant-primary)',
          secondary: 'var(--tenant-secondary)',
          accent: 'var(--tenant-accent)',
        },
      },
    },
  },
  plugins: [],
}
