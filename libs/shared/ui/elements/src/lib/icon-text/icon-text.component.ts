import { Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { IconType, Theme } from '@ikigaidev/model';

@Component({
  selector: 'lib-icon-text',
  template: `
    <lib-icon [icon]="icon()"></lib-icon>
  `,
  imports: [IconComponent],
})
export class IconTextComponent {
  icon = input<IconType>();
  iconColor = input<Theme>();
}
