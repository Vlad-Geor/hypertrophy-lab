import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent, TagComponent } from '@ikigaidev/elements';

@Component({
  selector: 'hl-supplement-card',
  imports: [CommonModule, TagComponent, ButtonComponent],
  templateUrl: './supplement-card.component.html',
  styleUrl: './supplement-card.component.scss',
})
export class SupplementCardComponent {
  
}
