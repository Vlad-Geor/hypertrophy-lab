import { CommonModule } from '@angular/common';
import { Component, TemplateRef, input, viewChild } from '@angular/core';
import { Size } from '@ikigaidev/model';

@Component({
  selector: 'lib-tag',
  imports: [CommonModule],
  template: `
    <ng-template>
      <ng-content></ng-content>
    </ng-template>
    <ng-container
      [ngTemplateOutlet]="inputContent() || (content() ?? null)"
    ></ng-container>
  `,
  styleUrl: './tag.component.scss',
  host: {
    class: 'font-medium',
    '[class]': '[size(), brigtness(), theme()]',
    '[class.round-chip]': 'rounded()',
  },
})
export class TagComponent {
  theme = input<'primary' | 'secondary' | 'accent'>('primary');
  // Future support. ALlows for brighter / darker hues of primary - secondary - accent
  brigtness = input<'dark' | 'default' | 'light'>('default');
  size = input<Extract<Size, 'xs' | 'sm' | 'md' | 'lg'>>('sm');
  rounded = input<boolean>(false);
  content = viewChild<TemplateRef<unknown>>(TemplateRef);

  inputContent = input<TemplateRef<unknown>>();
}
