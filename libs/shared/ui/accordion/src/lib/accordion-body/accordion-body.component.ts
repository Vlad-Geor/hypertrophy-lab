import { CommonModule } from '@angular/common';
import { Component, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: 'hl-accordion-body',

  imports: [CommonModule],
  templateUrl: './accordion-body.component.html',
  styleUrl: './accordion-body.component.scss',
})
export class AccordionBodyComponent {
  implicitTemplate = viewChild(TemplateRef);
}
