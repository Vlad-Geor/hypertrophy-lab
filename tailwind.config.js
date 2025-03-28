module.exports = {
  content: ['./apps/**/*.{html,ts}', './libs/**/*.{html,ts}'],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-9deg)' },
          '50%': { transform: 'rotate(9deg)' },
        },
      },
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: {
            DEFAULT: 'var(--color-primary-light)',
            hover: 'var(--color-primary-light-hover)',
            faded: 'var(--color-primary-light-faded)'
          },
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
          background:{ 
            DEFAULT: 'var(--color-gray-background)',
            faded: 'var(--color-gray-background-faded)'},
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
      fontSize: {
        xxs: '10px',
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
      },
      boxShadow: {
        'hl-light':
          '0 1px 1px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 1px 5px rgba(0, 0, 0, 0.12)',
        'custom-dark': '0 4px 6px rgba(0, 0, 0, 0.3)',
      },
      gradientColorStops: (theme) => ({
        primary: theme('colors.primary'),
        secondary: theme('colors.secondary'),
      }),
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
