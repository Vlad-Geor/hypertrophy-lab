import { CommonModule } from '@angular/common';
import { Component, TemplateRef, input, viewChild } from '@angular/core';
import { Size, Theme } from '@ikigaidev/model';

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
    class: `text-token font-medium bg-token-soft border border-token-active`,
    '[class]': '[size(), theme()]',
    '[class.round-chip]': 'rounded()',
    '[attr.data-tone]': 'theme()',
  },
})
export class TagComponent {
  theme = input<Theme>('primary');
  size = input<Extract<Size, 'xs' | 'sm' | 'md' | 'lg'>>('md');
  rounded = input<boolean>(false);
  content = viewChild<TemplateRef<unknown>>(TemplateRef);

  inputContent = input<TemplateRef<unknown>>();
}
