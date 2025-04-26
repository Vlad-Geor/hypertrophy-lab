import { CommonModule } from '@angular/common';
import { Component, InputSignal, InputSignalWithTransform, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IconType, ThemeColorToken } from '@ikigaidev/model';
import { getColorValue } from '@ikigaidev/util';

@Component({
  selector: 'lib-icon',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './icon.component.html',
  host: {
    style: 'display:inline-flex;',
  },
  styles: [
    '.mat-icon { display: flex; justify-content: center; align-items: center; width: fit-content; height: fit-content;}',
  ],
})
export class IconComponent {
  icon = input.required<IconType | undefined>();
  iconColor: InputSignalWithTransform<string | undefined, ThemeColorToken> = input(
    'white',
    {
      transform: (value: ThemeColorToken) => getColorValue(value),
    },
  );
  // iconColor = input<string | ThemeColor>();
  iconSize = input<number>();
  badgeData: InputSignal<number | string | undefined> = input();
}
