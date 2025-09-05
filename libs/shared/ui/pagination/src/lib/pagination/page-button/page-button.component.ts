import { Component, inject, input } from '@angular/core';
import { Theme } from '@ikigaidev/model';
import { PaginatorComponent } from '../paginator.component';

@Component({
  selector: 'lib-paginator-page-button',
  template: `
    <button
      class="w-8 h-8 flex-shrink-0 rounded-full text-sm font-medium"
      [class.bg-white]="!active()"
      [class.bg-secondary]="active()"
    >
      <ng-content></ng-content>
    </button>
  `,
  styleUrl: './page-button.component.scss',
  host: {
    '(click)': 'parentPaginator?.activePage?.set((this.index() ?? 0) + 1)',
  },
})
export class PaginatorPageButtonComponent {
  readonly parentPaginator = inject(PaginatorComponent);

  index = input<number>();
  active = input<boolean>();
  theme = input<Theme | 'white'>('white');
}
