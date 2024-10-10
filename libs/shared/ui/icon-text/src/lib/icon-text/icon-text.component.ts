import { CommonModule } from '@angular/common';
import { Component, InputSignal, input } from '@angular/core';
import { ColorThemePipe } from '@ikigaidev/hl/ui/pipe';
import { IconComponent } from '@ikigaidev/icon';
import { IconType } from 'libs/shared/ui/icon/src/lib/model/icon-type.model';
import { Direction } from 'libs/shared/ui/model/position.model';
import { AllowedTextSizes } from 'libs/shared/ui/model/text-size.model';
import { ThemeColor } from 'libs/shared/ui/model/theme-color.model';

@Component({
  selector: 'lib-icon-text',
  standalone: true,
  imports: [CommonModule, IconComponent, ColorThemePipe],
  templateUrl: './icon-text.component.html',
})
export class IconTextComponent {
  iconType: InputSignal<IconType> = input.required();
  iconSize = input<number>(24);
  isIconBackground: InputSignal<boolean | undefined> = input<
    boolean | undefined
  >(false);
  textPosition: InputSignal<Direction> = input<Direction>('DOWN');
  adjacentText: InputSignal<string> = input('');
  iconColorTheme: InputSignal<ThemeColor> = input<ThemeColor>('white');
  textSize: InputSignal<AllowedTextSizes> = input<AllowedTextSizes>('text-sm');
}
