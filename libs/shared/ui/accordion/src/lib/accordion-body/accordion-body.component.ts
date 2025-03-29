import { Component, TemplateRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'hl-accordion-body',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion-body.component.html',
  styleUrl: './accordion-body.component.scss',
})
export class AccordionBodyComponent {
  implicitTemplate = viewChild(TemplateRef);
}
