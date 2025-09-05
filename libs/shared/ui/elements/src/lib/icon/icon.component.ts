import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IconType } from '@ikigaidev/model';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'lib-icon',
  standalone: true,
  imports: [CommonModule, MatIconModule, AngularSvgIconModule],
  templateUrl: './icon.component.html',
  host: {
    style: 'display:inline-flex;',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  icon = input.required<IconType | undefined>();
  color = input<string>('inherit');
  iconSize = input<number>(20);
  inheritCurrentColor = input(true);
}
