import { Component, TemplateRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'hl-accordion-header',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-template><ng-content></ng-content></ng-template>`,
  styleUrl: './accordion-header.component.scss',
})
export class AccordionHeaderComponent {
  implicitTemplate = viewChild(TemplateRef);
}
