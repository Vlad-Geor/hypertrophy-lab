import { CommonModule } from '@angular/common';
import {
  Component,
  InputSignal,
  InputSignalWithTransform,
  input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { getColorValue } from '@ikigaidev/util';
import { ThemeColor } from 'libs/shared/ui/model/theme-color.model';
import { IconType } from '../model/icon-type.model';

@Component({
  selector: 'lib-icon',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './icon.component.html',
  styles: [
    '.mat-icon { display: flex; justify-content: center; align-items: center; min-width: 44px; min-height: 44px}',
  ],
})
export class IconComponent {
  icon = input.required<IconType>();
  iconColor: InputSignalWithTransform<string | undefined, ThemeColor> = input(
    'white',
    {
      transform: (value: ThemeColor) => getColorValue(value),
    }
  );
  iconSize = input<number>();
  badgeData: InputSignal<number | string | undefined> = input();
}
