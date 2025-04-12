import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { IconComponent } from "../icon/icon.component";
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'lib-input',
  imports: [CommonModule, IconComponent, AvatarComponent],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  host: { style: 'border:none' },
})
export class InputComponent {
  placeholder = input<string>();
  transparent = input<boolean>();
  type = input<'text' | 'numeric' | 'search'>();
}
