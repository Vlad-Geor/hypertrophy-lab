import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OverlayDirective } from '@ikigaidev/directive';

@Component({
  selector: 'hl-playground',
  templateUrl: './playground.component.html',
  styleUrl: './playground.component.scss',
  imports: [CommonModule, OverlayDirective],
})
export class PlaygroundComponent {
  selectedOption = 'Soft Arch';

  selectOption(option: string) {
    this.selectedOption = option;
  }
}
