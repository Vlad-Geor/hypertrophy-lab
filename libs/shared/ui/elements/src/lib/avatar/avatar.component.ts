import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-avatar',
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
  host: {
    '[style.height.px]': 'size()',
    '[style.width.px]': 'size()',
  },
})
export class AvatarComponent {
  size = input<number>(24);
}
