import { CommonModule } from '@angular/common';
import {
  Component,
  InputSignal,
  InputSignalWithTransform,
  OnInit,
  input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ThemeColor } from '@ikigaidev/model';
import { getColorValue } from '@ikigaidev/util';

export type IconType =
  | 'notifications'
  | 'notifications_none'
  | 'fitness_center'
  | 'ramen_dining'
  | 'favorite'
  | 'search'
  | 'settings'
  | 'done'
  | 'info'
  | 'check_circle'
  | 'delete'
  | 'favorite_border'
  | 'lock'
  | 'local_dining'
  | 'smart_display'
  | 'expand_more'
  | 'person'
  | 'expand_circle_up'
  | 'expand_circle_down';

@Component({
  selector: 'lib-icon',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './icon.component.html',
  styles: [
    '.mat-icon { display: flex; justify-content: center; align-items: center; min-width: 44px; min-height: 44px}',
  ],
  host: {
    'class': 'rounded-2xl p-1 relative flex-center'
  }
})
export class IconComponent implements OnInit {
  icon = input.required<IconType | undefined>();
  iconColor: InputSignalWithTransform<string | undefined, ThemeColor> = input('white', {
    transform: (value: ThemeColor) => getColorValue(value),
  });
  // iconColor = input<string | ThemeColor>();
  iconSize = input<number>();
  badgeData: InputSignal<number | string | undefined> = input();

  ngOnInit(): void {
    console.log(this.icon());
  }
}
