import { CommonModule } from '@angular/common';
import { Component, contentChild } from '@angular/core';
import { AccordionBodyComponent } from '../accordion-body/accordion-body.component';
import { AccordionHeaderComponent } from '../accordion-header/accordion-header.component';

@Component({
  selector: 'hl-accordion',
  standalone: true,
  imports: [CommonModule, AccordionHeaderComponent, AccordionBodyComponent],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
})
export class AccordionComponent {
  accordionBody = contentChild(AccordionBodyComponent);

  expand(): void {
    console.log('TBD');
  }
}
