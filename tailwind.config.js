module.exports = {
  content: ['./apps/**/*.{html,ts}', './libs/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: {
            DEFAULT: 'var(--color-primary-light)',
            hover: 'var(--color-primary-light-hover)',
            faded: 'var(--color-primary-light-faded)',
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
          background: {
            DEFAULT: 'var(--color-gray-background)',
            faded: 'var(--color-gray-background-faded)',
          },
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
        body: ['var(--font-body)', 'serif'],
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
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-9deg)' },
          '50%': { transform: 'rotate(9deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
