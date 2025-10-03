import { CommonModule } from '@angular/common';
import { Component, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: 'hl-accordion-header',

  imports: [CommonModule],
  template: `
    <ng-template><ng-content></ng-content></ng-template>
  `,
  styleUrl: './accordion-header.component.scss',
})
export class AccordionHeaderComponent {
  implicitTemplate = viewChild(TemplateRef);
}
