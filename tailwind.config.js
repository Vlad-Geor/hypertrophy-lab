module.exports = {
  content: ['./apps/**/*.{html,ts}', './libs/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        teal: {
          650: 'var(--color-teal-650)',
          1000: '#022F2E',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: {
            DEFAULT: 'var(--color-primary-light)',
            hover: 'var(--color-primary-light-hover)',
            faded: 'var(--color-primary-light-faded)',
          },
          dark: 'var(--color-primary-dark)',
          darkest: 'var(--color-ui-background-primary-darkest)',
        },
        secondary: {
          light: 'var(--color-secondary-light)',
          dark: 'var(--color-secondary-dark)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
        },
        gray: {
          disabled: 'var(--color-gray-disabled)',
          background: {
            DEFAULT: 'var(--color-gray-background)',
            dark: 'var(--color-gray-dark-background)',
            faded: 'var(--color-gray-background-faded)',
          },
          text: 'var(--color-white-a80)',
          helper: 'var(--color-gray-helper)',
        },
        neutral: {
          50: 'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
        },
        state: {
          error: 'var(--color-state-error)',
          warning: 'var(--color-state-warning)',
          success: 'var(--color-state-success)',
          info: 'var(--color-state-info)',
        },
        white: {
          DEFAULT: 'var(--color-ui-white)',
          faded: 'var(--color-ui-white-a60)',
        },
        black: {
          text: 'var(--color-black-text)',
          ui: 'var(--color-ui-black)',
          background: 'var(--color-black-background)',
        },
        border: {
          default: 'var(--color-border-default)',
          primary: 'var(--color-border-primary)',
          focus: 'var(--color-border-focus)',
          divider: 'var(--color-border-divider)',
          subtle: 'var(--color-border-subtle)',
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
