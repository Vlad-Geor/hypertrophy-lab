import { CommonModule } from '@angular/common';
import {
  Component,
  InputSignal,
  InputSignalWithTransform,
  OnInit,
  input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IconType, ThemeColor } from '@ikigaidev/model';
import { getColorValue } from '@ikigaidev/util';

@Component({
  selector: 'lib-icon',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './icon.component.html',
  styles: [
    '.mat-icon { display: flex; justify-content: center; align-items: center; min-width: 44px; min-height: 44px}',
  ],
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
