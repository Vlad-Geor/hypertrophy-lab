import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
// import { Icon } from '@shared/nds/model/icon.type';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'range-icon',
  imports: [CommonModule],
  templateUrl: './icon-button.component.html',
  host: {
    '[style.height]': 'hostSize()',
    '[style.width]': 'hostSize()',
  },
  styles: [
    `
      :host {
        display: flex;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  // name = input.required<Icon | undefined>();
  // color = input<ThemeOrColor | undefined>();
  // colorToken = input<string>();
  // size = input<IconSize>('sm');

  // hostSize = computed(() => `${mapSize(this.size())}px`);
}