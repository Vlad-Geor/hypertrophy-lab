import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ButtonComponent, TagComponent, TagGroupComponent } from '@ikigaidev/elements';
import { SupplementInventoryItem } from '@ikigaidev/hl/model';

@Component({
  selector: 'hl-supplement-card',
  imports: [CommonModule, TagComponent, ButtonComponent, TagGroupComponent],
  templateUrl: './supplement-card.component.html',
  styleUrl: './supplement-card.component.scss',
})
export class SupplementCardComponent {
  supplement = input<SupplementInventoryItem>();
}
