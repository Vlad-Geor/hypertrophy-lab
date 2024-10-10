module.exports = {
  content: ['./apps/**/*.{html,ts}', './libs/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
        },
        secondary: {
          light: 'var(--color-secondary-light)',
          dark: 'var(--color-secondary-dark)',
        },
        white: {
          DEFAULT: 'var(--color-white)',
        },
        gray: {
          disabled: 'var(--color-gray-disabled)',
          background: 'var(--color-gray-background)',
          helper: 'var(--color-gray-helper)',
        },
        black: {
          text: 'var(--color-black-text)',
          ui: 'var(--color-black-ui)',
          background: 'var(--color-black-background)',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        primary: ['var(--font-primary)', 'serif'],
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
      },
      gradientColorStops: (theme) => ({
        primary: theme('colors.primary'),
        secondary: theme('colors.secondary'),
      }),
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
