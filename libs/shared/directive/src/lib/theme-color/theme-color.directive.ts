import { Directive, ElementRef, Renderer2, effect, inject, input } from '@angular/core';
import { CssColorFor, ThemeColorToken, colorTokenMap } from '@ikigaidev/model';

@Directive({
  selector: '[libThemeColor]',
})
export class ThemeColorDirective {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  colorToken = input<ThemeColorToken>();
  cssProperty = input<CssColorFor>('background-color');

  constructor() {
    effect(() => {
      const cssValue = colorTokenMap[this.colorToken() ?? ''];
      this.renderer.setStyle(this.el.nativeElement, this.cssProperty(), cssValue);
    });
  }
}
