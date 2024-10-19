import { THEME_COLORS } from '@ikigaidev/model';

export function getColorValue(colorKey: string): string | undefined {
  const keys = colorKey.split('.');

  let colorValue: any = THEME_COLORS;
  for (const key of keys) {
    colorValue = colorValue?.[key];
    if (!colorValue) return undefined;
  }

  return colorValue;
}
