import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'hl-accordion-header',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content></ng-content>`,
  styleUrl: './accordion-header.component.scss',
})
export class AccordionHeaderComponent {}
