import { CommonModule } from '@angular/common';
import { Component, InputSignal, input } from '@angular/core';
import { AllowedTextSizes, Direction, IconType, ThemeColorToken } from '@ikigaidev/model';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'lib-icon-text',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './icon-text.component.html',
})
export class IconTextComponent {
  iconType: InputSignal<IconType> = input.required();
  iconSize = input<number>(24);
  isIconBackground: InputSignal<boolean | undefined> = input<boolean | undefined>(false);
  textPosition: InputSignal<Direction> = input<Direction>('DOWN');
  adjacentText: InputSignal<string> = input('');
  iconColorTheme: InputSignal<ThemeColorToken> = input<ThemeColorToken>('white');
  textSize: InputSignal<AllowedTextSizes> = input<AllowedTextSizes>('text-sm');
}
