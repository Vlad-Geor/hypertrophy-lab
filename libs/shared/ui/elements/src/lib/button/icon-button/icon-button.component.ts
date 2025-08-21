import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
// import { Icon } from '@shared/nds/model/icon.type';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'range-icon',
  imports: [CommonModule],
  templateUrl: './icon-button.component.html',
  host: {},
  styles: [
    `
      :host {
        display: inline-flex;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent {
  // name = input.required<Icon | undefined>();
  // color = input<ThemeOrColor | undefined>();
  // colorToken = input<string>();
  // size = input<IconSize>('sm');
  // hostSize = computed(() => `${mapSize(this.size())}px`);
}
