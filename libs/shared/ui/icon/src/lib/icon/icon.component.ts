import { CommonModule } from '@angular/common';
import { DailyWorkoutOverviewComponent } from '@ikigaidev/hl/daily-workout-overview'
import {
  Component,
  InputSignal,
  InputSignalWithTransform,
  input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ThemeColor } from '@ikigaidev/model';
import { getColorValue } from '@ikigaidev/util';
import { IconType } from '../model/icon-type.model';

@Component({
  selector: 'lib-icon',
  standalone: true,
  imports: [CommonModule, MatIconModule, DailyWorkoutOverviewComponent],
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
