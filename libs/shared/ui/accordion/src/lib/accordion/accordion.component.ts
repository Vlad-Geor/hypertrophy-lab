import { CommonModule } from '@angular/common';
import { Component, contentChild, signal } from '@angular/core';
import { DividerComponent, IconComponent } from '@ikigaidev/elements';
import { AccordionBodyComponent } from '../accordion-body/accordion-body.component';
import { AccordionHeaderComponent } from '../accordion-header/accordion-header.component';

@Component({
  selector: 'hl-accordion',
  standalone: true,
  imports: [CommonModule, AccordionHeaderComponent, AccordionBodyComponent, IconComponent, DividerComponent],
  templateUrl: './accordion.component.html',
  host: {
    '[class.mb-6]': "'true'",
    '[class.block]': "'true'",
  },
})
export class AccordionComponent {
  accordionHeader = contentChild(AccordionHeaderComponent);
  accordionBody = contentChild(AccordionBodyComponent);
  expanded = signal(false);

  toggleExpand(): void {
    this.expanded.set(!this.expanded());
  }
}
