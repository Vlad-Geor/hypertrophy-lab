import { CommonModule } from '@angular/common';
import { Component, InputSignal, input } from '@angular/core';
import { ColorThemePipe } from '@ikigaidev/hl/ui/pipe';
import { AllowedTextSizes, Direction, IconType, ThemeColor } from '@ikigaidev/model';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'lib-icon-text',
  standalone: true,
  imports: [CommonModule, IconComponent, ColorThemePipe],
  templateUrl: './icon-text.component.html',
})
export class IconTextComponent {
  iconType: InputSignal<IconType> = input.required();
  iconSize = input<number>(24);
  isIconBackground: InputSignal<boolean | undefined> = input<boolean | undefined>(false);
  textPosition: InputSignal<Direction> = input<Direction>('DOWN');
  adjacentText: InputSignal<string> = input('');
  iconColorTheme: InputSignal<ThemeColor> = input<ThemeColor>('white');
  textSize: InputSignal<AllowedTextSizes> = input<AllowedTextSizes>('text-sm');
}
