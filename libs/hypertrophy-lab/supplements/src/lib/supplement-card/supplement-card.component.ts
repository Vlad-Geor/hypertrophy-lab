import { CommonModule } from '@angular/common';
import { Component, effect, input } from '@angular/core';
import { ImagePlaceholderDirective } from '@ikigaidev/directive';
import { ButtonComponent, TagComponent, TagGroupComponent } from '@ikigaidev/elements';
import { SupplementCatalogItem } from '@ikigaidev/hl/contracts';

@Component({
  selector: 'hl-supplement-card',
  imports: [
    CommonModule,
    TagComponent,
    ButtonComponent,
    TagGroupComponent,
    ImagePlaceholderDirective,
  ],
  templateUrl: './supplement-card.component.html',
  styleUrl: './supplement-card.component.scss',
})
export class SupplementCardComponent {
  supplement = input<SupplementCatalogItem>();

  constructor() {
    effect(() => console.log(this.supplement()));
  }
}
