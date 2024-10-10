import { Pipe, PipeTransform } from '@angular/core';

export type ThemeColorFor = 'text' | 'background';

@Pipe({
  name: 'colorTheme',
  standalone: true,
})
export class ColorThemePipe implements PipeTransform {
  transform(value: string, themeFor: ThemeColorFor): string {
    const kebabCasedValue = value.replace('.', '-');

    return themeFor === 'background'
      ? `bg-${kebabCasedValue}`
      : `text-${kebabCasedValue}`;
  }
}
