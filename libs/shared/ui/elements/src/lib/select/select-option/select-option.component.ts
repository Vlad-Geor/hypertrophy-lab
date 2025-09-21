import { Component, TemplateRef, input, viewChild } from '@angular/core';
import { CellConfig } from '@ikigaidev/model';

@Component({
  selector: 'lib-select-option',
  template: `
    <ng-template>
      <div class="flex items-center gap-2"><ng-content></ng-content></div>
    </ng-template>
  `,
})
export class SelectOptionComponent {
  readonly optionTpl = viewChild(TemplateRef);

  optionConfig = input<CellConfig>();
}
