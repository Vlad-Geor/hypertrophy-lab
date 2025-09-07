/** @type {import('tailwindcss').Config} */

const gradientBorderPlugin = ({ addUtilities }) => {
  const tones = [
    'primary',
    'secondary',
    'warning',
    'success',
    'danger',
    'info',
    'accent-purple',
    'accent-pink',
    'accent-magenta',
  ];
  const utils = Object.fromEntries(
    tones.map((t) => [
      `.border-gradient-${t}`,
      {
        border: 'var(--b,1px) solid transparent',
        backgroundImage: `linear-gradient(var(--bg-fill, var(--surface)), var(--bg-fill, var(--surface)))`,
        backgroundClip: 'padding-box, border-box',
        backgroundOrigin: 'border-box',
        '--_grad': `linear-gradient(var(--g-deg,90deg),
             var(--${t}),
             hsl(from var(--${t}) h s calc(l * 0.3)))`,
        background: `linear-gradient(var(--bg-primary, var(--surface-1)), var(--bg-primary, var(--surface-1))) padding-box,
           var(--_grad) border-box`,
      },
    ]),
  );
  addUtilities(utils);
};

module.exports = {
  content: ['./apps/**/*.{html,ts}', './libs/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        /* ===== Neutrals / Surfaces ===== */
        bg: 'var(--bg)',
        surface: 'var(--surface-1)',
        'surface-2': 'var(--surface-2)',
        'surface-3': 'var(--surface-3)',
        border: 'var(--border)',

        /* Premium whites & helpers */
        white: 'hsl(from var(--white) h s l/ <alpha-value>)',
        black: 'hsl(from var(--black) h s l / <alpha-value>)',
        'white-ghost': 'var(--white-ghost)',
        'white-subtle': 'var(--white-subtle)',
        'white-soft': 'var(--white-soft)',

        /* Text tokens (direct color vars) */
        'text-1': 'var(--text-1)', // primary text
        'text-2': 'var(--text-2)', // secondary
        'text-3': 'var(--text-3)', // muted
        'text-inverse': 'var(--text-inverse)', // on bright chips
        'gray-text': 'var(--gray-bright)',

        // If you still use the old heading/body names, point them to HSL triples:
        'heading-01': 'hsl(var(--text-heading-01))',
        'heading-02': 'hsl(var(--text-heading-02))',
        'body-01': 'hsl(var(--text-body-01))',
        'body-02': 'hsl(var(--text-body-02))',
        'muted-01': 'hsl(var(--text-muted-01))',
        'muted-02': 'hsl(var(--text-muted-02))',

        /* ===== Brand / Status (solids) ===== */
        primary: 'var(--primary)',
        secondary: 'var(--secondary)', // brand yellow (not warning)
        warning: 'var(--warning)', // orange status
        success: 'var(--success)',
        danger: 'var(--danger)',
        info: 'var(--info)',
        gray: 'var(--gray)',

        /* ===== State variants (alpha-overlay) ===== */
        // Primary
        'primary-ghost': 'var(--primary-ghost)',
        'primary-subtle': 'var(--primary-subtle)',
        'primary-soft': 'var(--primary-soft)',
        'primary-hover': 'var(--primary-hover)',
        'primary-active': 'var(--primary-active)',
        'primary-ring': 'var(--primary-ring)',
        'primary-bright': 'var(--primary-bright)',
        // Secondary
        'secondary-ghost': 'var(--secondary-ghost)',
        'secondary-subtle': 'var(--secondary-subtle)',
        'secondary-soft': 'var(--secondary-soft)',
        'secondary-hover': 'var(--secondary-hover)',
        'secondary-active': 'var(--secondary-active)',
        'secondary-ring': 'var(--secondary-ring)',
        // Warning
        'warning-ghost': 'var(--warning-ghost)',
        'warning-subtle': 'var(--warning-subtle)',
        'warning-soft': 'var(--warning-soft)',
        'warning-hover': 'var(--warning-hover)',
        'warning-active': 'var(--warning-active)',
        'warning-ring': 'var(--warning-ring)',
        // Success
        'success-ghost': 'var(--success-ghost)',
        'success-subtle': 'var(--success-subtle)',
        'success-soft': 'var(--success-soft)',
        'success-hover': 'var(--success-hover)',
        'success-active': 'var(--success-active)',
        'success-ring': 'var(--success-ring)',
        // Danger
        'danger-ghost': 'var(--danger-ghost)',
        'danger-subtle': 'var(--danger-subtle)',
        'danger-soft': 'var(--danger-soft)',
        'danger-hover': 'var(--danger-hover)',
        'danger-active': 'var(--danger-active)',
        'danger-ring': 'var(--danger-ring)',
        // Info
        'info-ghost': 'var(--info-ghost)',
        'info-subtle': 'var(--info-subtle)',
        'info-soft': 'var(--info-soft)',
        'info-hover': 'var(--info-hover)',
        'info-active': 'var(--info-active)',
        'info-ring': 'var(--info-ring)',

        'gray-ghost': 'var(--gray-ghost)',
        'gray-subtle': 'var(--gray-subtle)',
        'gray-soft': 'var(--gray-soft)',
        'gray-hover': 'var(--gray-hover)',
        'gray-active': 'var(--gray-active)',
        'gray-ring': 'var(--gray-ring)',

        'accent-purple': 'var(--accent-purple)',
        'accent-purple-ghost': 'var(--accent-purple-ghost)',
        'accent-purple-subtle': 'var(--accent-purple-subtle)',
        'accent-purple-soft': 'var(--accent-purple-soft)',
        'accent-purple-hover': 'var(--accent-purple-hover)',
        'accent-purple-active': 'var(--accent-purple-active)',
        'accent-purple-ring': 'var(--accent-purple-ring)',

        'accent-pink': 'var(--accent-pink)',
        'accent-pink-ghost': 'var(--accent-pink-ghost)',
        'accent-pink-subtle': 'var(--accent-pink-subtle)',
        'accent-pink-soft': 'var(--accent-pink-soft)',
        'accent-pink-hover': 'var(--accent-pink-hover)',
        'accent-pink-active': 'var(--accent-pink-active)',
        'accent-pink-ring': 'var(--accent-pink-ring)',

        'accent-magenta': 'var(--accent-magenta)',
        'accent-magenta-ghost': 'var(--accent-magenta-ghost)',
        'accent-magenta-subtle': 'var(--accent-magenta-subtle)',
        'accent-magenta-soft': 'var(--accent-magenta-soft)',
        'accent-magenta-hover': 'var(--accent-magenta-hover)',
        'accent-magenta-active': 'var(--accent-magenta-active)',
        'accent-magenta-ring': 'var(--accent-magenta-ring)',
      },
      ringColor: {
        DEFAULT: 'var(--primary-ring)',
        primary: 'var(--primary-ring)',
        secondary: 'var(--secondary-ring)',
        warning: 'var(--warning-ring)',
        success: 'var(--success-ring)',
        danger: 'var(--danger-ring)',
        info: 'var(--info-ring)',
      },
      borderColor: {
        DEFAULT: 'var(--border)',
      },
      fontSize: { xxs: '10px' },
      textColor: {
        skin: {
          base: 'var(--text-1)',
          muted: 'var(--text-3)',
          inverse: 'var(--text-inverse)',
        },
      },
      outlineColor: {
        DEFAULT: 'var(--primary-ring)',
        primary: 'var(--primary-ring)',
        secondary: 'var(--secondary-ring)',
        warning: 'var(--warning-ring)',
        success: 'var(--success-ring)',
        danger: 'var(--danger-ring)',
        info: 'var(--info-ring)',
      },

      borderRadius: { '2xl': '1rem' },
      ringWidth: { DEFAULT: '2px' },
      boxShadow: {
        surface: '0 1px 2px 0 hsl(0 0% 0% / 0.2), 0 8px 24px -6px hsl(0 0% 0% / 0.35)',
      },
      ringOffsetColor: {
        DEFAULT: 'var(--surface)',
      },
      backgroundImage: {
        'gradient-primary':
          'linear-gradient(270deg, var(--primary), hsl(from var(--primary) h s calc(l * 0.5)))',
        'gradient-secondary':
          'linear-gradient(270deg, var(--secondary), hsl(from var(--secondary) h s calc(l * 0.5)))',
        'gradient-warning':
          'linear-gradient(270deg, var(--warning), hsl(from var(--warning) h s calc(l * 0.5)))',
        'gradient-success':
          'linear-gradient(270deg, var(--success), hsl(from var(--success) h s calc(l * 0.5)))',
        'gradient-danger':
          'linear-gradient(270deg, var(--danger), hsl(from var(--danger) h s calc(l * 0.5)))',
        'gradient-info':
          'linear-gradient(270deg, var(--info), hsl(from var(--info) h s calc(l * 0.5)))',

        // accents
        'gradient-accent-purple':
          'linear-gradient(270deg, var(--accent-purple), hsl(from var(--accent-purple) h s calc(l * 0.5)))',
        'gradient-accent-pink':
          'linear-gradient(270deg, var(--accent-pink), hsl(from var(--accent-pink) h s calc(l * 0.5)))',
        'gradient-accent-magenta':
          'linear-gradient(270deg, var(--accent-magenta), hsl(from var(--accent-magenta) h s calc(l * 0.5)))',
      },

      /* Allow SVGs and dividers use the same palette */
      stroke: (theme) => theme('colors'),
      fill: (theme) => theme('colors'),
      divideColor: (theme) => ({
        DEFAULT: theme('colors.border'),
      }),
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    gradientBorderPlugin,
  ],
};
