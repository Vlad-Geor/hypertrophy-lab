import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'lib-input',
  imports: [CommonModule, IconComponent],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  host: { style: 'border:none' },
})
export class InputComponent {
  placeholder = input<string>();
  transparent = input<boolean>();
  type = input<'text' | 'numeric' | 'search'>();
}
