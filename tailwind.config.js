module.exports = {
  content: ['./apps/**/*.{html,ts}', './libs/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Surfaces
        bg: 'hsl(var(--bg-hsl) / <alpha-value>)',
        surface: 'hsl(var(--surface-hsl) / <alpha-value>)',
        surface2: 'hsl(var(--surface-variant-hsl) / <alpha-value>)',
        border: 'hsl(0 0% var(--border-l) / <alpha-value>)',

        // Text scale
        text: {
          DEFAULT: 'hsl(var(--txt1-hsl) / <alpha-value>)',
          primary: 'hsl(var(--txt1-hsl) / <alpha-value>)',
          secondary: 'hsl(var(--txt2-hsl) / <alpha-value>)',
          muted: 'hsl(var(--txt3-hsl) / <alpha-value>)',
          inverse: 'hsl(0 0% var(--l-text-inverse) / <alpha-value>)',
        },

        // Semantic bases
        primary: 'hsl(var(--primary-hsl) / <alpha-value>)',
        success: 'hsl(var(--success-hsl) / <alpha-value>)',
        warning: 'hsl(var(--warning-hsl) / <alpha-value>)',
        danger: 'hsl(var(--danger-hsl)  / <alpha-value>)',
        info: 'hsl(var(--info-hsl)    / <alpha-value>)',

        // Semantic states (so you can do bg-primary-hover, etc.)
        'primary-hover': 'var(--primary-hover)',
        'primary-active': 'var(--primary-active)',
        'primary-ring': 'var(--primary-ring)',
        'primary-subtle': 'var(--primary-subtle)',
        'primary-soft': 'var(--primary-soft)',
        'primary-ghost': 'var(--primary-ghost)',

        'success-hover': 'var(--success-hover)',
        'success-active': 'var(--success-active)',
        'success-ring': 'var(--success-ring)',
        'success-subtle': 'var(--success-subtle)',
        'success-soft': 'var(--success-soft)',
        'success-ghost': 'var(--success-ghost)',

        'warning-hover': 'var(--warning-hover)',
        'warning-active': 'var(--warning-active)',
        'warning-ring': 'var(--warning-ring)',
        'warning-subtle': 'var(--warning-subtle)',
        'warning-soft': 'var(--warning-soft)',
        'warning-ghost': 'var(--warning-ghost)',

        'danger-hover': 'var(--danger-hover)',
        'danger-active': 'var(--danger-active)',
        'danger-ring': 'var(--danger-ring)',
        'danger-subtle': 'var(--danger-subtle)',
        'danger-soft': 'var(--danger-soft)',
        'danger-ghost': 'var(--danger-ghost)',

        'info-hover': 'var(--info-hover)',
        'info-active': 'var(--info-active)',
        'info-ring': 'var(--info-ring)',
        'info-subtle': 'var(--info-subtle)',
        'info-soft': 'var(--info-soft)',
        'info-ghost': 'var(--info-ghost)',
      },

      // (Optional) map default ring/border/background to our tokens
      ringColor: {
        DEFAULT: 'var(--primary-ring)',
        primary: 'var(--primary-ring)',
        success: 'var(--success-ring)',
        warning: 'var(--warning-ring)',
        danger: 'var(--danger-ring)',
        info: 'var(--info-ring)',
      },
      borderColor: {
        DEFAULT: 'hsl(0 0% var(--border-l) / 1)',
      },
      fontSize: {
        xxs: '10px',
      },
      backgroundColor: {
        skin: {
          bg: 'hsl(var(--bg-hsl) / <alpha-value>)',
          surface: 'hsl(var(--surface-hsl) / <alpha-value>)',
          surface2: 'hsl(var(--surface-variant-hsl) / <alpha-value>)',
        },
      },
      textColor: {
        skin: {
          base: 'hsl(var(--txt1-hsl) / <alpha-value>)',
          muted: 'hsl(var(--txt3-hsl) / <alpha-value>)',
          inverse: 'hsl(0 0% var(--l-text-inverse) / <alpha-value>)',
        },
      },
      outlineColor: {
        DEFAULT: 'var(--primary-ring)',
        primary: 'var(--primary-ring)',
        success: 'var(--success-ring)',
        warning: 'var(--warning-ring)',
        danger: 'var(--danger-ring)',
        info: 'var(--info-ring)',
      },
      borderRadius: { '2xl': '1rem' }, // matches your rounded chips/cards
      ringWidth: { DEFAULT: '2px' }, // consistent focus thickness
      boxShadow: {
        // optional, but nice for your UI
        surface: '0 1px 2px 0 hsl(0 0% 0% / 0.2), 0 8px 24px -6px hsl(0 0% 0% / 0.35)',
      },
      ringOffsetColor: {
        DEFAULT: 'hsl(var(--surface-hsl) / 1)',
      },
      stroke: (theme) => theme('colors'), // enables stroke-primary, etc.
      fill: (theme) => theme('colors'), // enables fill-warning, etc.
      divideColor: (theme) => ({
        DEFAULT: theme('colors.border'),
      }),
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
