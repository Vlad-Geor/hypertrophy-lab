export const THEME_COLORS = {
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
  accent: {
    DEFAULT: 'var(--color-accent)',
  },
  gray: {
    disabled: 'var(--color-gray-disabled)',
    background: {
      DEFAULT: 'var(--color-gray-background)',
      faded: 'var(--color-gray-background-faded)',
    },
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
  },
  black: {
    text: 'var(--color-black-text)',
    ui: 'var(--color-ui-black)',
    background: 'var(--color-black-background)',
  },
  border: {
    default: 'var(--color-border-default)',
    focus: 'var(--color-border-focus)',
    divider: 'var(--color-border-divider)',
    subtle: 'var(--color-border-subtle)',
  },
} as const;
