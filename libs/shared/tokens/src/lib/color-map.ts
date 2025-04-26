// color-tokens.ts

export const colorMap = {
  ui: {
    white: 'var(--color-ui-white)',
    black: 'var(--color-ui-black)',
    background: {
      primary: 'var(--color-ui-background-primary)',
      secondary: 'var(--color-ui-background-secondary)',
      tertiary: 'var(--color-ui-background-tertiary)',
    },
    text: {
      primary: 'var(--color-ui-text-primary)',
      secondary: 'var(--color-ui-text-secondary)',
      onPrimary: 'var(--color-ui-text-on-primary)',
      onSecondary: 'var(--color-ui-text-on-secondary)',
    },
  },
  primary: {
    default: 'var(--color-primary-default)',
    hover: 'var(--color-primary-hover)',
    active: 'var(--color-primary-active)',
    selected: 'var(--color-primary-selected)',
  },
  state: {
    error: 'var(--color-state-error)',
    success: 'var(--color-state-success)',
    warning: 'var(--color-state-warning)',
    disabled: 'var(--color-state-disabled)',
    info: 'var(--color-state-info)',
  },
  border: {
    default: 'var(--color-border-default)',
    focus: 'var(--color-border-focus)',
    divider: 'var(--color-border-divider)',
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
  // Optional if you want direct access to color shades
  // teal: {
  //   50: 'var(--color-teal-50)',
  //   100: 'var(--color-teal-100)',
  //   200: 'var(--color-teal-200)',
  //   300: 'var(--color-teal-300)',
  //   400: 'var(--color-teal-400)',
  //   500: 'var(--color-teal-500)',
  //   600: 'var(--color-teal-600)',
  //   700: 'var(--color-teal-700)',
  //   800: 'var(--color-teal-800)',
  //   900: 'var(--color-teal-900)',
  // },
  // yellow: {
  //   50: 'var(--color-yellow-50)',
  //   100: 'var(--color-yellow-100)',
  //   200: 'var(--color-yellow-200)',
  //   300: 'var(--color-yellow-300)',
  //   400: 'var(--color-yellow-400)',
  //   500: 'var(--color-yellow-500)',
  //   600: 'var(--color-yellow-600)',
  //   700: 'var(--color-yellow-700)',
  //   800: 'var(--color-yellow-800)',
  //   900: 'var(--color-yellow-900)',
  // },
} as const;
